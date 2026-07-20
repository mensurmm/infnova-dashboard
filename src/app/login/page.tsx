// src/app/login/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, AlertTriangle, X, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Catch the session expiration parameter cleanly from the URL
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('expired=true')) {
      setSessionExpired(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSessionExpired(false);
    setSubmitting(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="w-full max-w-6xl bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 flex overflow-hidden">
        
        {/* ======================================================== */}
        {/* 1. BRANDING PANEL - Showcase the Beautiful Logo        */}
        {/* ======================================================== */}
        <div className="hidden lg:flex w-1/2 bg-[#0B132B] p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle geometric background pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'0 0 20 20\'%3%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.4\'%3%3Cpath d=\'M0 0h20v20H0V0zm10 10l10 10V0L10 10zM0 20l10-10L0 0v20z\'/%3%3C/g%3%3%3C/svg%3%3E")' }} />
          
          <div className="relative z-10">
            {/* The primary, full-size readable logo */}
            <img 
              src="/logo.svg" 
              alt="Infnova Technologies" 
              className="h-16 w-auto object-contain mb-10" 
            />
            
            <h1 className="text-5xl font-black text-white tracking-tighter leading-tight max-w-sm mb-4">
              Your Gateway <br /> to <span className="text-orange-500">Innovation.</span>
            </h1>
            <p className="text-base text-slate-400 font-medium leading-relaxed max-w-sm">
              Log in to the Infnova admin portal to seamlessly filter internship applicants, review detailed candidate profiles, and manage your complete hiring workflow.
            </p>
          </div>

          <div className="relative z-10 mt-16 text-slate-500 text-xs font-mono">
            © {new Date().getFullYear()} Infnova Technologies Inc. All rights reserved.
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. FORM PANEL - Clean and Focused Login Form           */}
        {/* ======================================================== */}
        <div className="w-full lg:w-1/2 p-10 sm:p-12 md:p-16 flex flex-col justify-center">
          
          {/* Mobile-only header (appears when screen < lg) */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center bg-[#0B132B] px-6 py-3 rounded-xl shadow-lg border border-slate-800 mb-5">
              <img 
                src="/logo.svg" 
                alt="Infnova Technologies" 
                className="h-10 w-auto object-contain" 
              />
            </div>
            <p className="text-sm text-slate-500 mt-1 font-medium">Internal Applicant Portal</p>
          </div>

          {/* Desktop-only header section */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Admin Access</h2>
            <p className="text-base text-slate-500 mt-2 font-medium">Log in to your secure account below.</p>
          </div>

          {/* 3. CREDENTIAL FORMS with icons */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., administrator@infnova.tech"
                  className="w-full border border-slate-200 bg-white rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-800 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-slate-200 bg-white rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-800 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 text-white rounded-xl py-4 font-bold text-sm transition-all shadow-lg shadow-orange-500/20 mt-4 flex items-center justify-center gap-2"
            >
              {submitting ? 'Authenticating...' : 'Secure Sign In'}
            </button>
          </form>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ALERT / FEEDBACK CORNER (Floating Notifications)     */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 space-y-3 z-[100] max-w-sm w-full p-4 pointer-events-none">
        
        {sessionExpired && (
          <div className="pointer-events-auto w-full bg-amber-50 border-2 border-amber-200 text-amber-800 p-4 rounded-2xl shadow-xl flex items-start gap-3.5 animate-in slide-in-from-bottom duration-300">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Session Expired</p>
              <p className="text-xs mt-0.5 leading-relaxed">For your security, your session has timed out. Please sign in again to continue.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="pointer-events-auto w-full bg-rose-50 border-2 border-rose-200 text-rose-800 p-4 rounded-2xl shadow-xl flex items-start gap-3.5 animate-in slide-in-from-bottom duration-300">
            <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Sign-In Failed</p>
              <p className="text-xs mt-0.5 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600 transition-colors ml-auto -mt-1 p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}