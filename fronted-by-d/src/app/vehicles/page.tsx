'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import StatusBadge from '@/components/StatusBadge';
import { vehiclesApi, Vehicle } from '@/lib/api';
import { errorMessage } from '@/lib/auth-context';

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-slate">01 — Registry</p>
          <h1 className="font-display text-2xl font-bold text-white">Vehicles</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Register Vehicle'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {showForm && (
        <form onSubmit={onSubmit} className="card mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Registration No. (e.g. GJ01AB1234)"
            required
            value={form.registrationNo}
            onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
          />
          <input
            className="input"
            placeholder="Model (e.g. Tata Ace)"
            required
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
          <input
            className="input"
            placeholder="Type (e.g. Mini Truck)"
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Max Load Capacity (kg)"
            required
            value={form.maxLoadCapacityKg}
            onChange={(e) => setForm({ ...form, maxLoadCapacityKg: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Odometer (km)"
            required
            value={form.odometer}
            onChange={(e) => setForm({ ...form, odometer: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Acquisition Cost (₹)"
            required
            value={form.acquisitionCost}
            onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })}
          />
          <div className="sm:col-span-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Registering…' : 'Register vehicle'}
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading vehicles…</p>
        ) : vehicles.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No vehicles registered yet.</p>
        ) : (
          <table className="manifest w-full">
            <thead>
              <tr>
                <th>Reg. No.</th>
                <th>Model</th>
                <th>Type</th>
                <th>Max Load</th>
                <th>Odometer</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="font-mono text-signal-amber">{v.registrationNo}</td>
                  <td>{v.model}</td>
                  <td className="text-slate-400">{v.type}</td>
                  <td>{v.maxLoadCapacityKg} kg</td>
                  <td>{v.odometer} km</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td>
                    {v.status !== 'RETIRED' && (
                      <button onClick={() => onRetire(v.id)} className="text-xs text-signal-red hover:underline">
                        Retire
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
