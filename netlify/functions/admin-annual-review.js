import { sendEmail, wrapEmail } from './_email.js';
import { APP_NAME } from '../../src/lib/constants.js';

// Scheduled Jan 1: remind the administrator to review every cited statute for
// the year. NY landlord-tenant law changes often; this is the annual prompt.
export const handler = async () => {
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) return { statusCode: 500, body: 'ADMIN_EMAIL not configured' };

  await sendEmail({
    to: admin,
    subject: `Annual statutory review due — ${APP_NAME}`,
    html: wrapEmail(`
      <p>It's the start of a new year — time for the annual New York landlord-tenant
      law review.</p>
      <p>Open the Admin Law Review Dashboard and, for each statute and rule:</p>
      <ul>
        <li>Confirm the citation and section are still current.</li>
        <li>Update the <strong>last verified date</strong> (this drives the date shown in document footers).</li>
        <li>Flag anything that has changed so affected document templates show a banner.</li>
      </ul>
      <p>Pay special attention to areas that change frequently: notice periods (HSTPA),
      the Good Cause Eviction Law and local opt-outs, and any new emergency rental
      assistance programs.</p>
    `),
  });

  return { statusCode: 200, body: JSON.stringify({ sent: true }) };
};

// Netlify scheduled function — January 1 at 13:00 UTC.
export const config = { schedule: '0 13 1 1 *' };
