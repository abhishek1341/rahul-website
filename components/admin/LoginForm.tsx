'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setPending(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || 'Could not sign in');
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Could not sign in');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <p className="admin-kicker">Suntrix Media</p>
        <h1>Admin</h1>
        <p className="admin-login-copy">
          {configured
            ? 'Enter the shared password to edit logos, videos, and numbers.'
            : 'Set ADMIN_PASSWORD in the server environment, then restart the app.'}
        </p>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={!configured || pending}
            required
          />
        </label>

        {error ? <p className="admin-error">{error}</p> : null}

        <button type="submit" className="btn-primary admin-full" disabled={!configured || pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
