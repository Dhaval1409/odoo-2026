'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { expensesApi, vehiclesApi, Expense, Vehicle } from '@/lib/api';
import { errorMessage } from '@/lib/auth-context';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: '', amount: '', vehicleId: '' });

  const load = () => {
    Promise.all([expensesApi.list(), vehiclesApi.list()])
      .then(([e, v]) => {
        setExpenses(e);
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
      await expensesApi.create({ type: form.type, amount: Number(form.amount), vehicleId: form.vehicleId });
      setForm({ type: '', amount: '', vehicleId: '' });
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
          <p className="font-mono text-xs uppercase tracking-widest text-signal-slate">06 — Ledger</p>
          <h1 className="font-display text-2xl font-bold text-white">Expenses</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add Expense'}
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
            placeholder="Type (e.g. Toll, Fine)"
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Amount (₹)"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <div className="sm:col-span-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving…' : 'Add expense'}
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading expenses…</p>
        ) : expenses.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No expenses recorded yet.</p>
        ) : (
          <table className="manifest w-full">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td className="font-mono text-signal-amber">{e.vehicle?.registrationNo || e.vehicleId}</td>
                  <td>{e.type}</td>
                  <td>₹{e.amount.toLocaleString()}</td>
                  <td className="text-slate-400">{new Date(e.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
