'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/app/components/AppShell';
import StatusBadge from '@/app/components/StatusBadge';
import { vehiclesApi, Vehicle } from '@/app/lib/api';
import { errorMessage } from '@/app/lib/auth-context';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    registrationNo: '',
    model: '',
    type: '',
    maxLoadCapacityKg: '',
    odometer: '',
    acquisitionCost: '',
  });

  const load = () => {
    vehiclesApi
      .list()
      .then(setVehicles)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await vehiclesApi.create({
        registrationNo: form.registrationNo,
        model: form.model,
        type: form.type,
        maxLoadCapacityKg: Number(form.maxLoadCapacityKg),
        odometer: Number(form.odometer),
        acquisitionCost: Number(form.acquisitionCost),
      });
      setForm({ registrationNo: '', model: '', type: '', maxLoadCapacityKg: '', odometer: '', acquisitionCost: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onRetire = async (id: string) => {
    if (!confirm('Retire this vehicle? It will be removed from the dispatch pool permanently.')) return;
    try {
      await vehiclesApi.retire(id);
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
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">01 — Fleet Inventory</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Asset Registry</h1>
        </div>
        <button 
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
            showForm 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:opacity-95'
          }`}
          onClick={() => setShowForm((s) => !s)}
        >
          <span>{showForm ? 'Cancel Operation' : '+ Onboard New Asset'}</span>
        </button>
      </div>

      {/* Exception Error Handling Container */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Glassmorphic Asset Onboarding Form Drawer */}
      {showForm && (
        <div className="glass-card bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl mb-6 relative shadow-lg dark:shadow-none animate-[fadeIn_0.25s_ease-out]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <h3 className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Log Fleet Specifications</h3>
          
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
            <input
              className="glass-input uppercase"
              placeholder="Registration No. (e.g. GJ01AB1234)"
              required
              value={form.registrationNo}
              onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
            />
            <input
              className="glass-input"
              placeholder="Model / Brand Lineup (e.g. Tata Ace)"
              required
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
            <input
              className="glass-input"
              placeholder="Classification Type (e.g. Mini Truck)"
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <div className="relative">
              <input
                className="glass-input pr-12"
                type="number"
                placeholder="Max Load Limit"
                required
                value={form.maxLoadCapacityKg}
                onChange={(e) => setForm({ ...form, maxLoadCapacityKg: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-xs">KG</span>
            </div>
            <div className="relative">
              <input
                className="glass-input pr-12"
                type="number"
                placeholder="Initial Mileage"
                required
                value={form.odometer}
                onChange={(e) => setForm({ ...form, odometer: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-xs">KM</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-sm">₹</span>
              <input
                className="glass-input pl-8"
                type="number"
                placeholder="Acquisition Book Value"
                required
                value={form.acquisitionCost}
                onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })}
              />
            </div>

            <div className="sm:col-span-3 mt-2">
              <button type="submit" disabled={submitting} className="btn-gradient px-6 py-3">
                {submitting ? 'Processing Ledger Records...' : 'Authorize Asset Commission'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Master Telemetry Fleet Registry Manifest Table */}
      <div className="border border-slate-200 dark:border-slate-900 shadow-xl dark:shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#070d19]/40 backdrop-blur-md">
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-5 h-5 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Syncing fleet matrix...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">No vehicles registered inside current tracking array.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-100/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 font-medium">Registry Identification</th>
                  <th className="p-4 font-medium">Asset Model</th>
                  <th className="p-4 font-medium">Classification</th>
                  <th className="p-4 font-medium">Net Payload Capacity</th>
                  <th className="p-4 font-medium">Total Odometry</th>
                  <th className="p-4 font-medium">Asset Status</th>
                  <th className="p-4 font-medium text-right">Pool Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                    <td className="p-4 font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wide group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors uppercase">
                      {v.registrationNo}
                    </td>
                    <td className="p-4 text-slate-900 dark:text-white font-medium">
                      {v.model}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                        {v.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {v.maxLoadCapacityKg.toLocaleString()} <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">KG</span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {v.odometer.toLocaleString()} <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">KM</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="p-4 text-right">
                      {v.status !== 'RETIRED' ? (
                        <button 
                          onClick={() => onRetire(v.id)} 
                          className="font-mono text-xs text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          Decommission Asset
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-600 italic select-none pr-3">Archived</span>
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