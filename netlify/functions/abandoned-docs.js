import { admin } from './_lib.js';
import { sendEmail, wrapEmail } from './_email.js';
import { APP_NAME } from '../../src/lib/constants.js';

// Scheduled daily: nudge users who built a document but never unlocked/paid for
// it. We wait ~1 day, only email once (a flag in field_data), and skip anyone
// who opted out of reminders. Runs as service-role (Netlify env).
export const handler = async () => {
  const supabase = admin();
  const now = Date.now();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const appUrl = process.env.APP_URL || 'http://localhost:8888';

  // Unpaid previews from the last week that are at least a day old.
  const { data: docs, error } = await supabase
    .from('documents')
    .select('id, user_id, doc_type, title, field_data')
    .eq('paid', false)
    .eq('status', 'preview')
    .lt('created_at', oneDayAgo)
    .gt('created_at', sevenDaysAgo);
  if (error) return { statusCode: 500, body: error.message };

  let sent = 0;
  for (const d of docs || []) {
    if (d.field_data && d.field_data.abandonEmailed) continue; // already nudged

    const { data: prof } = await supabase
      .from('profiles')
      .select('email, full_name, reminder_emails')
      .eq('id', d.user_id)
      .single();

    if (prof?.email && prof.reminder_emails !== false) {
      try {
        await sendEmail({
          to: prof.email,
          subject: `Finish your ${d.title} — ${APP_NAME}`,
          html: wrapEmail(`
            <p>Hello${prof.full_name ? ' ' + prof.full_name : ''},</p>
            <p>You started preparing a <strong>${d.title}</strong> but haven't downloaded
            the final copy yet. Housing court runs on strict deadlines — don't let yours slip.</p>
            <p>Your answers are saved. Pick up right where you left off:</p>
            <p><a href="${appUrl}/document/${d.doc_type}"
              style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">
              Finish &amp; download my document
            </a></p>
          `),
        });
        sent += 1;
      } catch (e) {
        continue; // leave unmarked so a later run can retry
      }
    }

    // Mark as nudged (merge into existing field_data so answers are preserved).
    await supabase
      .from('documents')
      .update({ field_data: { ...(d.field_data || {}), abandonEmailed: true } })
      .eq('id', d.id);
  }

  return { statusCode: 200, body: JSON.stringify({ candidates: (docs || []).length, sent }) };
};

// Netlify scheduled function — daily at 15:00 UTC.
export const config = { schedule: '0 15 * * *' };
