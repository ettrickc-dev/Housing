import { admin } from './_lib.js';
import { sendEmail, wrapEmail } from './_email.js';
import { APP_NAME } from '../../src/lib/constants.js';

// Scheduled daily: email users whose notice period / next action is due today
// or overdue, then mark the workflow so we don't re-send. Runs as service-role
// (no user context) — set SUPABASE_SERVICE_ROLE_KEY in Netlify env.
export const handler = async () => {
  const supabase = admin();
  const today = new Date().toISOString().slice(0, 10);

  const { data: due, error } = await supabase
    .from('workflows')
    .select('*')
    .lte('next_action_date', today)
    .eq('reminder_sent', false);
  if (error) return { statusCode: 500, body: error.message };

  let sent = 0;
  for (const wf of due || []) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('email, full_name, reminder_emails')
      .eq('id', wf.user_id)
      .single();

    // Respect the user's reminder preference, but still mark handled.
    if (prof?.email && prof.reminder_emails !== false) {
      try {
        await sendEmail({
          to: prof.email,
          subject: `Reminder: ${wf.next_action_label || 'next step'} — ${APP_NAME}`,
          html: wrapEmail(`
            <p>Hello${prof.full_name ? ' ' + prof.full_name : ''},</p>
            <p>This is a reminder for your <strong>${wf.workflow_type.replace(/_/g, ' ')}</strong> matter:</p>
            <p style="background:#fef3c7;padding:12px;border-radius:6px">
              <strong>${wf.next_action_label || 'Next step'}</strong> is due on
              <strong>${wf.next_action_date}</strong>.
            </p>
            <p>Log in to prepare your next document.</p>
          `),
        });
        sent += 1;
      } catch (e) {
        // Leave reminder_sent=false so a later run can retry this one.
        continue;
      }
    }
    await supabase.from('workflows').update({ reminder_sent: true }).eq('id', wf.id);
  }

  return { statusCode: 200, body: JSON.stringify({ due: (due || []).length, sent }) };
};

// Netlify scheduled function — daily at 13:00 UTC.
export const config = { schedule: '0 13 * * *' };
