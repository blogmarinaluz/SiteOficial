// src/app/ofertas/page.tsx
"use client";

import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import products from "@/data/products.json";

type P = any;

export default function OfertasPage() {
  const all: P[] = (products as any[]) || [];

  // Ofertas = itens com preço atual menor que o antigo;
  // se não houver, mostra os mais baratos.
  const withDiscount = all.filter((p) => Number(p?.oldPrice || 0) > Number(p?.price || 0));
  const list = (withDiscount.length > 0 ? withDiscount : all)
    .slice(0)
    .sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0))
    .slice(0, 24);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Ofertas</h1>
        <Link
          href="/"
          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Voltar para a Home
        </Link>
      </div>

      <div className="mt-5">
        <ProductGrid products={list as any[]} />
      </div>
    </main>
  );
}
