// src/app/categorias/iphone/page.tsx
"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import productsData from "@/data/products.json";

export const metadata: Metadata = {
  title: "iPhone | proStore",
  description: "Compre iPhone com garantia e Nota Fiscal. Veja modelos disponíveis por nome e variações.",
};

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
  const n = name.toLowerCase();
  if (n.includes("pro max")) return "Pro Max";
  if (n.includes("pro")) return "Pro";
  if (n.includes("plus")) return "Plus";
  if (n.includes("se")) return "SE";
  return "Outros";
}

const PRICE_ASC = "price-asc";
const PRICE_DESC = "price-desc";
const NAME_ASC = "name-asc";

function idNoExt(id: string) {
  return String(id || "").split(".")[0];
}

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
    <main className="container px-5 sm:px-6 py-10">
      <header className="mb-6 sm:mb-8">
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
            <button
              type="button"
              onClick={() => setQ("")}
              className="rounded-xl px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
              aria-label="Limpar busca"
            >
              Limpar
            </button>
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
            <section key={fam}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-900">{fam}</h2>
                <div className="text-sm text-zinc-500">{list.length} {list.length === 1 ? "item" : "itens"}</div>
              </div>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((p) => (
                  <li key={p.id}>
                    <Card product={p} />
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

function Card({ product }: { product: Product }) {
  const img = product.image || product.images?.[0];
  const price = Number(product.price ?? 0);
  const hasPrice = !Number.isNaN(price) && price > 0;

  return (
    <Link
      href={`/produto/${idNoExt(String(product.id))}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-sm"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-50">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-zinc-400">Sem imagem</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-medium text-zinc-900">{product.name}</h3>
        <div className="mt-1 text-[13px] text-zinc-600">Apple iPhone</div>
        <div className="mt-2 flex items-center justify-between">
          {hasPrice ? (
            <span className="text-sm font-semibold text-zinc-900">
              {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          ) : (
            <span className="text-sm font-medium text-zinc-500">Consultar</span>
          )}
          <span className="rounded-md bg-emerald-600/10 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            NF‑e & Garantia
          </span>
        </div>
      </div>
    </Link>
  );
}
