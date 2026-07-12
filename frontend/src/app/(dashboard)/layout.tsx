'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  roles: string[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Real-time local state to test role switches before Express integration
  const [activeRole, setActiveRole] = useState<'Manager' | 'Driver' | 'Safety' | 'Analyst'>('Manager');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: SidebarItem[] = [
    { name: 'Control Center', href: '/', icon: '📊', roles: ['Manager', 'Driver', 'Safety', 'Analyst'] },
    { name: 'Vehicle Registry', href: '/vehicles', icon: '🚚', roles: ['Manager', 'Safety'] },
    { name: 'Driver Management', href: '/drivers', icon: '🪪', roles: ['Manager', 'Safety'] },
    { name: 'Dispatch Logs', href: '/trips', icon: '🗺️', roles: ['Manager', 'Driver'] },
    { name: 'Maintenance Hub', href: '/maintenance', icon: '🔧', roles: ['Manager'] },
    { name: 'Financial Insights', href: '/analytics', icon: '📈', roles: ['Manager', 'Analyst'] },
  ];

  return (
    <div className="flex h-screen bg-[#030712] text-slate-100 overflow-hidden font-sans antialiased">
      
      {/* Sidebar - Desktop Layout */}
      <aside className="hidden lg:flex w-64 border-r border-slate-900 bg-[#090d16]/60 backdrop-blur-xl flex-col justify-between transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="font-black text-white text-md">T</span>
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-slate-200 text-sm">TransitOps</h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Core Terminal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigationItems
              .filter(item => item.roles.includes(activeRole))
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-xs font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 border border-indigo-500/20 text-indigo-400 font-semibold shadow-inner shadow-indigo-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Identity Matrix Footer */}
        <div className="p-4 border-t border-slate-900 bg-[#060a12]/40 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
              {activeRole.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Dhaval Bodar</p>
              <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-400">System Online</span>
            </div>
          </div>
          
          {/* Quick Mock Role Switcher (Essential for testing user-specific dashboard elements) */}
          <div className="grid grid-cols-2 gap-1 text-[9px] bg-slate-950 p-1 rounded-lg border border-slate-900">
            {(['Manager', 'Driver', 'Safety', 'Analyst'] as const).map(role => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`py-1 rounded font-medium transition-all ${
                  activeRole === role ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Framework Layout Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Transparent Global Navigation Header */}
        <header className="h-16 border-b border-slate-900/60 bg-[#030712]/70 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg"
            >
              ☰
            </button>
            <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Node State: <span className="text-slate-200 font-semibold uppercase font-mono tracking-wider">Active Operations</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-slate-500 font-mono tracking-tight">Active Context Layer</span>
              <span className="text-xs font-semibold text-indigo-400 font-mono">RBAC: {activeRole}</span>
            </div>
            <div className="h-px w-4 bg-slate-800 hidden sm:block" />
            <span className="text-xs text-slate-400 font-mono bg-slate-900/40 border border-slate-900 px-3 py-1 rounded-lg">
              12 Jul 2026
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden">
            <div className="w-64 h-full bg-[#090d16] p-6 border-r border-slate-900 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-white">TransitOps</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 text-sm">✕</button>
                </div>
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-xs text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl"
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Scrolling Viewport Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}