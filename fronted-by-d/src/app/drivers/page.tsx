'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import StatusBadge from '@/components/StatusBadge';
import { driversApi, Driver } from '@/lib/api';
import { errorMessage } from '@/lib/auth-context';

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-slate">02 — Roster</p>
          <h1 className="font-display text-2xl font-bold text-white">Drivers</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Register Driver'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {showForm && (
        <form onSubmit={onSubmit} className="card mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="License number"
            required
            value={form.licenseNo}
            onChange={(e) => setForm({ ...form, licenseNo: e.target.value })}
          />
          <input
            className="input"
            placeholder="License category (e.g. LMV)"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-slate-400">
              License Expiry
            </label>
            <input
              className="input"
              type="date"
              required
              value={form.licenseExpiry}
              onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Contact number"
            required
            value={form.contactNo}
            onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
          />
          <div className="flex items-end sm:col-span-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Registering…' : 'Register driver'}
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading drivers…</p>
        ) : drivers.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No drivers registered yet.</p>
        ) : (
          <table className="manifest w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>License No.</th>
                <th>Category</th>
                <th>License Expiry</th>
                <th>Safety Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td className="font-mono text-signal-amber">{d.licenseNo}</td>
                  <td className="text-slate-400">{d.category}</td>
                  <td className={isExpired(d.licenseExpiry) ? 'text-signal-red' : ''}>
                    {new Date(d.licenseExpiry).toLocaleDateString()}
                    {isExpired(d.licenseExpiry) && ' (expired)'}
                  </td>
                  <td>{d.safetyScore.toFixed(1)}</td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
