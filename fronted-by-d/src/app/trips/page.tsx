'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import StatusBadge from '@/components/StatusBadge';
import { tripsApi, vehiclesApi, driversApi, Trip, Vehicle, Driver } from '@/lib/api';
import { errorMessage } from '@/lib/auth-context';

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-slate">03 — Dispatch</p>
          <h1 className="font-display text-2xl font-bold text-white">Trips</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Dispatch Trip'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {showForm && (
        <form onSubmit={onDispatch} className="card mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Source"
            required
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
          <input
            className="input"
            placeholder="Destination"
            required
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Cargo weight (kg)"
            required
            value={form.cargoWeightKg}
            onChange={(e) => setForm({ ...form, cargoWeightKg: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Planned distance (km)"
            required
            value={form.plannedDistance}
            onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })}
          />
          <select
            className="input"
            required
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          >
            <option value="">Select available vehicle…</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNo} — {v.model} (max {v.maxLoadCapacityKg}kg)
              </option>
            ))}
          </select>
          <select
            className="input"
            required
            value={form.driverId}
            onChange={(e) => setForm({ ...form, driverId: e.target.value })}
          >
            <option value="">Select available driver…</option>
            {availableDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.licenseNo}
              </option>
            ))}
          </select>
          <div className="sm:col-span-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Dispatching…' : 'Dispatch trip'}
            </button>
          </div>
        </form>
      )}

      {completingId && (
        <form onSubmit={onComplete} className="card mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <p className="text-sm text-slate-300 sm:col-span-4">Complete trip — enter final readings:</p>
          <input
            className="input"
            type="number"
            placeholder="Final odometer (km)"
            required
            value={completeForm.finalOdometer}
            onChange={(e) => setCompleteForm({ ...completeForm, finalOdometer: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Fuel consumed (L)"
            required
            value={completeForm.fuelConsumed}
            onChange={(e) => setCompleteForm({ ...completeForm, fuelConsumed: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Fuel cost (₹)"
            required
            value={completeForm.fuelCost}
            onChange={(e) => setCompleteForm({ ...completeForm, fuelCost: e.target.value })}
          />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving…' : 'Complete'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setCompletingId(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading trips…</p>
        ) : trips.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No trips yet.</p>
        ) : (
          <table className="manifest w-full">
            <thead>
              <tr>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id}>
                  <td>
                    {t.source} → {t.destination}
                  </td>
                  <td className="font-mono text-signal-amber">{t.vehicle?.registrationNo || t.vehicleId}</td>
                  <td>{t.driver?.name || t.driverId}</td>
                  <td>{t.cargoWeightKg} kg</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="space-x-3">
                    {t.status === 'DISPATCHED' && (
                      <>
                        <button
                          onClick={() => setCompletingId(t.id)}
                          className="text-xs text-signal-teal hover:underline"
                        >
                          Complete
                        </button>
                        <button onClick={() => onCancel(t.id)} className="text-xs text-signal-red hover:underline">
                          Cancel
                        </button>
                      </>
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
