'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, errorMessage } from '@/lib/auth-context';

const ROLES = [
  { value: 'FLEET_MANAGER', label: 'Fleet Manager' },
  { value: 'DISPATCHER', label: 'Dispatcher' },
  { value: 'SAFETY_OFFICER', label: 'Safety Officer' },
  { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES[0].value);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-asphalt-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-bold text-white">TransitOps</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-signal-slate">Create your account</p>
        </div>
        <form onSubmit={onSubmit} className="card space-y-4">
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-slate-400">Name</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Shah" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-slate-400">Email</label>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@fleet.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-slate-400">Password</label>
            <input
              className="input"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-slate-400">Role</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-signal-red">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-signal-amber hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
