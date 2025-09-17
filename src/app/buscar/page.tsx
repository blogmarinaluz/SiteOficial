// src/app/buscar/page.tsx
"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import products from "@/data/products.json";

type P = any;

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const matches = (p: P, q: string) => {
  const n = norm(q);
  if (!n) return true;
  const hay =
    norm(p?.name) +
    " " +
    norm(p?.brand) +
    " " +
    norm(p?.model) +
    " " +
    norm(p?.color);
  return hay.includes(n);
};

export default function BuscarPage() {
  const sp = useSearchParams();
  const q = sp.get("q") || "";
  const brand = sp.get("marca") || sp.get("brand") || "";

  const list = useMemo(() => {
    let arr: P[] = (products as any[]) || [];
    if (brand) {
      const b = norm(brand);
      arr = arr.filter((p) => norm(p?.brand) === b);
    }
    if (q) {
      arr = arr.filter((p) => matches(p, q));
    }
    // ordena por preço crescente para facilitar compra
    arr = [...arr].sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    return arr;
  }, [q, brand]);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Resultados da busca</h1>
          <p className="text-sm text-neutral-600">
            {q ? (
              <>
                Termo: <span className="font-semibold">{q}</span>
                {brand ? (
                  <> • Marca: <span className="font-semibold">{brand}</span></>
                ) : null}
              </>
            ) : brand ? (
              <>
                Marca: <span className="font-semibold">{brand}</span>
              </>
            ) : (
              <>Todos os produtos</>
            )}
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Voltar para a Home
        </Link>
      </div>

      {list.length > 0 ? (
        <div className="mt-5">
          <ProductGrid products={list as any[]} />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="font-semibold">Não encontramos resultados.</p>
          <p className="mt-1 text-sm text-neutral-600">
            Tente buscar por outro termo ou visite as categorias:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Apple", "Samsung", "Motorola"].map((m) => (
              <Link
                key={m}
                href={`/buscar?marca=${encodeURIComponent(m)}`}
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
