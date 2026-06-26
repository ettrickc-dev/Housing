import { supabase } from './supabaseClient.js';

// POST to a Netlify Function (served at /api/* via netlify.toml redirect),
// attaching the user's Supabase access token for server-side auth.
async function authedPost(path, body) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  const res = await fetch(`/api/${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body || {}),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.error || `Request failed (${res.status})`);
  return out;
}

export const createCheckoutSession = (documentId) =>
  authedPost('create-checkout-session', { documentId });

export const verifyCheckoutSession = (sessionId) =>
  authedPost('verify-checkout-session', { sessionId });

export const createSubscriptionSession = (plan) =>
  authedPost('create-subscription-session', { plan });

export const createPortalSession = () => authedPost('create-portal-session', {});
