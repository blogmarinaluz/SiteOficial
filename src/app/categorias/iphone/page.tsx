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
  color?: string;
  storage?: string;
  [key: string]: any;
};

const catalog: Product[] = (productsData as Product[]) ?? [];

// Famílias oficiais (sem "Outros")
const FAMILIES = ["iPhone", "Plus", "Pro", "Pro Max", "SE"] as const;
type Family = typeof FAMILIES[number];

const PRICE_ASC = "price-asc";
const PRICE_DESC = "price-desc";
const NAME_ASC = "name-asc";

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function familyOf(name: string): Family {
  const n = norm(name);
  if (n.includes("pro max")) return "Pro Max";
  if (n.includes("pro")) return "Pro";
  if (n.includes("plus")) return "Plus";
  if (n.includes("se")) return "SE";
  return "iPhone"; // padrão
}

function storageOf(p: Product): string {
  const explicit = String(p.storage ?? "").toUpperCase();
  if (/\b(64|128|256|512)\s?GB\b/.test(explicit) || /\b(1|2)\s?TB\b/.test(explicit)) return explicit;
  const n = String(p.name || "").toUpperCase();
  const m = n.match(/\b(64|128|256|512)\s?GB\b|\b(1|2)\s?TB\b/);
  return m ? m[0].replace(/\s+/g, " ") : "";
}

function colorOf(p: Product): string {
  const explicit = String(p.color ?? "");
  if (explicit) return explicit;
  const n = norm(p.name);
  const colors = [
    "preto","black","meia-noite","midnight","grafite","graphite","cinza","starlight",
    "branco","white","prata","silver","dourado","gold","rosa","pink",
    "roxo","purple","verde","green","azul","blue","amarelo","yellow","vermelho","red","titanium","titânio",
    "ultramarino","ultramarine","estelar","natural","deserto","acinzentado"
  ];
  for (const c of colors) if (n.includes(c)) return capitalize(c.replace("-", " "));
  return "";
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function IphoneCategoryPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<string>(NAME_ASC);
  const [fam, setFam] = useState<Family | "all">("all");
  const [gb, setGb] = useState<string>("all");
  const [col, setCol] = useState<string>("all");
  const [open, setOpen] = useState(false); // bottom sheet

  const iphones = useMemo(() => {
    return catalog.filter((p) => {
      const b = norm(p.brand);
      const n = norm(p.name);
      return b.includes("apple") || b.includes("iphone") || n.includes("iphone");
    });
  }, []);

  const { storages, colors } = useMemo(() => {
    const ss = new Set<string>();
    const cs = new Set<string>();
    for (const p of iphones) {
      const s = storageOf(p);
      if (s) ss.add(s);
      const c = colorOf(p);
      if (c) cs.add(c);
    }
    const storages = Array.from(ss).sort((a,b) => {
      const aN = Number(a.replace(/\D/g, "")); const bN = Number(b.replace(/\D/g, ""));
      return aN - bN;
    });
    const colors = Array.from(cs).sort((a,b) => a.localeCompare(b));
    return { storages, colors };
  }, [iphones]);

  const filtered = useMemo(() => {
    let arr = iphones.filter((p) => {
      const name = norm(p.name);
      const passQ = !q || name.includes(norm(q));
      const passFam = fam === "all" || familyOf(p.name) === fam;
      const passGb = gb === "all" || storageOf(p) === gb;
      const passCol = col === "all" || colorOf(p).toLowerCase() === norm(col);
      return passQ && passFam && passGb && passCol;
    });
    if (sort === PRICE_ASC) arr.sort((a, b) => (Number(a.price ?? 0) - Number(b.price ?? 0)));
    else if (sort === PRICE_DESC) arr.sort((a, b) => (Number(b.price ?? 0) - Number(a.price ?? 0)));
    else arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return arr;
  }, [iphones, q, fam, gb, col, sort]);

  // Agrupamento por família só quando "Todos"
  const grouped = useMemo(() => {
    if (fam !== "all") return [["", filtered] as const];
    const map = new Map<Family, Product[]>();
    for (const f of FAMILIES) map.set(f, []);
    for (const p of filtered) map.get(familyOf(p.name))!.push(p);
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [filtered, fam]);

  const total = filtered.length;

  function clearAll() {
    setFam("all"); setGb("all"); setCol("all"); setQ("");
  }

  return (
    <main className="container px-5 sm:px-6 py-8 sm:py-10">
      <header className="mb-5 sm:mb-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categorias</p>

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900">iPhone</h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800"
            >
              Filtros
            </button>
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

        {/* status compacto */}
        <div className="mt-2 text-sm text-zinc-600">
          {total} {total === 1 ? "modelo" : "modelos"} •
          {" "}{fam === "all" ? "Todos os modelos" : `Modelo: ${fam}`}
          {gb !== "all" && ` • ${gb}`}
          {col !== "all" && ` • ${capitalize(col)}`}
          {(fam !== "all" || gb !== "all" || col !== "all" || q) && (
            <button onClick={clearAll} className="ml-2 underline underline-offset-2">Limpar</button>
          )}
        </div>
      </header>

      {/* Listagens */}
      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
          Não encontramos modelos com os filtros aplicados. Ajuste os filtros ou fale com nosso
          <Link href="/contato" className="ml-1 underline underline-offset-2">atendimento</Link>.
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([famLabel, list]) => (
            <section key={famLabel || "lista"} className="scroll-mt-20">
              {fam === "all" && (
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-zinc-900">{famLabel}</h2>
                  <div className="text-sm text-zinc-500">{list.length} {list.length === 1 ? "item" : "itens"}</div>
                </div>
              )}

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

      {/* Bottom sheet de filtros */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-zinc-200 bg-white p-4 shadow-2xl sm:left-1/2 sm:bottom-auto sm:top-1/2 sm:w-[560px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
          >
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-900">Filtros</h3>
              <button onClick={() => setOpen(false)} className="rounded-xl px-3 py-1.5 text-sm hover:bg-zinc-100">Fechar</button>
            </header>

            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">Buscar</label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ex.: 15 Pro 256 GB Titânio Azul"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Select
                  label="Modelo"
                  value={fam}
                  onChange={(v) => setFam(v as any)}
                  options={[{ value: "all", label: "Todos" }, ...FAMILIES.map((f) => ({ value: f, label: f }))]}
                />
                <Select
                  label="Capacidade"
                  value={gb}
                  onChange={setGb}
                  options={[{ value: "all", label: "Todas" }, ...storages.map((s) => ({ value: s, label: s }))]}
                />
                <Select
                  label="Cor"
                  value={col}
                  onChange={setCol}
                  options={[{ value: "all", label: "Todas" }, ...colors.map((c) => ({ value: c, label: c }))]}
                />
              </div>
            </div>

            <footer className="mt-4 flex items-center justify-between gap-2">
              <button
                className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800"
                onClick={clearAll}
              >
                Limpar tudo
              </button>
              <button
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                onClick={() => setOpen(false)}
              >
                Ver {total} {total === 1 ? "modelo" : "modelos"}
              </button>
            </footer>
          </div>
        </>
      )}
    </main>
  );
}

/* ---------------------- UI: Select minimalista ---------------------- */
function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T | "all";
  onChange: (v: T | "all") => void;
  options: { value: T | "all"; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
