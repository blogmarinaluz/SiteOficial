// src/app/mais-buscados/page.tsx
'use client';

import Link from 'next/link';
import productsData from '@/data/products.json';
import ProductCard, { Product } from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 60;

const toNumber = (v: any) =>
  typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^\d.-]/g, ''));

export default function MaisBuscadosPage() {
  const all = productsData as unknown as Product[];

  // Heurística simples para "mais buscados": ordena pelos mais caros
  // (tende a ser o que a galera procura) e pega os 12 primeiros.
  const list = all
    .slice()
    .sort((a, b) => toNumber(b.price) - toNumber(a.price))
    .slice(0, 12);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Mais buscados</h1>
        <Link href="/" className="text-sm text-emerald-700 hover:underline">Home</Link>
      </div>

      {list.length === 0 ? (
        <p className="mt-6 text-zinc-600">Nenhum produto encontrado.</p>
      ) : (
        <div className="mt-6">
          {/* Mobile: grid 2 colunas para varredura rápida */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {list.map((p) => (
              <ProductCard key={String(p.id)} product={p} />
            ))}
          </div>

          {/* Tablet/desktop: mantém o grid tradicional */}
          <div className="hidden sm:block">
            <ProductGrid products={list} />
          </div>
        </div>
      )}
    </main>
  );
}
