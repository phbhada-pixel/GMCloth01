import React from 'react';
import { motion } from 'framer-motion';
import { Clock, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500/30 font-['Space_Grotesk']">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg bg-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
        >
          <Clock className="w-10 h-10 text-indigo-400" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Pending Approval</h1>
        <p className="text-slate-400 mb-8 text-lg leading-relaxed">
          Your account has been created successfully. However, our master administrator needs to approve your shop before you can access the dashboard. We will notify you once you're verified.
        </p>

        <button 
          onClick={handleLogout}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 mx-auto border border-white/10 hover:border-white/20"
        >
          <LogOut className="w-4 h-4" />
          Sign Out for Now
        </button>
      </motion.div>
    </div>
  );
}
