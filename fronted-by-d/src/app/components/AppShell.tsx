'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', code: '00' },
  { href: '/vehicles', label: 'Vehicles', code: '01' },
  { href: '/drivers', label: 'Drivers', code: '02' },
  { href: '/trips', label: 'Trips', code: '03' },
  { href: '/maintenance', label: 'Maintenance', code: '04' },
  { href: '/fuel-logs', label: 'Fuel Logs', code: '05' },
  { href: '/expenses', label: 'Expenses', code: '06' },
];

function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200 flex items-center justify-center shrink-0 shadow-sm dark:shadow-none"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.25 5.25l1.591 1.591M17.159 17.159l1.591 1.591M3 12h2.25m13.5 0H21M5.25 17.159l1.591-1.591M17.159 5.25l1.591 1.591M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )}
    </button>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#050b14]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-6 h-6 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">Initializing Mainframe...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#050b14] text-slate-800 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-200">
      {/* Structural Telemetry Navigation Sidebar */}
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-slate-200 dark:border-slate-900 bg-white/90 dark:bg-[#070d19]/80 backdrop-blur-xl px-4 py-6 z-30">
        
        {/* Brand System Header */}
        <div className="mb-8 px-3 relative group">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-600 dark:bg-cyan-500 rounded-r-md opacity-80 group-hover:h-10 transition-all duration-300" />
          <p className="font-display text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            TransitOps
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
            Fleet Control Matrix
          </p>
        </div>

        {/* Dynamic Navigation Options Stack */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-mono uppercase tracking-wider transition-all duration-200 relative group ${
                  active
                    ? 'bg-cyan-50 dark:bg-gradient-to-r dark:from-cyan-500/10 dark:to-blue-500/5 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'
                }`}
              >
                <span className={`text-[10px] transition-colors ${active ? 'text-cyan-600 dark:text-cyan-400 font-black' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400'}`}>
                  {item.code}
                </span>
                <span className="font-sans font-medium capitalize text-sm tracking-normal">{item.label}</span>
                
                {active && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Authenticated Operator Registry Area with Theme Integration */}
        <div className="border-t border-slate-200 dark:border-slate-900/80 pt-4 mt-auto space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900/60 p-3 rounded-xl flex-1 min-w-0 shadow-inner dark:shadow-none">
              <p className="truncate font-sans font-semibold text-sm text-slate-900 dark:text-white">{user.name}</p>
              <p className="truncate font-mono text-[9px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
                // {user.role.replace('_', ' ')}
              </p>
            </div>
            
            <ThemeToggle />
          </div>
          
          <button 
            onClick={logout} 
            className="w-full font-mono text-xs uppercase tracking-wider text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/10 hover:border-red-300 dark:hover:border-red-500/20 px-3 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center space-x-2 font-semibold dark:font-normal"
          >
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Grid Viewport Content Frame */}
      <main className="flex-1 min-h-screen pl-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8 animate-[fadeIn_0.3s_ease-out]">
          {children}
        </div>
      </main>
    </div>
  );
}