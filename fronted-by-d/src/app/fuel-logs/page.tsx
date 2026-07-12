'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { fuelApi, vehiclesApi, FuelLog, Vehicle } from '@/lib/api';
import { errorMessage } from '@/lib/auth-context';

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-slate">05 — Fuel</p>
          <h1 className="font-display text-2xl font-bold text-white">Fuel Logs</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Log Fuel'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {showForm && (
        <form onSubmit={onSubmit} className="card mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            className="input"
            required
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          >
            <option value="">Select vehicle…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNo} — {v.model}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="number"
            step="0.01"
            placeholder="Liters"
            required
            value={form.liters}
            onChange={(e) => setForm({ ...form, liters: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Cost (₹)"
            required
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />
          <div className="sm:col-span-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving…' : 'Add fuel log'}
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading fuel logs…</p>
        ) : logs.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No fuel logs yet.</p>
        ) : (
          <table className="manifest w-full">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Liters</th>
                <th>Cost</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((f) => (
                <tr key={f.id}>
                  <td className="font-mono text-signal-amber">{f.vehicle?.registrationNo || f.vehicleId}</td>
                  <td>{f.liters} L</td>
                  <td>₹{f.cost.toLocaleString()}</td>
                  <td className="text-slate-400">{new Date(f.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
