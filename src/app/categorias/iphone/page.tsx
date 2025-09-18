// src/app/categorias/iphone/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import productsData from "@/data/products.json";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  brand?: string;
  price?: number;
  images?: string[];
  image?: string;
  [key: string]: any;
};

const catalog: Product[] = (productsData as Product[]) ?? [];

const families = ["Pro Max", "Pro", "Plus", "SE"];

/** Extrai a família do iPhone a partir do nome */
function familyOf(name: string) {
  const n = String(name || "").toLowerCase();
  if (n.includes("pro max")) return "Pro Max";
  if (n.includes("pro")) return "Pro";
  if (n.includes("plus")) return "Plus";
  if (n.includes("se")) return "SE";
  return "Outros";
}

const PRICE_ASC = "price-asc";
const PRICE_DESC = "price-desc";
const NAME_ASC = "name-asc";

function norm(v: unknown) {
  return String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function IphoneCategoryPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<string>(NAME_ASC);

  const items = useMemo(() => {
    // Filtro por marca/nome com fallback para "apple/iphone"
    const base = catalog.filter((p) => {
      const b = norm(p.brand);
      const n = norm(p.name);
      const isIphone = b.includes("apple") || b.includes("iphone") || n.includes("iphone");
      if (!isIphone) return false;
      if (!q) return true;
      const qq = norm(q);
      return n.includes(qq);
    });

    // Ordenação
    const arr = [...base];
    if (sort === PRICE_ASC) arr.sort((a, b) => (Number(a.price ?? 0) - Number(b.price ?? 0)));
    else if (sort === PRICE_DESC) arr.sort((a, b) => (Number(b.price ?? 0) - Number(a.price ?? 0)));
    else arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));

    return arr;
  }, [q, sort]);

  // Agrupamento por família (Pro Max, Pro, Plus, SE, Outros)
  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const p of items) {
      const fam = familyOf(String(p.name || ""));
      (map[fam] ??= []).push(p);
    }
    // mantém ordem conhecida das famílias
    const ordered: [string, Product[]][] = [];
    for (const f of [...families, "Outros"]) {
      if (map[f]?.length) ordered.push([f, map[f]]);
    }
    return ordered;
  }, [items]);

  return (
    <main className="container px-5 sm:px-6 py-8 sm:py-10">
      <header className="mb-5 sm:mb-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categorias</p>

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900">iPhone</h1>

          <div className="flex items-center gap-2">
            <div className="hidden text-sm text-zinc-600 sm:block">
              {items.length} {items.length === 1 ? "modelo" : "modelos"}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800"
              aria-label="Ordenar"
            >
              <option value={NAME_ASC}>Ordenar: Nome (A–Z)</option>
              <option value={PRICE_ASC}>Preço (menor → maior)</option>
              <option value={PRICE_DESC}>Preço (maior → menor)</option>
            </select>
          </div>
        </div>

        <div className="mt-3 max-w-lg">
          <label htmlFor="q" className="sr-only">Buscar iPhone</label>
          <div className="flex items-center rounded-2xl border border-zinc-300 bg-white/60 p-1.5">
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por modelo, cor, capacidade..."
              className="flex-1 bg-transparent px-2 text-sm text-zinc-800 placeholder:text-zinc-500 focus:outline-none"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="rounded-xl px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
                aria-label="Limpar busca"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </header>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
          Não encontramos modelos de iPhone para os filtros aplicados. Tente remover a busca ou fale com nosso
          <Link href="/contato" className="ml-1 underline underline-offset-2">atendimento</Link>.
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([fam, list]) => (
            <section key={fam} className="scroll-mt-20">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-900">{fam}</h2>
                <div className="text-sm text-zinc-500">{list.length} {list.length === 1 ? "item" : "itens"}</div>
              </div>

              {/* Mobile: carrossel horizontal; Desktop: grid */}
              <div className="lg:hidden">
                <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1.5">
                  {list.map((p) => (
                    <li key={p.id} className="min-w-[85%] snap-center sm:min-w-[360px]">
                      <ProductCard product={p as any} />
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="hidden grid-cols-3 gap-4 lg:grid xl:grid-cols-4">
                {list.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p as any} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
