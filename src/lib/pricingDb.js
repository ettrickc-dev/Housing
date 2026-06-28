import { supabase } from './supabaseClient.js';
import { DOC_PRICES_CENTS, DEFAULT_PRICE_CENTS, SUBSCRIPTION_PLANS } from './pricing.js';

// Operator price overrides live in the app_pricing table (publicly readable).
// These helpers merge DB overrides over the code defaults.

export async function fetchPricing() {
  const { data, error } = await supabase.from('app_pricing').select('key, amount_cents');
  if (error) return {};
  const map = {};
  for (const r of data || []) map[r.key] = r.amount_cents;
  return map;
}

export async function setPriceCents(key, cents) {
  const { error } = await supabase
    .from('app_pricing')
    .upsert({ key, amount_cents: cents, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// Resolve a per-document price: DB override first, then code default.
export function resolveDocPrice(overrides, docType) {
  if (overrides && overrides[docType] != null) return overrides[docType];
  return DOC_PRICES_CENTS[docType] ?? DEFAULT_PRICE_CENTS;
}

export function resolveSubPrice(overrides, planKey) {
  const k = `sub_${planKey}`;
  if (overrides && overrides[k] != null) return overrides[k];
  return SUBSCRIPTION_PLANS[planKey]?.amountCents ?? 0;
}
