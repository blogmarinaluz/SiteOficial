"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ShoppingCart, User, ChevronDown } from "lucide-react";
import products from "@/data/products.json";

function uniqueBy<T, K extends string | number>(arr: T[], key: (t: T) => K) {
  const map = new Map<K, T>();
  for (const it of arr) {
    const k = key(it);
    if (!map.has(k)) map.set(k, it);
  }
  return Array.from(map.values());
}

export function Header() {
  const [q, setQ] = useState("");

  const apple = useMemo(
    () =>
      uniqueBy(
        (products as any[]).filter((p) => p.brand?.toLowerCase() === "apple"),
        (p: any) => p.model_key
      ).slice(0, 8),
    []
  );
  const samsung = useMemo(
    () =>
      uniqueBy(
        (products as any[]).filter((p) => p.brand?.toLowerCase() === "samsung"),
        (p: any) => p.model_key
      ).slice(0, 8),
    []
  );

  return (
    <header className="header">
      <div className="container py-4 flex items-center gap-4">
        <Link href="/" className="text-2xl font-extrabold text-accent">
          prostore
        </Link>

        <nav className="hidden md:flex gap-6">
          <div className="group relative">
            <Link href="/categoria/apple" className="menu-link flex items-center gap-1">
              Apple <ChevronDown className="w-4 h-4" />
            </Link>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded-2xl shadow-lg p-3 w-72 z-50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {apple.map((m: any) => (
                  <Link
                    key={m.model_key}
                    href={`/buscar?q=${encodeURIComponent(m.model_key)}`}
                    className="hover:text-accent"
                  >
                    {m.name}
                  </Link>
                ))}
                <Link href="/categoria/apple" className="text-accent font-medium mt-1">
                  Mais modelos…
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative">
            <Link href="/categoria/samsung" className="menu-link flex items-center gap-1">
              Samsung <ChevronDown className="w-4 h-4" />
            </Link>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded-2xl shadow-lg p-3 w-72 z-50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {samsung.map((m: any) => (
                  <Link
                    key={m.model_key}
                    href={`/buscar?q=${encodeURIComponent(m.model_key)}`}
                    className="hover:text-accent"
                  >
                    {m.name}
                  </Link>
                ))}
                <Link href="/categoria/samsung" className="text-accent font-medium mt-1">
                  Mais modelos…
                </Link>
              </div>
            </div>
          </div>

          <Link className="menu-link" href="/central-de-ajuda">
            Suporte
          </Link>
          <Link className="menu-link" href="/faq">
            FAQ
          </Link>
        </nav>

        <form action="/buscar" className="flex-1 flex max-w-xl">
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busque iPhone, Galaxy..."
            className="w-full border border-zinc-300 rounded-l-2xl px-3 py-2 outline-none"
          />
          <button className="btn-primary rounded-l-none">Buscar</button>
        </form>

        <Link className="btn-outline" href="/minha-conta">
          <User className="w-5 h-5 mr-2" /> Minha Conta
        </Link>
        <Link className="btn-primary" href="/carrinho">
          <ShoppingCart className="w-5 h-5 mr-2" /> Carrinho
        </Link>
      </div>

      <div className="bg-accent text-white">
        <div className="container py-2 text-sm">
          Cupom ativo: <b>30% OFF</b> aplicado no carrinho · Boleto para negativados (análise de cadastro).
        </div>
      </div>
    </header>
  );
}
