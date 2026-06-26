import Stripe from 'stripe';
import { asUser, json } from './_lib.js';

// Called by the success page with the Checkout session id. Confirms payment
// directly with Stripe and marks the document paid — so unlocking does not
// depend on webhook delivery/timing (and works in local dev without webhook
// forwarding). The webhook remains the authoritative backstop.
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { sessionId } = JSON.parse(event.body || '{}');
    if (!sessionId) return json(400, { error: 'Missing sessionId' });

    const token = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return json(401, { error: 'Not authenticated' });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    const documentId = session.metadata?.documentId;

    if (paid && documentId) {
      // Update under the user's own RLS context (they own the document).
      await asUser(token)
        .from('documents')
        .update({ paid: true, status: 'paid' })
        .eq('id', documentId);
    }
    return json(200, { paid, documentId });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
