'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fullName, setFullName] = useState('Priya Shah');
  const [email, setEmail] = useState('jay1@gmail.com');
  const [password, setPassword] = useState('*********');
  const [role, setRole] = useState('Fleet Manager');

  useEffect(() => {
    setMounted(false);
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark' ||
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  if (!mounted) return null;

  // Reusable toggle button so desktop + mobile stay in sync
  const ThemeToggleButton = () => (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300' 
          : 'bg-white border-slate-300 text-indigo-600 hover:text-indigo-800'
      }`}
      title="Toggle Theme Color"
      aria-label="Toggle Theme Color"
    >
      {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.197 5.197l1.591 1.591M17.213 17.213l1.591 1.591M3 12h2.25m13.5 0H21M5.197 19.803l1.591-1.591M17.213 6.787l1.591-1.591M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className={`min-h-screen w-screen grid grid-cols-1 lg:grid-cols-2 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#040712] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Left Column: Grid System & Config Labels with Toggle Button at Bottom */}
      <div className={`hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r ${
        isDarkMode ? 'border-slate-900 bg-[#040712]' : 'border-slate-200 bg-slate-100/50'
      }`}>
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none ${
          isDarkMode ? 'opacity-100' : 'opacity-40'
        }`} />
        
        <div className="flex items-center space-x-3 relative z-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="font-bold text-black text-lg tracking-tighter font-display">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight font-mono">
            Transit<span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>Ops</span>
          </span>
        </div>

        <div className="space-y-4 max-w-md relative z-10 my-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Identity & Access Gateway</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight">
            Configure Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">Operational Role</span>
          </h1>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Gain secure clearance to the unified command grid. Ensure rule validations and analytics engines sync to your specialized workflow profile.
          </p>
        </div>

        {/* Bottom Bar containing System Compliance and Theme Toggle Button */}
        <div className="flex items-center justify-between relative z-10 pt-4 border-t border-slate-300/40 dark:border-slate-800/80">
          <div className="flex font-mono text-[10px] text-slate-500">
            <div>SYSTEM COMPLIANCE: <span className="text-emerald-500 font-bold">REAL-TIME SECURE</span></div>
          </div>

          <ThemeToggleButton />
        </div>
      </div>

      {/* Right Column: Enrollment Fields */}
      <div className="flex flex-col items-center justify-center p-6 md:p-12 relative">

        {/* Mobile-only header with logo + toggle, since left column is hidden below lg */}
        <div className="flex lg:hidden items-center justify-between w-full max-w-md mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <span className="font-bold text-black text-base tracking-tighter font-display">T</span>
            </div>
            <span className="font-bold text-lg tracking-tight font-mono">
              Transit<span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>Ops</span>
            </span>
          </div>

          <ThemeToggleButton />
        </div>

        <div className={`w-full max-w-md border rounded-2xl p-8 shadow-xl transition-all ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800/80 shadow-cyan-950/10' : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="mb-6">
            <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-500 uppercase block">Security Enrollment</span>
            <h2 className="text-2xl font-bold tracking-tight mt-0.5">Create Access Credentials</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full text-xs font-mono px-4 py-3 rounded-xl border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                }`} 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">System Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full text-xs font-mono px-4 py-3 rounded-xl border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                }`} 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Console Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full text-xs font-mono px-4 py-3 rounded-xl border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                }`} 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Operational Profile (Role)</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className={`w-full text-xs font-mono px-4 py-3 rounded-xl border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500/50' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-600'
                }`}
              >
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>

            <button type="submit" className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-medium rounded-xl text-xs transition-all shadow-md active:scale-[0.99] font-mono uppercase tracking-wider">
              Establish Grid Credentials
            </button>
          </form>

          <div className="mt-6 border-t pt-4 text-center border-slate-200 dark:border-slate-800/60">
            <p className="text-xs text-slate-400">
              Already cleared for operations?{' '}
              <Link href="/login" className="text-cyan-500 font-bold hover:underline">
                Sign In to Console
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}