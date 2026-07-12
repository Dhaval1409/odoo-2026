'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/app/components/AppShell';
import { fuelApi, vehiclesApi, FuelLog, Vehicle } from '@/app/lib/api';
import { errorMessage } from '@/app/lib/auth-context';

export default function FuelLogsPage() {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ liters: '', cost: '', vehicleId: '' });

  const load = () => {
    Promise.all([fuelApi.list(), vehiclesApi.list()])
      .then(([l, v]) => {
        setLogs(l);
        setVehicles(v);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await fuelApi.create({ liters: Number(form.liters), cost: Number(form.cost), vehicleId: form.vehicleId });
      setForm({ liters: '', cost: '', vehicleId: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      {/* Module Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-900 pb-5 gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">05 — Resource Allocation</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Fuel Registry</h1>
        </div>
        <button 
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
            showForm 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:opacity-95'
          }`}
          onClick={() => setShowForm((s) => !s)}
        >
          <span>{showForm ? 'Cancel Operation' : '+ Log Fuel Intake'}</span>
        </button>
      </div>

      {/* Exception Error Handling Container */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Glassmorphic Fuel Intake Input Form */}
      {showForm && (
        <div className="glass-card bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl mb-6 relative shadow-lg dark:shadow-none animate-[fadeIn_0.25s_ease-out]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <h3 className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Initialize Refueling Stream</h3>
          
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
            <div className="relative">
              <select
                className="glass-input appearance-none cursor-pointer pr-10 text-slate-800 dark:text-slate-200"
                required
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              >
                <option value="" className="bg-white dark:bg-[#0b1329] text-slate-500">Target vehicle asset…</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white dark:bg-[#0b1329] text-slate-900 dark:text-white">
                    {v.registrationNo} — {v.model}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500">
                <span className="text-[10px]">▼</span>
              </div>
            </div>

            <div className="relative">
              <input
                className="glass-input pr-16"
                type="number"
                step="0.01"
                placeholder="Volume Intake"
                required
                value={form.liters}
                onChange={(e) => setForm({ ...form, liters: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-xs select-none">LITERS</span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-sm select-none">₹</span>
              <input
                className="glass-input pl-8"
                type="number"
                placeholder="Total Cost"
                required
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
              />
            </div>

            <div className="sm:col-span-1">
              <button type="submit" disabled={submitting} className="btn-gradient w-full py-3">
                {submitting ? 'Recording Log...' : 'Commit Fuel Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Master Telemetry Fuel Log Manifest Table */}
      <div className="border border-slate-200 dark:border-slate-900 shadow-xl dark:shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#070d19]/40 backdrop-blur-md">
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-5 h-5 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Syncing resource logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">No fuel logs found in this tracking matrix.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-100/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 font-medium">Vehicle Asset</th>
                  <th className="p-4 font-medium">Volume Dispensed</th>
                  <th className="p-4 font-medium">Cost Aggregate</th>
                  <th className="p-4 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                {logs.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                    <td className="p-4 font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wide group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                      {f.vehicle?.registrationNo || f.vehicleId}
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-300">
                      {f.liters.toFixed(2)} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">L</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                      ₹{f.cost.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-400 dark:text-slate-500">
                      {new Date(f.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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