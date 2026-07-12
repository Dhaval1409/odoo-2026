import React from 'react';
import DashboardLayout from './(dashboard)/layout';

export default function OverviewDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Operations Control Room</h2>
          <p className="text-sm text-slate-400">Real-time telemetry and resource performance overview.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500">
            <option>All Regions</option>
            <option>Western Zone</option>
          </select>
        </div>
      </div>

      {/* Grid of Dynamic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Deployments', value: '42', detail: '87% Active Capacity', color: 'border-indigo-500/30' },
          { title: 'Available Fleet Assets', value: '18', detail: 'Ready for Dispatch', color: 'border-emerald-500/30' },
          { title: 'In Maintenance Bays', value: '05', detail: 'Urgent turnaround logs', color: 'border-amber-500/30' },
          { title: 'Overall Utilization Rate', value: '89.4%', detail: '+2.4% vs Last Week', color: 'border-purple-500/30' },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-gradient-to-b from-slate-900 to-slate-950 border ${kpi.color} p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-200 shadow-xl`}>
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{kpi.title}</p>
            <p className="text-4xl font-extrabold tracking-tight text-white my-2">{kpi.value}</p>
            <p className="text-xs text-slate-500 font-medium">{kpi.detail}</p>
            <div className="absolute top-0 right-0 h-24 w-24 bg-slate-800/10 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* Analytics Dashboard Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Active Deliveries Mapping</h3>
          <div className="h-64 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center text-xs text-slate-500">
            [Interactive High-Performance Chart Component Integration]
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Safety Compliance Guard</h3>
          <div className="space-y-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-rose-400">License Expiring Soon</p>
                <p className="text-[11px] text-slate-400">Driver: Alex R.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-950 text-rose-400 px-2 py-1 rounded">2 Days</span>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-amber-400">Critical Maintenance Past Due</p>
                <p className="text-[11px] text-slate-400">Asset: Truck-09 (Odometer Overrun)</p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-950 text-amber-400 px-2 py-1 rounded">Fix</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
