'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/app/components/AppShell';
import StatusBadge from '@/app/components/StatusBadge';
import { tripsApi, vehiclesApi, driversApi, Trip, Vehicle, Driver } from '@/app/lib/api';
import { errorMessage } from '@/app/lib/auth-context';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    source: '',
    destination: '',
    cargoWeightKg: '',
    plannedDistance: '',
    vehicleId: '',
    driverId: '',
  });

  const [completeForm, setCompleteForm] = useState({ finalOdometer: '', fuelConsumed: '', fuelCost: '' });

  const load = () => {
    Promise.all([tripsApi.list(), vehiclesApi.list(), driversApi.list()])
      .then(([t, v, d]) => {
        setTrips(t);
        setVehicles(v);
        setDrivers(d);
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const availableVehicles = vehicles.filter((v) => v.status === 'AVAILABLE');
  const availableDrivers = drivers.filter((d) => d.status === 'AVAILABLE');

  const onDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await tripsApi.dispatch({
        source: form.source,
        destination: form.destination,
        cargoWeightKg: Number(form.cargoWeightKg),
        plannedDistance: Number(form.plannedDistance),
        vehicleId: form.vehicleId,
        driverId: form.driverId,
      });
      setForm({ source: '', destination: '', cargoWeightKg: '', plannedDistance: '', vehicleId: '', driverId: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingId) return;
    setError('');
    setSubmitting(true);
    try {
      await tripsApi.complete(completingId, {
        finalOdometer: Number(completeForm.finalOdometer),
        fuelConsumed: Number(completeForm.fuelConsumed),
        fuelCost: Number(completeForm.fuelCost),
      });
      setCompletingId(null);
      setCompleteForm({ finalOdometer: '', fuelConsumed: '', fuelCost: '' });
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = async (id: string) => {
    if (!confirm('Cancel this trip? The vehicle and driver will be restored to Available.')) return;
    try {
      await tripsApi.cancel(id);
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
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">03 — Logistics Tracking</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Route Dispatch Tower</h1>
        </div>
        <button 
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
            showForm 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:opacity-95'
          }`}
          onClick={() => {
            setShowForm((s) => !s);
            setCompletingId(null);
          }}
        >
          <span>{showForm ? 'Cancel Operation' : '+ Initiate New Route'}</span>
        </button>
      </div>

      {/* Exception Error Notification Center */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Glassmorphic Dispatch Initialization Panel */}
      {showForm && (
        <div className="glass-card bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl mb-6 relative shadow-lg dark:shadow-none animate-[fadeIn_0.25s_ease-out]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <h3 className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Route Matrix Parameters</h3>
          
          <form onSubmit={onDispatch} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
            <input
              className="glass-input"
              placeholder="Origin Station (Source)"
              required
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
            <input
              className="glass-input"
              placeholder="Destination Station"
              required
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            />
            <div className="relative">
              <input
                className="glass-input pr-12"
                type="number"
                placeholder="Cargo Weight"
                required
                value={form.cargoWeightKg}
                onChange={(e) => setForm({ ...form, cargoWeightKg: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-xs">KG</span>
            </div>
            <div className="relative">
              <input
                className="glass-input pr-12"
                type="number"
                placeholder="Planned Path Vector"
                required
                value={form.plannedDistance}
                onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-xs">KM</span>
            </div>

            <div className="relative">
              <select
                className="glass-input appearance-none cursor-pointer pr-10 text-slate-800 dark:text-slate-200"
                required
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              >
                <option value="" className="bg-white dark:bg-[#0b1329] text-slate-500">Assign Ready Vehicle Asset…</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white dark:bg-[#0b1329] text-slate-800 dark:text-white">
                    {v.registrationNo} — {v.model} ({v.maxLoadCapacityKg}kg cap)
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500">
                <span className="text-xs">▼</span>
              </div>
            </div>

            <div className="relative">
              <select
                className="glass-input appearance-none cursor-pointer pr-10 text-slate-800 dark:text-slate-200"
                required
                value={form.driverId}
                onChange={(e) => setForm({ ...form, driverId: e.target.value })}
              >
                <option value="" className="bg-white dark:bg-[#0b1329] text-slate-500">Assign Available Operator…</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id} className="bg-white dark:bg-[#0b1329] text-slate-800 dark:text-white">
                    {d.name} — {d.licenseNo}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500">
                <span className="text-xs">▼</span>
              </div>
            </div>

            <div className="sm:col-span-3 mt-2">
              <button type="submit" disabled={submitting} className="btn-gradient px-6 py-3">
                {submitting ? 'Transmitting Vectors...' : 'Authorize Route Dispatch'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Glassmorphic Post-Route Telemetry Debrief Form */}
      {completingId && (
        <div className="glass-card bg-white dark:bg-slate-900/20 border border-emerald-200 dark:border-emerald-500/20 p-6 rounded-2xl mb-6 relative shadow-lg dark:shadow-none animate-[fadeIn_0.25s_ease-out]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <h3 className="text-sm font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>Post-Trip Telemetry Input</span>
          </h3>

          <form onSubmit={onComplete} className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
            <div className="relative">
              <input
                className="glass-input pr-12 border-slate-200 dark:border-slate-800 focus:border-emerald-500/50"
                type="number"
                placeholder="Final Odometer reading"
                required
                value={completeForm.finalOdometer}
                onChange={(e) => setCompleteForm({ ...completeForm, finalOdometer: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-xs">KM</span>
            </div>

            <div className="relative">
              <input
                className="glass-input pr-12 border-slate-200 dark:border-slate-800 focus:border-emerald-500/50"
                type="number"
                placeholder="Total Fuel Consumption"
                required
                value={completeForm.fuelConsumed}
                onChange={(e) => setCompleteForm({ ...completeForm, fuelConsumed: e.target.value })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-xs">LITERS</span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 dark:text-slate-500 text-sm">₹</span>
              <input
                className="glass-input pl-8 border-slate-200 dark:border-slate-800 focus:border-emerald-500/50"
                type="number"
                placeholder="Total Fuel Outlay"
                required
                value={completeForm.fuelCost}
                onChange={(e) => setCompleteForm({ ...completeForm, fuelCost: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2 w-full">
              <button type="submit" disabled={submitting} className="btn-gradient from-emerald-500 to-teal-600 shadow-md dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-1 py-3">
                {submitting ? 'Recording Log...' : 'Commit Closure'}
              </button>
              <button 
                type="button" 
                className="px-4 py-3 text-xs font-mono border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/80 rounded-xl text-slate-500 dark:text-slate-400 transition-colors shadow-sm dark:shadow-none"
                onClick={() => setCompletingId(null)}
              >
                Abort
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Master Trans-Route Mission Manifest Grid Table */}
      <div className="border border-slate-200 dark:border-slate-900 shadow-xl dark:shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#070d19]/40 backdrop-blur-md">
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-5 h-5 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Syncing tracking network...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">No routes found inside dispatch registers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-100/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 font-medium">Route Path Mapping</th>
                  <th className="p-4 font-medium">Assigned Fleet Asset</th>
                  <th className="p-4 font-medium">Command Operator</th>
                  <th className="p-4 font-medium">Freight Load</th>
                  <th className="p-4 font-medium">Tracking Status</th>
                  <th className="p-4 font-medium text-right">Mission Control Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold">
                        <span>{t.source}</span>
                        <span className="text-cyan-600 dark:text-cyan-500 font-mono text-xs group-hover:translate-x-0.5 transition-transform">⟶</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{t.destination}</span>
                      </div>
                      {t.plannedDistance && (
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">
                          Est. Vector: {t.plannedDistance} km
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                      {t.vehicle?.registrationNo || t.vehicleId}
                    </td>
                    <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">
                      {t.driver?.name || t.driverId}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {t.cargoWeightKg.toLocaleString()} <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">KG</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="p-4 text-right">
                      {t.status === 'DISPATCHED' ? (
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setCompletingId(t.id);
                              setShowForm(false);
                            }}
                            className="font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                          >
                            De-brief Arrival
                          </button>
                          <button 
                            onClick={() => onCancel(t.id)} 
                            className="font-mono text-xs text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                          >
                            Abort
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-600 italic select-none pr-3 capitalize">
                          {t.status.toLowerCase()}
                        </span>
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