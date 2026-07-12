'use client';

import React from 'react';

export default function OverviewDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Operations Control Center
        </h2>
        <p className="text-sm text-slate-400">Welcome to your smart transport telemetry terminal.</p>
      </div>
      
      <div className="p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10 text-center text-slate-500 text-xs">
        Primary dashboard panels will be rendered here. Use the role switcher in the lower left to test dynamic RBAC view states.
      </div>
    </div>
  );
}