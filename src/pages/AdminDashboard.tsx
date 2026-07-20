import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../components/AuthProvider';
import { Shield, Check, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple admin check based on email. You can expand this to use a 'roles' table.
  const adminEmails = ['phbhada@gmail.com', 'admin@example.com', 'master@example.com'];
  const isAdmin = session?.user?.email ? adminEmails.includes(session.user.email) : false;

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    
    if (isAdmin) {
      fetchSuppliers();
    } else {
      setLoading(false);
    }
  }, [session, isAdmin, navigate]);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error && error.code !== '42703') { // Ignore ordering error if created_at doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase.from('suppliers').select('*');
        if (fallbackError) throw fallbackError;
        setSuppliers(fallbackData || []);
      } else {
        setSuppliers(data || []);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({ is_approved: !currentStatus })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setSuppliers(suppliers.map(s => 
        s.user_id === userId ? { ...s, is_approved: !currentStatus } : s
      ));
    } catch (error) {
      console.error('Error toggling approval:', error);
      alert('Failed to update approval status.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white font-['Space_Grotesk']">
        <Shield className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6">You do not have administrator privileges to view this page.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-['Space_Grotesk'] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Shield className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Master Admin</h1>
              <p className="text-slate-400 mt-1">Manage shop approvals and supplier access</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 border border-white/10 hover:border-white/20 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-xl font-semibold text-white">Registered Suppliers</h2>
            <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-semibold">
              Total: {suppliers.length}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-black/20 text-slate-400 text-sm">
                <tr>
                  <th className="px-6 md:px-8 py-5 font-medium tracking-wide">User ID</th>
                  <th className="px-6 md:px-8 py-5 font-medium tracking-wide">Approval Status</th>
                  <th className="px-6 md:px-8 py-5 font-medium tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                      No suppliers found in the database.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.user_id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 md:px-8 py-6 font-mono text-sm text-slate-300">
                        {supplier.user_id}
                      </td>
                      <td className="px-6 md:px-8 py-6">
                        {supplier.is_approved ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 md:px-8 py-6 text-right">
                        <button
                          onClick={() => toggleApproval(supplier.user_id, supplier.is_approved)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm active:scale-95 ${
                            supplier.is_approved
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20 hover:border-rose-500/30'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/30'
                          }`}
                        >
                          {supplier.is_approved ? 'Revoke Access' : 'Approve Shop'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
