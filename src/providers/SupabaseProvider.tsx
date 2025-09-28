import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

interface SupabaseContextValue {
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export const SupabaseProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: 'rutina://auth-callback'
        }
      });
      if (error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading,
      signInWithEmail,
      signOut
    }),
    [loading, session, signInWithEmail, signOut]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = () => {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error('useSupabase debe usarse dentro de SupabaseProvider');
  }
  return ctx;
};
