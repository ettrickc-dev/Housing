import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';

// Auth state for the whole app: current Supabase session/user, plus helpers.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track which user the admin flag was computed for, so a stale value from a
  // previous user can't leak through during the brief lookup window.
  const [adminInfo, setAdminInfo] = useState({ uid: null, val: false });

  useEffect(() => {
    // Initial session (e.g. on refresh) ...
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });
    // ... then keep it in sync.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Look up the admin flag whenever the signed-in user changes.
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setAdminInfo({ uid: null, val: false });
      return;
    }
    let alive = true;
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setAdminInfo({ uid: userId, val: !!data?.is_admin });
      });
    return () => { alive = false; };
  }, [userId]);

  // false when signed out; null while determining for the current user; bool once known.
  const isAdmin = !userId ? false : adminInfo.uid === userId ? adminInfo.val : null;

  const value = {
    session,
    user: session?.user ?? null,
    isAdmin,
    loading,
    async signUp({ email, password, fullName }) {
      return supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName || '' } },
      });
    },
    async signIn({ email, password }) {
      return supabase.auth.signInWithPassword({ email, password });
    },
    async signOut() {
      return supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
