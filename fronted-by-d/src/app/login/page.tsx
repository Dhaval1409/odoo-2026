'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Fleet Manager');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate beautiful auth delay for presentation feel
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen w-screen grid grid-cols-1 lg:grid-cols-12 premium-bg selection:bg-cyan-500/30">
      
      {/* Left Column: Visual Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 border-r border-slate-900 bg-gradient-to-br from-[#090f1d] to-transparent">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="font-bold text-black text-lg tracking-tighter">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white font-mono">Transit<span className="text-cyan-400">Ops</span></span>
        </div>

        <div className="max-w-md space-y-4">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Next-Gen Fleet Command
          </span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
            Real-time control over your global transit grid.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Digitize vehicles, manage live dispatches, track predictive driver safety scores, and audit logistics margins within an uncompromised interface.
          </p>
        </div>

        <div className="flex items-center space-x-6 text-slate-500 font-mono text-xs">
          <div>SYSTEM: <span className="text-emerald-400 font-bold">ONLINE</span></div>
          <div>PING: <span className="text-slate-300">14MS</span></div>
          <div>SECURE INTERFACE v2.4</div>
        </div>
      </div>

      {/* Right Column: Interactive Login Container */}
      <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md glass-card space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Access Control</h2>
            <p className="text-slate-400 text-xs mt-1">Provide credentials to initialize session tokens.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Identity Role</label>
              <div className="grid grid-cols-2 gap-2">
                {['Fleet Manager', 'Safety Officer'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                      role === r 
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                        : 'border-slate-800 bg-[#090f1d]/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="operator@transitops.io" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Passphrase</label>
                <a href="#" className="text-xs text-cyan-500 hover:underline">Forgot?</a>
              </div>
              <input 
                type="password" 
                required 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gradient pt-1">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authorizing Identity...</span>
                </div>
              ) : (
                <span>Establish Connection</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}