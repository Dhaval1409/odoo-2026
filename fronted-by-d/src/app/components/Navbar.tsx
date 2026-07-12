'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import { useTheme } from '@/app/lib/theme-context';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  if (!mounted) return null;

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all border ${
          active
            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 font-bold'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-transparent'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isDarkMode ? 'bg-[#040712]/80 border-slate-900' : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-12 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="font-bold text-black text-lg tracking-tighter font-display">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight font-mono text-slate-900 dark:text-white">
            Transit<span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>Ops</span>
          </span>
        </Link>

        {/* Nav Links + Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center space-x-2">
                {navLink('/dashboard', 'Dashboard')}
              </div>
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 leading-tight uppercase">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              {navLink('/login', 'Sign In')}
              {navLink('/register', 'Enroll')}
            </div>
          )}

          {/* Theme Toggle */}
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
      </div>
    </header>
  );
}