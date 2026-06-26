import { createClient } from '@supabase/supabase-js';

// Browser Supabase client (anon key only — RLS enforces per-user access).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When env is missing (e.g. local preview before .env is filled in), fall back
// to well-formed placeholders so createClient() doesn't throw and white-screen
// the whole app. Auth/data calls will fail gracefully until real values exist.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  // Surfaced loudly in dev so a missing .env is obvious, not a silent 401.
  // eslint-disable-next-line no-console
  console.warn(
    '[PlainRights Court] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env and fill in your Supabase project values. ' +
      'Running with placeholder credentials — auth and data will not work until configured.'
  );
}

const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'public-anon-key-placeholder';

export const supabase = createClient(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || FALLBACK_KEY,
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
