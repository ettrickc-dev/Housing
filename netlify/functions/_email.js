import { LEGAL_DISCLAIMER, APP_NAME } from '../../src/lib/constants.js';

// Minimal Resend client (no SDK needed — just their REST API).
const RESEND_URL = 'https://api.resend.com/emails';

export async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');
  // onboarding@resend.dev works before you verify a domain (sends to your own
  // Resend account email only). Swap to your verified domain for production.
  const from = process.env.RESEND_FROM_EMAIL || `${APP_NAME} <onboarding@resend.dev>`;

  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Resend error ${res.status}`);
  return data;
}

// Wraps body HTML in a branded shell with the mandated disclaimer on EVERY email.
export function wrapEmail(bodyHtml) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#1a2b4a;max-width:560px;margin:auto">
    <h2 style="color:#1a2b4a;margin:0 0 16px">${APP_NAME}</h2>
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
    <p style="font-size:11px;line-height:1.5;color:#6b7280">${LEGAL_DISCLAIMER}</p>
  </div>`;
}
