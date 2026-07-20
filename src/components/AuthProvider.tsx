import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Ensure your supabase client is here
import type { Session, SupabaseClient } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  supabase: SupabaseClient | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  supabase: null,
  isLoading: true,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // 1. Check if a session already exists on load
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setSession(session);
        setIsLoading(false);
      }
    };
    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setIsLoading(false);
      }

      if (event === 'SIGNED_IN') {
        navigate('/dashboard'); 
      }
      
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    // Cleanup listener on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, supabase, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so you can grab the user data anywhere in your app
export const useAuth = () => useContext(AuthContext);