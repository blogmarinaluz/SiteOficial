// src/app/categorias/samsung/page.tsx
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

/** Famílias Galaxy visíveis (FE faz parte de Galaxy S) */
const FAMILIES = [
  "S Ultra",
  "S Plus",
  "S",
  "Z Fold",
  "Z Flip",
  "A",
  "Note",
] as const;
type Family = typeof FAMILIES[number];

const PRICE_ASC = "price-asc";
const PRICE_DESC = "price-desc";
const NAME_ASC = "name-asc";

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function isSamsung(p: Product) {
  const b = norm(p.brand);
  const n = norm(p.name);
  return b.includes("samsung") || n.includes("galaxy") || n.includes("samsung");
}

function familyOf(name: string): Family {
  const n = norm(name);
  if (/\bz\s?fold\b/.test(n)) return "Z Fold";
  if (/\bz\s?flip\b/.test(n)) return "Z Flip";
  // FE deve agrupar em Galaxy S
  if (/\bfe\b/.test(n)) return "S";
  if (/\bs\s?ultra\b/.test(n)) return "S Ultra";
  if (/\bs\s?plus\b/.test(n)) return "S Plus";
  if (/\bnote\b/.test(n)) return "Note";
  if (/\bs\b\d*/.test(n) || /\bgalaxy s\b/.test(n)) return "S";
  return "A";
}

function familyLabel(f: Family) {
  switch (f) {
    case "S Ultra": return "Galaxy S Ultra";
    case "S Plus": return "Galaxy S Plus";
    case "S": return "Galaxy S";
    case "Z Fold": return "Galaxy Z Fold";
    case "Z Flip": return "Galaxy Z Flip";
    case "A": return "Galaxy A";
    case "Note": return "Galaxy Note";
  }
}

function storageOf(p: Product): string {
  const explicit = String(p.storage ?? "").toUpperCase();
  if (/\b(64|128|256|512)\s?GB\b/.test(explicit) || /\b(1|2)\s?TB\b/.test(explicit)) return explicit;
  const n = String(p.name || "").toUpperCase();
  const m = n.match(/\b(64|128|256|512)\s?GB\b|\b(1|2)\s?TB\b/);
  return m ? m[0].replace(/\s+/g, " ") : "";
}

/** Cores comuns da linha Galaxy */
function colorOf(p: Product): string {
  const explicit = String(p.color ?? "");
  if (explicit) return explicit;
  const n = norm(p.name);

  const pairs: [RegExp, string][] = [
    [/\bphantom black\b/, "Phantom Black"],
    [/\bphantom white\b/, "Phantom White"],
    [/\bphantom silver\b/, "Phantom Silver"],
    [/\bgraphite\b/, "Graphite"],
    [/\blavender\b|\blilas\b/, "Lavender"],
    [/\bcream\b|\bcreme\b/, "Cream"],
    [/\bblue\b|\bazul\b/, "Blue"],
    [/\bgreen\b|\bverde\b/, "Green"],
    [/\bgray\b|\bcinza\b/, "Gray"],
    [/\bviolet\b|\broxo\b/, "Violet"],
    [/\bred\b|\bvermelh[oa]\b/, "Red"],
    [/\bgold\b|\bdourad[oa]\b/, "Gold"],
    [/\bwhite\b|\bbranc[oa]\b/, "White"],
    [/\bblack\b|\bpreto\b/, "Black"],
    [/\bsilver\b|\bprata\b/, "Silver"],
    [/\btitanium\b|\btit[âa]nio\b/, "Titanium"],
    [/\bnature\b|\bnatural\b/, "Natural"],
  ];
  for (const [re, label] of pairs) if (re.test(n)) return label;
  return "";
}

export default function SamsungCategoryPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<string>(NAME_ASC);
  const [fam, setFam] = useState<Family | "all">("all");
  const [gb, setGb] = useState<string>("all");
  const [col, setCol] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const samsungs = useMemo(() => catalog.filter(isSamsung), []);

  const { storages, colors } = useMemo(() => {
    const ss = new Set<string>();
    const cs = new Set<string>();
    for (const p of samsungs) {
      const s = storageOf(p); if (s) ss.add(s);
      const c = colorOf(p);   if (c) cs.add(c);
    }
    const storages = Array.from(ss).sort((a,b) => Number(a.replace(/\D/g,"")) - Number(b.replace(/\D/g,"")));
    const colors = Array.from(cs).sort((a,b) => a.localeCompare(b));
    return { storages, colors };
  }, [samsungs]);

  const filtered = useMemo(() => {
    let arr = samsungs.filter((p) => {
      const name = norm(p.name);
      const passQ = !q || name.includes(norm(q));
      const passFam = fam === "all" || familyOf(p.name) === fam;
      const passGb = gb === "all" || storageOf(p) === gb;
      const passCol = col === "all" || norm(colorOf(p)) === norm(col);
      return passQ && passFam && passGb && passCol;
    });
    if (sort === PRICE_ASC) arr.sort((a,b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    else if (sort === PRICE_DESC) arr.sort((a,b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    else arr.sort((a,b) => String(a.name).localeCompare(String(b.name)));
    return arr;
  }, [samsungs, q, fam, gb, col, sort]);

  const grouped = useMemo(() => {
    if (fam !== "all") return [["", filtered] as const];
    const map = new Map<Family, Product[]>();
    for (const f of FAMILIES) map.set(f, []);
    for (const p of filtered) map.get(familyOf(p.name))!.push(p);
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [filtered, fam]);

  const total = filtered.length;

  function clearAll() { setFam("all"); setGb("all"); setCol("all"); setQ(""); }

  return (
    <main className="container px-5 sm:px-6 py-8 sm:py-10">
      <header className="mb-5 sm:mb-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Categorias</p>

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900">Samsung Galaxy</h1>

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

        <div className="mt-2 text-sm text-zinc-600">
          {total} {total === 1 ? "modelo" : "modelos"} •
          {" "}{fam === "all" ? "Todas as linhas" : `Linha: ${familyLabel(fam)}`}
          {gb !== "all" && ` • ${gb}`}
          {col !== "all" && ` • ${col}`}
          {(fam !== "all" || gb !== "all" || col !== "all" || q) && (
            <button onClick={clearAll} className="ml-2 underline underline-offset-2">Limpar</button>
          )}
        </div>
      </header>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
          Não encontramos modelos com os filtros aplicados. Ajuste os filtros ou fale com nosso
          <Link href="/contato" className="ml-1 underline underline-offset-2">atendimento</Link>.
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(([famKey, list]) => (
            <section key={famKey || "lista"} className="scroll-mt-20">
              {fam === "all" && (
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-zinc-900">{familyLabel(famKey as Family)}</h2>
                  <div className="text-sm text-zinc-500">{list.length} {list.length === 1 ? "item" : "itens"}</div>
                </div>
              )}

              {/* Mobile: carrossel; Desktop: grid */}
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

      {/* Bottom sheet */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
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
                  placeholder="Ex.: S24 Ultra 512 GB Graphite"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Select
                  label="Linha"
                  value={fam}
                  onChange={(v) => setFam(v as any)}
                  options={[{ value: "all", label: "Todas" }, ...FAMILIES.map((f) => ({ value: f, label: familyLabel(f) }))]}
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
              <button className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800" onClick={clearAll}>
                Limpar tudo
              </button>
              <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={() => setOpen(false)}>
                Ver {total} {total === 1 ? "modelo" : "modelos"}
              </button>
            </footer>
          </div>
        </>
      )}
    </main>
  );
}

/* UI: Select */
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
