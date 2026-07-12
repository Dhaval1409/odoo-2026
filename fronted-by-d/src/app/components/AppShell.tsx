'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', code: '00' },
  { href: '/vehicles', label: 'Vehicles', code: '01' },
  { href: '/drivers', label: 'Drivers', code: '02' },
  { href: '/trips', label: 'Trips', code: '03' },
  { href: '/maintenance', label: 'Maintenance', code: '04' },
  { href: '/fuel-logs', label: 'Fuel Logs', code: '05' },
  { href: '/expenses', label: 'Expenses', code: '06' },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-asphalt-900">
        <p className="font-mono text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-asphalt-900">
      <aside className="flex w-60 flex-col border-r border-asphalt-700 bg-asphalt-950 px-4 py-6">
        <div className="mb-8 px-2">
          <p className="font-display text-lg font-bold tracking-tight text-white">TransitOps</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-signal-slate">Fleet Console</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? 'bg-signal-amber/10 text-signal-amber'
                    : 'text-slate-400 hover:bg-asphalt-800 hover:text-slate-100'
                }`}
              >
                <span className="font-mono text-[10px] text-signal-slate">{item.code}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-asphalt-700 pt-4">
          <p className="truncate px-3 text-sm text-slate-200">{user.name}</p>
          <p className="truncate px-3 font-mono text-[11px] text-signal-slate">{user.role.replace('_', ' ')}</p>
          <button onClick={logout} className="mt-3 w-full rounded-md px-3 py-2 text-left text-sm text-signal-red hover:bg-signal-red/10">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
