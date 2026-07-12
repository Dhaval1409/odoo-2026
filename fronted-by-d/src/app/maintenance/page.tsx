'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/app/components/AppShell';
import { maintenanceApi, vehiclesApi, MaintenanceLog, Vehicle } from '@/app/lib/api';
import { errorMessage } from '@/app/lib/auth-context';

export default function MaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ description: '', cost: '', vehicleId: '' });

  const load = () => {
    Promise.all([maintenanceApi.list(), vehiclesApi.list()])
      .then(([l, v]) => {
        setLogs(l);
        setVehicles(v);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const eligibleVehicles = vehicles.filter((v) => v.status !== 'ON_TRIP' && v.status !== 'RETIRED');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await maintenanceApi.create({ description: form.description, cost: Number(form.cost), vehicleId: form.vehicleId });
      setForm({ description: '', cost: '', vehicleId: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onClose = async (id: string) => {
    try {
      await maintenanceApi.close(id);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <AppShell>
      {/* Module Title Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-900 pb-5 gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">04 — Workshop Diagnostics</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Maintenance Control</h1>
        </div>
        <button 
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
            showForm 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:opacity-95'
          }`}
          onClick={() => setShowForm((s) => !s)}
        >
          <span>{showForm ? 'Cancel Operation' : '+ Initiate Workshop Log'}</span>
        </button>
      </div>

      {/* Exception Alerts Handling Output */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Glassmorphic Maintenance Intake Action Drawer */}
      {showForm && (
        <div className="glass-card bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl mb-6 relative shadow-lg dark:shadow-none animate-[fadeIn_0.25s_ease-out]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <h3 className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Open Workshop Order</h3>
          
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
            <input
              className="glass-input"
              placeholder="Description (e.g. Scheduled Oil Change)"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-sm">₹</span>
              <input
                className="glass-input pl-8"
                type="number"
                placeholder="Est. Outlay Cost"
                required
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
              />
            </div>

            <div className="relative">
              <select
                className="glass-input appearance-none cursor-pointer pr-10 text-slate-800 dark:text-slate-200"
                required
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              >
                <option value="" className="bg-white dark:bg-[#0b1329] text-slate-500">Target eligible asset…</option>
                {eligibleVehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white dark:bg-[#0b1329] text-slate-800 dark:text-white">
                    {v.registrationNo} — {v.model}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500">
                <span className="text-xs">▼</span>
              </div>
            </div>

            <div className="sm:col-span-3 mt-2">
              <button type="submit" disabled={submitting} className="btn-gradient px-6 py-3">
                {submitting ? 'Deploying to Workshop...' : 'Deploy Asset to Shop Grid'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Master Telemetry Maintenance Logs Matrix */}
      <div className="border border-slate-200 dark:border-slate-900 shadow-xl dark:shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#070d19]/40 backdrop-blur-md">
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-5 h-5 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Syncing workshop registers...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">No service tickets recorded inside directory matrix.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-100/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 font-medium">Vehicle Asset</th>
                  <th className="p-4 font-medium">Diagnostic Details</th>
                  <th className="p-4 font-medium">Cost Outlay</th>
                  <th className="p-4 font-medium">Intake Timestamp</th>
                  <th className="p-4 font-medium">Registry State</th>
                  <th className="p-4 font-medium text-right">Operational Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                {logs.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                    <td className="p-4 font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                      {m.vehicle?.registrationNo || m.vehicleId}
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                      {m.description}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                      ₹{m.cost.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {new Date(m.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {m.isOpen ? (
                        <span className="inline-flex items-center space-x-1.5 font-mono text-[10px] tracking-wide bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full uppercase">
                          <span className="w-1 h-1 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
                          <span>IN SHOP</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 font-mono text-[10px] tracking-wide bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full uppercase">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                          <span>COMPLETED</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {m.isOpen ? (
                        <button 
                          onClick={() => onClose(m.id)} 
                          className="font-mono text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 px-3 py-1.5 rounded-xl transition-all shadow-sm dark:shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                        >
                          Restore Asset Clearance
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-600 italic select-none pr-3">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}