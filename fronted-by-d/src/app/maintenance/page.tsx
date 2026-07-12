'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { maintenanceApi, vehiclesApi, MaintenanceLog, Vehicle } from '@/lib/api';
import { errorMessage } from '@/lib/auth-context';

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-slate">04 — Shop</p>
          <h1 className="font-display text-2xl font-bold text-white">Maintenance</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Open Log'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {showForm && (
        <form onSubmit={onSubmit} className="card mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Description (e.g. Oil Change)"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Cost (₹)"
            required
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />
          <select
            className="input"
            required
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          >
            <option value="">Select vehicle…</option>
            {eligibleVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNo} — {v.model}
              </option>
            ))}
          </select>
          <div className="sm:col-span-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Opening…' : 'Open maintenance log'}
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading maintenance logs…</p>
        ) : logs.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No maintenance logs yet.</p>
        ) : (
          <table className="manifest w-full">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Started</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((m) => (
                <tr key={m.id}>
                  <td className="font-mono text-signal-amber">{m.vehicle?.registrationNo || m.vehicleId}</td>
                  <td>{m.description}</td>
                  <td>₹{m.cost.toLocaleString()}</td>
                  <td className="text-slate-400">{new Date(m.startDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-pill ${m.isOpen ? 'bg-signal-slate/20 text-signal-slate' : 'bg-signal-teal/15 text-signal-teal'}`}>
                      {m.isOpen ? 'IN SHOP' : 'CLOSED'}
                    </span>
                  </td>
                  <td>
                    {m.isOpen && (
                      <button onClick={() => onClose(m.id)} className="text-xs text-signal-teal hover:underline">
                        Close &amp; restore vehicle
                      </button>
                    )}
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
