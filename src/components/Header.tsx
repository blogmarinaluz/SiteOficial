// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Header() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  };

  const chips = ["iPhone", "Samsung", "Motorola", "Xiaomi", "Apple Watch", "AirPods"];

  return (
    <header className="header">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-lg bg-emerald-600" aria-hidden />
          <span className="font-semibold">Sua Loja</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/ofertas" className="menu-link">Ofertas</Link>
          <Link href="/mais-buscados" className="menu-link">Mais buscados</Link>
          <Link href="/contato" className="menu-link">Contato</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/conta" className="p-2 rounded-xl hover:bg-zinc-100" aria-label="Minha conta">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-4.42 0-8 2.02-8 4.5V21h16v-2.5c0-2.48-3.58-4.5-8-4.5z" fill="currentColor"/></svg>
          </Link>
          <Link href="/carrinho" className="p-2 rounded-xl hover:bg-zinc-100" aria-label="Carrinho">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44c-.16.28-.25.61-.25.97 0 1.1.9 2 2 2h9v-2h-8.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h5.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1h-14.31l-.94-2zm-1 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm12 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/></svg>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={onSearch} className="flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 h-11">
          <svg viewBox="0 0 24 24" width="18" height="18" className="opacity-70">
            <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm11 3-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <input
            aria-label="Buscar"
            placeholder="Buscar aparelhos e acessórios"
            className="flex-1 outline-none bg-transparent text-[15px] placeholder:text-zinc-400"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-sm">
            Buscar
          </button>
        </form>

        {/* chips / atalhos (mobile apenas) */}
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {chips.map((c) => (
            <Link
              key={c}
              href={`/buscar?q=${encodeURIComponent(c)}`}
              className="snap-start whitespace-nowrap rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
