// src/app/ofertas/page.tsx
'use client';

import Link from 'next/link';
import products from '@/data/products.json';
import ProductCard, { Product } from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const BRANDS = ['Apple', 'Samsung', 'Motorola', 'Xiaomi'];

function useQuery() {
  const sp = useSearchParams();
  const router = useRouter();

  const set = (key: string, value: string | null) => {
    const params = new URLSearchParams(sp?.toString() ?? '');
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`/ofertas?${params.toString()}`);
  };

  return { get: (k: string) => sp?.get(k) ?? null, set };
}

export default function OfertasPage() {
  const { get, set } = useQuery();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const marca = get('marca');
  const ordem = get('ordem'); // 'preco-asc' | 'preco-desc' | 'mais-vendidos' (placeholder)

  const items = useMemo(() => {
    let arr = (products as Product[]).slice();

    if (marca) {
      const m = marca.toLowerCase();
      arr = arr.filter(p => (p.brand || '').toLowerCase().includes(m));
    }

    if (ordem === 'preco-asc') {
      arr.sort((a,b) => (a.price||0) - (b.price||0));
    } else if (ordem === 'preco-desc') {
      arr.sort((a,b) => (b.price||0) - (a.price||0));
    }

    return arr;
  }, [marca, ordem]);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Ofertas</h1>
        <Link href="/" className="text-sm text-emerald-700 hover:underline">Home</Link>
      </div>

      {/* Filtros rápidos (mobile-first) */}
      <div className="mt-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {BRANDS.map(b => {
            const isActive = (marca || '').toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                onClick={() => set('marca', isActive ? null : b)}
                className={`snap-start whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${isActive ? 'bg-emerald-600 text-white border-emerald-600' : 'hover:bg-zinc-50'}`}
              >
                {b}
              </button>
            );
          })}

          {/* Ordenação simples */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => set('ordem', ordem === 'preco-asc' ? null : 'preco-asc')}
              className={`rounded-full border px-3 py-1.5 text-sm ${ordem === 'preco-asc' ? 'bg-zinc-900 text-white border-zinc-900' : 'hover:bg-zinc-50'}`}
            >
              Menor preço
            </button>
            <button
              onClick={() => set('ordem', ordem === 'preco-desc' ? null : 'preco-desc')}
              className={`rounded-full border px-3 py-1.5 text-sm ${ordem === 'preco-desc' ? 'bg-zinc-900 text-white border-zinc-900' : 'hover:bg-zinc-50'}`}
            >
              Maior preço
            </button>
          </div>
        </div>
      </div>

      {/* Lista: no mobile usamos grid 2 colunas (scroll vertical), no desktop o grid tradicional */}
      <div className="mt-4">
        {/* Mobile: grid 2 colunas (em vez de carrossel) para navegação rápida */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {items.map(p => (
            <ProductCard key={String(p.id)} product={p as Product} />
          ))}
        </div>

        {/* Tablet/desktop: mantém o grid já conhecido */}
        <div className="hidden sm:block">
          <ProductGrid products={items as Product[]} className="" />
        </div>
      </div>

      {/* Rodapé de resultados */}
      {ready && (
        <div className="mt-6 text-sm text-zinc-500">
          {items.length} {items.length === 1 ? 'produto' : 'produtos'} encontrados
          {marca ? <> • Marca: <strong>{marca}</strong></> : null}
          {ordem ? <> • Ordenação: <strong>{ordem}</strong></> : null}
        </div>
      )}
    </main>
  );
}
