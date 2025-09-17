// src/app/entrar/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EntrarPage() {
  const { user, login, ready } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!ready) return null;
  if (user) {
    router.replace('/minha-conta');
    return null;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Informe um e-mail válido');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Informe seu nome');
      return;
    }
    // Como é demo/front-only, não validamos senha de verdade.
    login({ email, name: name || email.split('@')[0] });
    router.replace('/minha-conta');
  }

  return (
    <main className="container max-w-md py-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Acessar</h1>

      <div className="mt-4 grid grid-cols-2 rounded-xl border p-1 text-sm">
        <button
          onClick={() => setMode('login')}
          className={`rounded-lg py-2 ${mode === 'login' ? 'bg-emerald-600 text-white' : 'hover:bg-zinc-50'}`}
        >
          Entrar
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`rounded-lg py-2 ${mode === 'signup' ? 'bg-emerald-600 text-white' : 'hover:bg-zinc-50'}`}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === 'signup' && (
          <div>
            <label className="text-sm text-zinc-700">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Seu nome"
            />
          </div>
        )}

        <div>
          <label className="text-sm text-zinc-700">E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="voce@email.com"
            inputMode="email"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-700">Senha</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            type="password"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-zinc-500">Demo: não armazenamos senha — login é local no seu navegador.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>
    </main>
  );
}
