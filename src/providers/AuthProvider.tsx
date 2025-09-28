import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Role, User } from '@/types/database';
import Toast from 'react-native-toast-message';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) {
    console.error('Error fetching profile', error);
    Toast.show({ type: 'error', text1: 'Error cargando perfil', text2: error.message });
    return null;
  }
  return data as User;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user?.id) {
        const profile = await fetchProfile(currentSession.user.id);
        setUser(profile);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        const profile = await fetchProfile(newSession.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        setUser(null);
      },
      refreshProfile: async () => {
        if (!session?.user?.id) return;
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      }
    }),
    [session, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export function useRole(): Role | null {
  const { user } = useAuthContext();
  return user?.role ?? null;
}
