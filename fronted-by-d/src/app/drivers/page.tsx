'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/app/components/AppShell';
import StatusBadge from '@/app/components/StatusBadge';
import { driversApi, Driver } from '@/app/lib/api';
import { errorMessage } from '@/app/lib/auth-context';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    licenseNo: '',
    category: '',
    licenseExpiry: '',
    contactNo: '',
  });

  const load = () => {
    driversApi
      .list()
      .then(setDrivers)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await driversApi.create(form);
      setForm({ name: '', licenseNo: '', category: '', licenseExpiry: '', contactNo: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <AppShell>
      {/* Header Module Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-900 pb-5 gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400">02 — Logistics Roster</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Personnel Management</h1>
        </div>
        <button 
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
            showForm 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md dark:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:opacity-95'
          }`}
          onClick={() => setShowForm((s) => !s)}
        >
          <span>{showForm ? 'Cancel Operation' : '+ Register New Driver'}</span>
        </button>
      </div>

      {/* Exception Error Handling Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2 animate-shake">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Glassmorphic Driver Registration Drawer Form */}
      {showForm && (
        <div className="glass-card bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl mb-6 relative shadow-lg dark:shadow-none animate-[fadeIn_0.25s_ease-out]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <h3 className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Initialize Profile Entry</h3>
          
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
            <input
              className="glass-input"
              placeholder="Full name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="glass-input"
              placeholder="License number"
              required
              value={form.licenseNo}
              onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
            />
            <input
              className="glass-input"
              placeholder="License category (e.g. LMV)"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <div>
              <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                License Expiry Threshold
              </label>
              <input
                className="glass-input text-slate-700 dark:text-slate-300"
                type="date"
                required
                value={form.licenseExpiry}
                onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })}
              />
            </div>
            <input
              className="glass-input"
              placeholder="Contact number"
              required
              value={form.contactNo}
              onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
            />
            <div className="sm:col-span-1">
              <button type="submit" disabled={submitting} className="btn-gradient w-full py-3">
                {submitting ? 'Registering Assets…' : 'Commit Operator Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Master Core Manifest Personnel Table */}
      <div className="border border-slate-200 dark:border-slate-900 shadow-xl dark:shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-[#070d19]/40 backdrop-blur-md">
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-5 h-5 border-2 border-cyan-500 dark:border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Syncing operator indexes...</p>
          </div>
        ) : drivers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">No profiles recorded inside directory matrix.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-100/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 font-medium">Name / Contact</th>
                  <th className="p-4 font-medium">License No.</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">License Expiry</th>
                  <th className="p-4 font-medium">Safety Score</th>
                  <th className="p-4 font-medium">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                {drivers.map((d) => {
                  const expired = isExpired(d.licenseExpiry);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{d.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{d.contactNo}</div>
                      </td>
                      <td className="p-4 font-mono text-slate-600 dark:text-slate-300 text-xs tracking-wide">
                        {d.licenseNo}
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded uppercase">
                          {d.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {expired ? (
                          <span className="inline-flex items-center space-x-1.5 text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">
                            <span className="w-1 h-1 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                            <span>EXPIRED</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-300">
                            {new Date(d.licenseExpiry).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold">
                        <span className={`${
                          d.safetyScore >= 85 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : d.safetyScore >= 70 
                              ? 'text-amber-600 dark:text-amber-400' 
                              : 'text-red-600 dark:text-red-400'
                        }`}>
                          {d.safetyScore.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={d.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}