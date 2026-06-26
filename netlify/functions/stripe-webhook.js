import Stripe from 'stripe';
import { admin, rawBody } from './_lib.js';

// Authoritative Stripe event handler. Verifies the signature, then:
//  - per-document payments  -> mark the document paid
//  - subscription lifecycle -> set the profile's subscription state
// Uses the service-role client (no user context). Requires
// SUPABASE_SERVICE_ROLE_KEY + STRIPE_WEBHOOK_SECRET in the environment.
export const handler = async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'];

  let evt;
  try {
    evt = stripe.webhooks.constructEvent(rawBody(event), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return { statusCode: 400, body: `Webhook Error: ${e.message}` };
  }

  const supabase = admin();

  try {
    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object;

      if (session.mode === 'payment' && session.metadata?.documentId && session.payment_status === 'paid') {
        await supabase
          .from('documents')
          .update({ paid: true, status: 'paid' })
          .eq('id', session.metadata.documentId);
      }

      if (session.mode === 'subscription') {
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const sub = session.subscription
          ? await stripe.subscriptions.retrieve(session.subscription)
          : null;
        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_plan: plan || null,
              subscription_status: sub?.status || 'active',
              subscription_period_end: sub?.current_period_end
                ? new Date(sub.current_period_end * 1000).toISOString()
                : null,
              stripe_customer_id: session.customer || null,
              stripe_subscription_id: session.subscription || null,
            })
            .eq('id', userId);
        }
      }
    }

    // Renewals, cancellations, payment failures.
    if (evt.type === 'customer.subscription.updated' || evt.type === 'customer.subscription.deleted') {
      const sub = evt.data.object;
      const canceled = evt.type === 'customer.subscription.deleted';
      await supabase
        .from('profiles')
        .update({
          subscription_status: canceled ? 'canceled' : sub.status,
          subscription_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          subscription_plan: canceled ? null : undefined,
        })
        .eq('stripe_subscription_id', sub.id);
    }
  } catch (e) {
    // Log-and-200 so Stripe doesn't hammer retries on a transient DB error.
    return { statusCode: 200, body: JSON.stringify({ received: true, warning: e.message }) };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
