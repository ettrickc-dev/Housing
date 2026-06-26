import Stripe from 'stripe';
import { asUser, json } from './_lib.js';

// Opens the Stripe Billing Portal so a subscriber can update or cancel.
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!process.env.STRIPE_SECRET_KEY) return json(500, { error: 'Stripe not configured' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const token = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return json(401, { error: 'Not authenticated' });

    const supabase = asUser(token);
    const { data: userData, error: uErr } = await supabase.auth.getUser(token);
    if (uErr || !userData?.user) return json(401, { error: 'Invalid session' });

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userData.user.id)
      .single();
    if (!profile?.stripe_customer_id) return json(400, { error: 'No subscription to manage' });

    const appUrl = process.env.APP_URL || 'http://localhost:8888';
    const portal = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/account`,
    });
    return json(200, { url: portal.url });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
