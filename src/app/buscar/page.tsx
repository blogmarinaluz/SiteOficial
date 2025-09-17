// src/app/buscar/page.tsx
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import ProductCard, { Product } from '@/components/ProductCard';
import products from '@/data/products.json';

const SUGGESTIONS = ['iPhone 11', 'iPhone 12', 'Galaxy S21', 'Xiaomi', 'Motorola', 'Apple Watch', 'AirPods'];

function normalize(s: string) {
  return (s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export default function Buscar() {
  const sp = useSearchParams();
  const router = useRouter();
  const term = (sp.get('q') || '').trim();
  const q = normalize(term);

  const items = useMemo(() => {
    if (!q) return (products as Product[]);
    return (products as Product[]).filter(p => normalize([p.name, (p as any).brand, (p as any).storage, (p as any).color].join(' ')).includes(q));
  }, [q]);

  const resultLabel = term ? `Resultados para: "${term}"` : 'Resultados';

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">{resultLabel}</h1>
        <Link href="/" className="text-sm text-emerald-700 hover:underline">Home</Link>
      </div>

      {/* Sugestões rápidas (apenas quando não há termo) */}
      {!term && (
        <div className="mt-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => router.replace(`/buscar?q=${encodeURIComponent(s)}`)}
                className="snap-start whitespace-nowrap rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        {/* Mobile: grid 2 colunas para varredura rápida */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {items.map(p => (
            <ProductCard key={String(p.id)} product={p as Product} />
          ))}
        </div>

        {/* Tablet/desktop: mantém o grid tradicional */}
        <div className="hidden sm:block">
          <ProductGrid products={items as Product[]} />
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="mt-6 rounded-2xl border border-zinc-200 p-4 bg-white">
          <p className="text-zinc-700">Não encontramos resultados para <strong>"{term}"</strong>.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.slice(0, 5).map(s => (
              <button
                key={s}
                onClick={() => router.replace(`/buscar?q=${encodeURIComponent(s)}`)}
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
              >
                {s}
              </button>
            ))}
            <Link href="/ofertas" className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50">Ver ofertas</Link>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 text-sm text-zinc-500">
          {items.length} {items.length === 1 ? 'produto' : 'produtos'} encontrados
        </div>
      )}
    </main>
  );
}
