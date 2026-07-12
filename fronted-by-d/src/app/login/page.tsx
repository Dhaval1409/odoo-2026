'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, errorMessage } from '@/lib/auth-context';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
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
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-signal-slate">Fleet Operations Console</p>
        </div>
        <form onSubmit={onSubmit} className="card space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-signal-red">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          No account?{' '}
          <Link href="/register" className="text-signal-amber hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
