import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabaseClient';
import PendingApproval from '../pages/PendingApproval';

export default function ApprovalGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/login');
      return;
    }

    if (!session?.user) {
      setIsChecking(false);
      return;
    }

    const checkApproval = async () => {
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('is_approved')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching approval status:', error);
          // If the row doesn't exist yet or errors, assume not approved.
          setIsApproved(false);
        } else {
          setIsApproved(!!data?.is_approved);
        }
      } catch (err) {
        console.error('Check approval error:', err);
        setIsApproved(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkApproval();
  }, [session]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) {
    // AuthProvider will likely redirect to /, but we return null here to prevent rendering dashboard
    return null; 
  }

  if (isApproved === false) {
    return <PendingApproval />;
  }

  return <>{children}</>;
}
