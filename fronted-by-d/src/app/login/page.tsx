'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, errorMessage } from '@/app/lib/auth-context';

const ROLES = [
  { value: 'FLEET_MANAGER', label: 'Fleet Manager' },
  { value: 'DISPATCHER', label: 'Dispatcher' },
  { value: 'SAFETY_OFFICER', label: 'Safety Officer' },
  { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES[0].value);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Theme state (same pattern as landing page)
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setMounted(true);

    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, role);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-screen grid grid-cols-1 lg:grid-cols-12 premium-bg selection:bg-cyan-500/30">

      {/* Left Column: Visual Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 border-r border-slate-200 dark:border-slate-900 bg-gradient-to-br from-slate-50 to-transparent dark:from-[#090f1d] dark:to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <span className="font-bold text-black text-lg tracking-tighter">T</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white font-mono">Transit<span className="text-cyan-600 dark:text-cyan-400">Ops</span></span>
          </div>

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300'
                : 'bg-white border-slate-300 text-indigo-600 hover:text-indigo-800'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
        </div>

        <div className="max-w-md space-y-4">
          <span className="text-xs font-mono tracking-widest text-cyan-600 dark:text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Next-Gen Fleet Command
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
            Real-time control over your global transit grid.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Digitize vehicles, manage live dispatches, track predictive driver safety scores, and audit logistics margins within an uncompromised interface.
          </p>
        </div>

        <div className="flex items-center space-x-6 text-slate-400 dark:text-slate-500 font-mono text-xs">
          <div>SYSTEM: <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span></div>
          <div>PING: <span className="text-slate-600 dark:text-slate-300">14MS</span></div>
          <div>SECURE INTERFACE v2.4</div>
        </div>
      </div>

      {/* Right Column: Interactive Login Container */}
      <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-[#040712]">
        <div className="w-full max-w-md space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

          {/* Mobile-only header with toggle, since left column is hidden below lg */}
          <div className="flex lg:hidden items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <span className="font-bold text-black text-base tracking-tighter">T</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white font-mono">Transit<span className="text-cyan-600 dark:text-cyan-400">Ops</span></span>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300'
                  : 'bg-white border-slate-300 text-indigo-600 hover:text-indigo-800'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Access Control</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Provide credentials to initialize session tokens.</p>
          </div>

          <form onSubmit={handleLogin} className="glass-card shadow-2xl bg-white dark:bg-slate-900/20 space-y-5 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl">
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Identity Role</label>
              <div className="relative">
                <select
                  className="glass-input appearance-none cursor-pointer pr-10 text-slate-800 dark:text-slate-200 w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value} className="bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white">
                      {r.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
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
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passphrase</label>
                <a href="#" className="text-xs text-cyan-600 dark:text-cyan-500 hover:underline">Forgot?</a>
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

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`btn-gradient w-full py-3 rounded-xl font-medium transition-all ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className={`w-4 h-4 border-2 rounded-full animate-spin ${
                      isDarkMode ? 'border-white/30 border-t-white' : 'border-slate-900/30 border-t-slate-900'
                    }`}
                  />
                  <span>Authorizing Identity...</span>
                </div>
              ) : (
                <span>Establish Connection</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Need system registration clearance?{' '}
            <Link href="/register" className="text-cyan-600 dark:text-cyan-400 font-medium hover:text-cyan-500 dark:hover:text-cyan-300 hover:underline transition-colors ml-1">
              Enroll Account Here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}