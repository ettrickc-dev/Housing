// Single source of truth for per-document pricing, imported by BOTH the client
// (to show prices) and the Netlify Functions (to charge the correct amount).
// The operator can later override these from the admin panel.

// Value-based, segmented pricing. Landlord documents are priced against the
// $500+ attorney / up to $799 document-service alternative; tenant documents are
// kept affordable on purpose (tenants are often low-income — and a strong tenant
// funnel feeds word-of-mouth and subscriptions). Operator-adjustable.
export const DOC_PRICES_CENTS = {
  // Landlord — notices
  rent_demand_14day: 3900,
  notice_cure_10day: 3900,
  notice_termination: 3900,
  // Landlord — court petitions (highest value)
  nonpayment_petition: 7900,
  holdover_petition: 7900,
  // Landlord — service proof
  affidavit_of_service: 2900,
  // Tenant — kept affordable
  answer_nonpayment: 2500,
  answer_holdover: 2500,
  osc_vacate_default: 2500,
  osc_stay_warrant: 2500,
  jury_demand: 2500,
  fee_waiver: 2500,
  // Tenant — affirmative cases (more work, still fair)
  hp_action_repairs: 5500,
  illegal_lockout: 5500,
  // Landlord — in-case motions & settlement
  motion_default_judgment: 4900,
  stipulation_settlement: 3900,
  // Landlord — post-judgment
  marshal_requisition: 2900,
  satisfaction_judgment: 2900,
  // Landlord — rent-stabilized / DHCR
  renewal_lease_rs: 3900,
  notice_nonrenewal_rs: 3900,
  dhcr_registration: 3900,
};

export const DEFAULT_PRICE_CENTS = 3900;

// What the alternatives cost — used for price anchoring in the UI.
export const ANCHOR = {
  attorneyMin: 500,
  serviceMax: 799,
};

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

// How much the annual plan saves vs. paying monthly for a year.
export function annualSavingsCents() {
  return SUBSCRIPTION_PLANS.monthly.amountCents * 12 - SUBSCRIPTION_PLANS.annual.amountCents;
}

// True if the profile has a currently-active subscription.
export function hasActiveSubscription(profile) {
  if (!profile || profile.subscription_status !== 'active') return false;
  if (!profile.subscription_period_end) return true; // active, no end recorded yet
  return new Date(profile.subscription_period_end).getTime() > Date.now();
}
