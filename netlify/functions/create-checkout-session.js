import Stripe from 'stripe';
import { asUser, json } from './_lib.js';
import { priceForDoc } from '../../src/lib/pricing.js';

// Creates a Stripe Checkout Session to unlock a single prepared document.
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.STRIPE_SECRET_KEY) return json(500, { error: 'Stripe not configured' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { documentId } = JSON.parse(event.body || '{}');
    if (!documentId) return json(400, { error: 'Missing documentId' });

    const token = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return json(401, { error: 'Not authenticated' });

    const supabase = asUser(token);
    const { data: userData, error: uErr } = await supabase.auth.getUser(token);
    if (uErr || !userData?.user) return json(401, { error: 'Invalid session' });
    const userId = userData.user.id;

    // Fetch the document and confirm ownership.
    const { data: doc, error: dErr } = await supabase
      .from('documents')
      .select('id, user_id, doc_type, title, paid')
      .eq('id', documentId)
      .single();
    if (dErr || !doc || doc.user_id !== userId) return json(404, { error: 'Document not found' });
    if (doc.paid) return json(200, { alreadyPaid: true });

    // Authoritative price: admin override in app_pricing, else code default.
    const { data: pr } = await supabase
      .from('app_pricing')
      .select('amount_cents')
      .eq('key', doc.doc_type)
      .maybeSingle();
    const amount = pr?.amount_cents ?? priceForDoc(doc.doc_type);
    const appUrl = process.env.APP_URL || 'http://localhost:8888';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `PlainRights Court — ${doc.title}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: { documentId, userId },
      success_url: `${appUrl}/document-paid?doc=${documentId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/document/${doc.doc_type}?canceled=1`,
    });

    await supabase.from('documents').update({ stripe_session_id: session.id }).eq('id', documentId);
    return json(200, { url: session.url });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
