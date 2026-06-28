import crypto from 'node:crypto';
import { admin } from './_lib.js';
import { sendEmail, wrapEmail } from './_email.js';
import { APP_NAME } from '../../src/lib/constants.js';

// Scheduled weekly: AUTOMATICALLY DETECT when official NY law sources change.
// On change we (1) flag the related statute for review, (2) log it to the law
// update log, and (3) email the admin to review. We do NOT auto-rewrite any
// legal text — a human approves the change. This is the safe "auto-update".
export const handler = async () => {
  const supabase = admin();
  const { data: sources, error } = await supabase.from('law_sources').select('*');
  if (error) return { statusCode: 500, body: error.message };

  const changed = [];
  for (const s of sources || []) {
    try {
      const res = await fetch(s.url, {
        headers: { 'user-agent': 'PlainRightsLawWatch/1.0 (+legal compliance monitor)' },
        redirect: 'follow',
      });
      if (!res.ok) continue;
      const raw = await res.text();
      // Normalize away volatile markup so we only flag real content changes.
      const norm = raw
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const hash = crypto.createHash('sha256').update(norm).digest('hex');

      const patch = { last_checked: new Date().toISOString(), last_hash: hash };
      if (s.last_hash && s.last_hash !== hash) {
        patch.last_changed = new Date().toISOString();
        changed.push(s);
        if (s.citation) {
          await supabase.from('statutes').update({ flagged_for_review: true }).eq('citation', s.citation);
        }
        await supabase.from('law_review_log').insert({
          citation: s.citation || s.label,
          action: 'source_changed',
          note: `Monitored law source changed and needs review: ${s.label}`,
          admin_email: 'law-watch (automatic)',
        });
      }
      await supabase.from('law_sources').update(patch).eq('id', s.id);
    } catch (e) {
      // Network hiccup — skip this source this run.
    }
  }

  if (changed.length && process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Law change detected — ${changed.length} source(s) need review — ${APP_NAME}`,
      html: wrapEmail(`
        <p>Automated law monitoring detected changes on these official sources:</p>
        <ul>${changed.map((c) => `<li><strong>${c.label}</strong> — <a href="${c.url}">${c.url}</a></li>`).join('')}</ul>
        <p>The related statutes have been <strong>flagged for review</strong> in your Admin Law
        Review dashboard, and a banner is showing on affected documents. Please review the
        change and update the templates and last-verified dates as needed.</p>
      `),
    });
  }

  return { statusCode: 200, body: JSON.stringify({ checked: (sources || []).length, changed: changed.length }) };
};

// Netlify scheduled function — weekly, Monday 14:00 UTC.
export const config = { schedule: '0 14 * * 1' };
