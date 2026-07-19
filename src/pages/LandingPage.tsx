import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, Users, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Mail, Crown } from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface LandingPageProps {
  supabaseClient?: SupabaseClient | null;
  onAuthSuccess?: (user: any) => void;
  onOnboardingComplete?: (shopData: any) => void;
  onDemoLogin?: (role: 'master' | 'shop' | 'employee') => void;
}

export default function LandingPage({ 
  supabaseClient = supabase, 
  onAuthSuccess, 
  onOnboardingComplete, 
  onDemoLogin 
}: LandingPageProps = {}) {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'AUTH' | 'ONBOARDING'>('AUTH');
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    if (supabaseClient) {
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
           setAuthUser(session.user);
           setAuthStep('ONBOARDING');
           onAuthSuccess?.(session.user);
           if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
        }
      });
      return () => {
        subscription.unsubscribe();
      }
    }
  }, [supabaseClient]);

  // Onboarding state
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [upi, setUpi] = useState('');

  const handleGoogleAuth = async () => {
    if (!supabaseClient) return alert('Supabase client is not configured.');
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    setLoading(false);
    if (error) alert(error.message);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient) return alert('Supabase client is not configured.');
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the magic link to sign in!');
    }
  };

  const handleDemoShopLogin = async () => {
    setLoading(true);
    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: 'demo_shop@vidyaretail.com',
                password: 'demo_password_123'
            });
            if (error) {
                console.warn('Real Supabase demo login failed, using local fallback:', error.message);
                // Fallback for demo environment if credentials don't exist
                onDemoLogin?.('shop');
                // removed pushState to avoid 404 on GH pages
            } else if (data.user) {
                // removed pushState to avoid 404 on GH pages
                onAuthSuccess?.(data.user);
            }
        } else {
            // Local fallback
            onDemoLogin?.('shop');
            // removed pushState to avoid 404 on GH pages
        }
    } catch (err) {
        console.error(err);
        onDemoLogin?.('shop');
        // removed pushState to avoid 404 on GH pages
    } finally {
        setLoading(false);
    }
  };

  const submitOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !address || !whatsApp || !upi) return alert('Please fill in all details');
    onOnboardingComplete?.({ name: shopName, address, whatsNo: whatsApp, upiId: upi, email: authUser?.email || email });
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      
      {/* Background Gradients & Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#020617]/50 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20">
                V
              </div>
              <span className="font-bold text-xl tracking-tight text-white">VidyaRetail<span className="text-indigo-400">.</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => window.scrollTo(0, 0)} className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
                Sign In
              </button>
              <button onClick={() => window.scrollTo(0, 0)} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm backdrop-blur-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              V 2.0 Now Available
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Modern Retail.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Supercharge your multi-tenant textile business with real-time inventory tracking, WhatsApp invoice automation, and enterprise-grade security. Built for scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                Setup in 2 minutes
              </div>
            </div>
          </div>

          {/* Auth Card (Glassmorphism) */}
          <div className="relative">
            {/* Soft backdrop glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] blur-2xl opacity-20 transform rotate-2"></div>
            
            <div className="relative bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/10">
              {authStep === 'AUTH' ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {authMode === 'LOGIN' ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {authMode === 'LOGIN' ? 'Enter your details to access your dashboard' : 'Join thousands of retailers growing with us'}
                    </p>
                  </div>

                  <button 
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-wider">OR</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Email address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white bg-black/20 outline-none transition-all placeholder-slate-500"
                          placeholder="you@company.com"
                          required
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    >
                      {loading ? 'Sending link...' : 'Continue with Email'}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>

                  <div className="text-center text-sm text-slate-400 pt-2">
                    {authMode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')} className="font-semibold text-indigo-400 hover:text-indigo-300">
                      {authMode === 'LOGIN' ? 'Sign up' : 'Log in'}
                    </button>
                  </div>
                  
                  {/* Demo Logins */}
                  <div className="pt-6 border-t border-white/10 mt-6">
                     <p className="text-[10px] text-center font-bold text-slate-500 mb-3 uppercase tracking-widest">Demo Environment Access</p>
                     <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => onDemoLogin?.('master')} className="flex items-center justify-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 text-slate-300 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
                         <Crown className="w-3.5 h-3.5 text-amber-400" /> Master
                       </button>
                       <button onClick={handleDemoShopLogin} className="flex items-center justify-center gap-1.5 text-xs font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 py-2.5 rounded-xl hover:bg-indigo-500/20 transition-colors">
                         <Store className="w-3.5 h-3.5" /> Shop Admin
                       </button>
                     </div>
                  </div>

                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                      <Store className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Setup Your Boutique</h2>
                    <p className="text-sm text-slate-400">Let's configure your retail instance.</p>
                  </div>
                  <form onSubmit={submitOnboarding} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Boutique Name</label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={e => setShopName(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-black/20 text-white outline-none placeholder-slate-500"
                        placeholder="e.g. Acme Threads"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">Business Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-black/20 text-white outline-none placeholder-slate-500"
                        placeholder="City, Region"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">WhatsApp Contact</label>
                      <input
                        type="text"
                        value={whatsApp}
                        onChange={e => setWhatsApp(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-black/20 text-white outline-none placeholder-slate-500"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-300">UPI Address</label>
                      <input
                        type="text"
                        value={upi}
                        onChange={e => setUpi(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-black/20 text-white outline-none placeholder-slate-500"
                        placeholder="business@upi"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all mt-6 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    >
                      Launch Workspace
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-white">Enterprise Tools, Startup Agility</h2>
            <p className="text-slate-400">Comprehensive features designed specifically for scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/5 space-y-4 hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Real-time Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track sales, margins, and inventory turn-over in real-time across all your locations.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/5 space-y-4 hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">WhatsApp Invoicing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automatically dispatch PDF receipts and payment links directly to customers via WhatsApp.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/5 space-y-4 hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Tenant Auth</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Secure Row-Level Security (RLS) ensures absolute data isolation between different shop instances.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 relative z-10">
        <p className="text-sm">© {new Date().getFullYear()} VidyaRetail OS. All rights reserved.</p>
      </footer>
    </div>
  );
}
