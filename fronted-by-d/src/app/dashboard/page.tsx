'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { financialsApi, Analytics, ApiError } from '@/lib/api';

function KpiCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="card">
      <p className="font-mono text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${accent || 'text-white'}`}>{value}</p>
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
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-signal-slate">Overview</p>
        <h1 className="font-display text-2xl font-bold text-white">Fleet Dashboard</h1>
      </div>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {!data && !error && <p className="text-sm text-slate-500">Loading KPIs…</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Vehicles" value={data.summaryKPIs.totalVehicles} />
            <KpiCard label="Active (On Trip)" value={data.summaryKPIs.activeVehicles} accent="text-signal-amber" />
            <KpiCard label="In Maintenance" value={data.summaryKPIs.maintenanceVehicles} accent="text-signal-slate" />
            <KpiCard
              label="Fleet Utilization"
              value={`${data.summaryKPIs.fleetUtilizationPercentage}%`}
              accent="text-signal-teal"
            />
          </div>

          <div className="mt-8">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal-slate">Financial Ledger</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiCard label="Total Fuel Cost" value={`₹${data.financialLedger.aggregateFuelCost.toLocaleString()}`} />
              <KpiCard
                label="Total Maintenance Cost"
                value={`₹${data.financialLedger.aggregateMaintenanceCost.toLocaleString()}`}
              />
              <KpiCard
                label="Total Operational Cost"
                value={`₹${data.financialLedger.totalCalculatedOperationalCost.toLocaleString()}`}
                accent="text-signal-amber"
              />
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
