import { createClient } from '@supabase/supabase-js';

const URL = () => process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

// Service-role client for server-to-server writes with no user context
// (the Stripe webhook). Requires SUPABASE_SERVICE_ROLE_KEY (set in Netlify env).
// Files prefixed with "_" are NOT exposed as HTTP endpoints by Netlify.
export function admin() {
  return createClient(URL(), process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Acts AS the signed-in user (anon key + their JWT), so RLS applies. Used by
// endpoints the user calls directly — no service-role key needed.
export function asUser(token) {
  return createClient(URL(), process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

// Stripe webhook signature verification needs the EXACT raw body.
export function rawBody(event) {
  return event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
}
