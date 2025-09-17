// src/app/mais-buscados/page.tsx
"use client";

import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import productsData from "@/data/products.json";

type P = any;

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const isBrand = (p: P, target: "apple" | "samsung") => {
  const b = norm(p?.brand);
  const n = norm(`${p?.brand} ${p?.name}`);
  return b === target || n.includes(target);
};

// Escore simples para destacar preço baixo e títulos curtos
const score = (p: P) => {
  const price = Number(p?.price || 0);
  const len = String(p?.name || "").length;
  return price * 0.9 + len * 10;
};

const pickTop = (arr: P[], n: number) => [...arr].sort((a, b) => score(a) - score(b)).slice(0, n);

function interleave<A>(a: A[], b: A[]) {
  const res: A[] = [];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i]) res.push(a[i]);
    if (b[i]) res.push(b[i]);
  }
  return res;
}

export default function MaisBuscadosPage() {
  const all: P[] = (productsData as any[]) || [];
  const samsungs = pickTop(all.filter((p) => isBrand(p, "samsung")), 8);
  const apples = pickTop(all.filter((p) => isBrand(p, "apple")), 8);
  const list = interleave(samsungs, apples).slice(0, 16);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Celulares em Oferta</h1>
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
