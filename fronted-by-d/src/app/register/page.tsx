'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, errorMessage } from '@/app/lib/auth-context';

const ROLES = [
  { value: 'FLEET_MANAGER', label: 'Fleet Manager' },
  { value: 'DISPATCHER', label: 'Dispatcher' },
  { value: 'SAFETY_OFFICER', label: 'Safety Officer' },
  { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES[0].value);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen grid grid-cols-1 lg:grid-cols-12 bg-[#060913] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Left Pane: Decorative Hackathon Context / Visuals */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-gradient-to-br from-[#090f1d] via-[#060913] to-[#03050a] border-r border-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

        {/* Brand Header */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <span className="font-bold text-black text-sm tracking-tighter">T</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white font-mono">Transit<span className="text-cyan-400">Ops</span></span>
        </div>

        {/* Platform Info Context */}
        <div className="space-y-4 relative z-10 my-auto">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 font-mono text-[10px] uppercase tracking-wider">
            Identity & Access Gateway
          </div>
          <h2 className="text-3xl font-black font-display text-white tracking-tight leading-snug">
            Configure Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">Operational Role</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Gain secure clearance to the unified command grid. Ensure rule validations and analytics engines sync to your specialized workflow profile.
          </p>
        </div>

        {/* Footer Meta */}
        <div className="text-[11px] font-mono text-slate-600 relative z-10">
          SYSTEM COMPLIANCE: RBAC SECURE
        </div>
      </div>

      {/* Right Pane: Interactive Registration Form */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12 relative bg-[#040712]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a40_1px,transparent_1px),linear-gradient(to_bottom,#0f172a40_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Form Header */}
          <div className="text-center lg:text-left">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">Security Enrollment</p>
            <h1 className="text-2xl font-bold font-display text-white mt-1">Create Access Credentials</h1>
          </div>

          {/* Registration Input Form */}
          <form onSubmit={onSubmit} className="glass-card space-y-4 shadow-2xl bg-slate-900/20">
            <div>
              <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-slate-400">Full Name</label>
              <input 
                className="glass-input" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Priya Shah" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-slate-400">System Email Address</label>
              <input
                className="glass-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fleet.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-slate-400">Console Password</label>
              <input
                className="glass-input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-slate-400">Operational Profile (Role)</label>
              <div className="relative">
                <select 
                  className="glass-input appearance-none cursor-pointer pr-10 text-slate-200"
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value} className="bg-[#0b1329] text-white">
                      {r.label}
                    </option>
                  ))}
                </select>
                {/* Custom Chevron Indicator */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gradient w-full mt-2">
              {loading ? 'Generating Security Token…' : 'Initialize Account Access'}
            </button>
          </form>

          {/* Form Redirect Link */}
          <p className="text-center text-sm text-slate-500">
            Already cleared for operations?{' '}
            <Link href="/login" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline transition-colors ml-1">
              Sign In to Console
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}