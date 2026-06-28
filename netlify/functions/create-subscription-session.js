import Stripe from 'stripe';
import { asUser, json } from './_lib.js';
import { planByKey } from '../../src/lib/pricing.js';

// Starts a Stripe Checkout Session in subscription mode for the monthly/annual plan.
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.STRIPE_SECRET_KEY) return json(500, { error: 'Stripe not configured' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { plan } = JSON.parse(event.body || '{}');
    const planDef = planByKey(plan);
    if (!planDef) return json(400, { error: 'Unknown plan' });

    const token = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return json(401, { error: 'Not authenticated' });

    const supabase = asUser(token);
    const { data: userData, error: uErr } = await supabase.auth.getUser(token);
    if (uErr || !userData?.user) return json(401, { error: 'Invalid session' });
    const user = userData.user;

    // Authoritative price: admin override in app_pricing, else code default.
    const { data: pr } = await supabase
      .from('app_pricing')
      .select('amount_cents')
      .eq('key', `sub_${planDef.key}`)
      .maybeSingle();
    const unitAmount = pr?.amount_cents ?? planDef.amountCents;

    const appUrl = process.env.APP_URL || 'http://localhost:8888';
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `PlainRights Court — ${planDef.label} (unlimited)` },
            unit_amount: unitAmount,
            recurring: { interval: planDef.interval },
          },
          quantity: 1,
        },
      ],
      metadata: { userId: user.id, plan: planDef.key },
      subscription_data: { metadata: { userId: user.id, plan: planDef.key } },
      success_url: `${appUrl}/account?sub=success`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
    });

    return json(200, { url: session.url });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
