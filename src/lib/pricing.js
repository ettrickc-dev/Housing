// Single source of truth for per-document pricing, imported by BOTH the client
// (to show prices) and the Netlify Functions (to charge the correct amount).
// The operator can later override these from the admin panel.

export const DOC_PRICES_CENTS = {
  rent_demand_14day: 1999,
  nonpayment_petition: 2499,
  affidavit_of_service: 999,
  answer_nonpayment: 1999,
  osc_vacate_default: 2499,
};

export const DEFAULT_PRICE_CENTS = 1999;

export function priceForDoc(docType) {
  return DOC_PRICES_CENTS[docType] ?? DEFAULT_PRICE_CENTS;
}

export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2);
}

// Subscription tiers (unlimited documents). Operator-adjustable.
export const SUBSCRIPTION_PLANS = {
  monthly: {
    key: 'monthly',
    label: 'Monthly',
    amountCents: 3999,
    interval: 'month',
    blurb: 'Unlimited documents, billed monthly.',
  },
  annual: {
    key: 'annual',
    label: 'Annual',
    amountCents: 29900,
    interval: 'year',
    blurb: 'Unlimited documents + priority law-update alerts. Best value.',
  },
};

export function planByKey(key) {
  return SUBSCRIPTION_PLANS[key] || null;
}

// True if the profile has a currently-active subscription.
export function hasActiveSubscription(profile) {
  if (!profile || profile.subscription_status !== 'active') return false;
  if (!profile.subscription_period_end) return true; // active, no end recorded yet
  return new Date(profile.subscription_period_end).getTime() > Date.now();
}
