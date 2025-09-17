// src/app/minha-conta/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function MinhaContaPage() {
  const { user, ready, logout } = useAuth();

  if (!ready) return null;

  if (!user) {
    return (
      <main className="container max-w-md py-10">
        <h1 className="text-2xl font-extrabold tracking-tight">Minha conta</h1>
        <p className="mt-2 text-zinc-600">Você ainda não está logado.</p>
        <Link
          href="/entrar"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          Entrar ou criar conta
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Olá, {user.name || user.email.split('@')[0]} 👋</h1>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <section className="card">
          <h2 className="font-semibold">Meus dados</h2>
          <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
          <div className="mt-3">
            <button onClick={logout} className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50">Sair</button>
          </div>
        </section>

        <section className="card">
          <h2 className="font-semibold">Meus pedidos</h2>
          <p className="mt-1 text-sm text-zinc-600">Sem pedidos por enquanto.</p>
          <Link href="/" className="mt-3 inline-flex items-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Continuar comprando
          </Link>
        </section>
      </div>
    </main>
  );
}
