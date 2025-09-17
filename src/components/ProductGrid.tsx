// src/components/ProductGrid.tsx
"use client";

import { useMemo } from "react";
import ProductCard from "./ProductCard";
import productsData from "@/data/products.json";

type P = {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  price?: number;
  oldPrice?: number;
  freeShipping?: boolean;
  [key: string]: any;
};

type Props = {
  products?: P[];
  limit?: number;
};

export default function ProductGrid({ products, limit }: Props) {
  const list = useMemo(() => {
    const base: P[] = (products && products.length ? products : (productsData as any[])) as P[];
    const arr = [...base];
    // se houver limit, corta a lista
    if (typeof limit === "number" && limit > 0) return arr.slice(0, limit);
    return arr;
  }, [products, limit]);

  if (!list || list.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Nenhum produto disponível no momento.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => (
        <ProductCard key={String(p?.id)} product={p as any} />
      ))}
    </div>
  );
}
