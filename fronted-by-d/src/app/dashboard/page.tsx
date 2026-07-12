'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/app/components/AppShell';
import { financialsApi, Analytics, ApiError } from '@/app/lib/api';

function KpiCard({ 
  label, 
  value, 
  accent, 
  subtext 
}: { 
  label: string; 
  value: string | number; 
  accent?: string;
  subtext?: string;
}) {
  return (
    <div className="glass-card bg-white dark:bg-slate-900/20 shadow-lg dark:shadow-xl border border-slate-200 dark:border-slate-800/60 p-5 relative overflow-hidden group min-h-[110px] flex flex-col justify-between rounded-2xl">
      {/* Dynamic top highlight line matching accents */}
      <div className={`absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent ${
        accent === 'text-signal-amber' ? 'via-amber-500/50' : 
        accent === 'text-signal-teal' ? 'via-cyan-500/50' : 'via-blue-500/30'
      } to-transparent`} />
      
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">{label}</p>
        <p className={`mt-2 font-display text-3xl font-bold tracking-tight ${
          accent === 'text-signal-amber' ? 'text-amber-600 dark:text-amber-500' :
          accent === 'text-signal-teal' ? 'text-cyan-600 dark:text-cyan-400' :
          accent === 'text-slate-400' ? 'text-slate-500 dark:text-slate-400' :
          'text-slate-900 dark:text-white'
        }`}>
          {value}
        </p>
      </div>

      {subtext && (
        <div className="mt-2 flex items-center space-x-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse" />
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    financialsApi
      .analytics()
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load analytics.'));
  }, []);

  return (
    <AppShell>
      {/* Dashboard Section Title */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-900 pb-5 gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Operations Control</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Fleet Core Dashboard</h1>
        </div>
        <div className="mt-3 sm:mt-0 font-mono text-[11px] flex items-center space-x-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
          <span className="text-slate-600 dark:text-slate-400">TELEMETRY MATRIX: CONNECTED</span>
        </div>
      </div>

      {/* Error Interface Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletal Pulse */}
      {!data && !error && (
        <div className="p-6 bg-slate-50 dark:bg-[#02050e] border border-slate-200 dark:border-slate-900 rounded-2xl flex items-center justify-center min-h-[200px] shadow-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 tracking-wide uppercase">Compiling Real-Time Operational KPIs…</p>
          </div>
        </div>
      )}

      {/* Active Stream Telemetry Grid Mapping */}
      {data && (
        <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
          
          {/* Row 1: Asset Utilization Telemetry Pods */}
          <div>
            <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-3">
              Fleet Asset States
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard 
                label="Total Registered Fleet" 
                value={data.summaryKPIs.totalVehicles} 
                subtext="Master registry logs"
              />
              <KpiCard 
                label="Active Transit Routes" 
                value={data.summaryKPIs.activeVehicles} 
                accent="text-signal-amber" 
                subtext="En route / Dispatch active"
              />
              <KpiCard 
                label="Asset Maintenance Slots" 
                value={data.summaryKPIs.maintenanceVehicles} 
                accent="text-slate-400" 
                subtext="Isolated inside workshop"
              />
              <KpiCard
                label="Total Fleet Utilization"
                value={`${data.summaryKPIs.fleetUtilizationPercentage}%`}
                accent="text-signal-teal"
                subtext="Live deployment efficiency"
              />
            </div>
          </div>

          {/* Row 2: Financial Balance Matrices */}
          <div className="pt-2">
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-3">
              Financial Capital Ledger
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiCard 
                label="Aggregate Fuel Outlays" 
                value={`₹${data.financialLedger.aggregateFuelCost.toLocaleString()}`} 
                subtext="Fuel log transactions summary"
              />
              <KpiCard
                label="Aggregate Repair Expenses"
                value={`₹${data.financialLedger.aggregateMaintenanceCost.toLocaleString()}`}
                subtext="Workshop invoice integrations"
              />
              <KpiCard
                label="Total Operating Capital Cost"
                value={`₹${data.financialLedger.totalCalculatedOperationalCost.toLocaleString()}`}
                accent="text-signal-amber"
                subtext="Combined Fuel + Maintenance"
              />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}