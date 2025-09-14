"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, User, ChevronDown, Search } from "lucide-react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";

/** Capitaliza marca (apple → Apple, samsung → Samsung) */
function capBrand(b?: string) {
  const m = String(b || "").toLowerCase();
  if (m === "apple") return "Apple";
  if (m === "samsung") return "Samsung";
  return m.replace(/^\w/, (c) => c.toUpperCase());
}
/** title case simples: "iphone 14 plus" → "iPhone 14 Plus" */
function titleCase(s: string) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) =>
      /^(e|de|da|do|dos|das)$/.test(w) ? w : w.replace(/^\w/, (c) => c.toUpperCase())
    )
    .join(" ");
}
/** nome-base sem GB/cor (ex.: "iphone 14 plus") */
function baseModel(p: any) {
  if (p.model_base) return String(p.model_base);
  if (p.model_key) return String(p.model_key).replace(/_/g, " ");
  let s = String(p.name || "");
  s = s.replace(/\b(64|128|256|512|1024|1tb)\s*gb?\b/gi, "");
  s = s.replace(/\s-\s.*$/g, "");
  return s.trim() || "Modelo";
}
/** chave p/ agrupar */
function modelKey(p: any) {
  return (p.model_key || baseModel(p)).toLowerCase().trim();
}
function uniqueModels(list: any[]) {
  const map = new Map<string, any>();
  for (const p of list) {
    const k = modelKey(p);
    if (!map.has(k)) map.set(k, p);
  }
  return Array.from(map.values());
}
/** “Apple iPhone 14” */
function prettyLabel(p: any) {
  return `${capBrand(p.brand)} ${titleCase(baseModel(p))}`.replace(/\s+/g, " ").trim();
}

export function Header() {
  const [q, setQ] = useState("");
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  const appleModels = useMemo(() => {
    const arr = (products as any[]).filter((p) => String(p.brand).toLowerCase() === "apple");
    return uniqueModels(arr).map((p) => ({ label: prettyLabel(p), q: modelKey(p) })).slice(0, 14);
  }, []);
  const samsungModels = useMemo(() => {
    const arr = (products as any[]).filter((p) => String(p.brand).toLowerCase() === "samsung");
    return uniqueModels(arr).map((p) => ({ label: prettyLabel(p), q: modelKey(p) })).slice(0, 14);
  }, []);

  // Dropdown estável (não some quando vai clicar)
  const [open, setOpen] = useState<null | "apple" | "samsung">(null);
  let timer: any;
  function onEnter(k: "apple" | "samsung") {
    clearTimeout(timer);
    setOpen(k);
  }
  function onLeave() {
    clearTimeout(timer);
    timer = setTimeout(() => setOpen(null), 140);
  }
  useEffect(() => () => clearTimeout(timer), []);

  return (
    <header className="header">
      <div className="container py-4 grid grid-cols-[auto,1fr,auto,auto] gap-4 items-center">
        {/* LOGO (alinhado com tudo) */}
        <Link href="/" className="text-2xl font-extrabold text-accent tracking-tight">
          proStore
        </Link>

        {/* BUSCA central realmente alinhada */}
        <form action="/buscar" className="flex">
          <div className="w-full flex items-center border border-zinc-300 rounded-2xl overflow-hidden">
            <Search className="w-5 h-5 ml-3 text-zinc-500" />
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busque iPhone, Galaxy..."
              className="w-full px-3 py-2 outline-none"
            />
            <button className="btn-primary rounded-none rounded-r-2xl px-4">Buscar</button>
          </div>
        </form>

        {/* MENU alinhado */}
        <nav className="hidden md:flex gap-6 justify-self-end">
          <div
            className="relative"
            onMouseEnter={() => onEnter("apple")}
            onMouseLeave={onLeave}
          >
            <button className="menu-link flex items-center gap-1">
              Apple <ChevronDown className="w-4 h-4" />
            </button>
            {open === "apple" && (
              <div
                className="absolute left-0 mt-2 bg-white border rounded-2xl shadow-lg p-3 w-[22rem] z-50"
                onMouseEnter={() => onEnter("apple")}
                onMouseLeave={onLeave}
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {appleModels.map((m) => (
                    <Link
                      key={m.q}
                      href={`/buscar?q=${encodeURIComponent(m.q)}`}
                      className="hover:text-accent"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => onEnter("samsung")}
            onMouseLeave={onLeave}
          >
            <button className="menu-link flex items-center gap-1">
              Samsung <ChevronDown className="w-4 h-4" />
            </button>
            {open === "samsung" && (
              <div
                className="absolute left-0 mt-2 bg-white border rounded-2xl shadow-lg p-3 w-[22rem] z-50"
                onMouseEnter={() => onEnter("samsung")}
                onMouseLeave={onLeave}
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {samsungModels.map((m) => (
                    <Link
                      key={m.q}
                      href={`/buscar?q=${encodeURIComponent(m.q)}`}
                      className="hover:text-accent"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link className="menu-link" href="/central-de-ajuda">
            Suporte
          </Link>
          <Link className="menu-link" href="/faq">
            FAQ
          </Link>
        </nav>

        {/* Ações (conta/carrinho) */}
        <div className="flex gap-2 justify-self-end">
          <Link className="btn-outline hidden sm:inline-flex" href="/minha-conta">
            <User className="w-5 h-5 mr-2" /> Minha Conta
          </Link>
          <Link className="btn-primary relative" href="/carrinho">
            <ShoppingCart className="w-5 h-5 mr-2" /> Carrinho
            {count > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] px-1 rounded-full bg-red-600 text-white text-[11px] grid place-items-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* BAR */}
      <div className="bg-accent text-white">
        <div className="container py-2 text-sm flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-white animate-ping" />
          <span>
            Cupom ativo: <b className="animate-pulse">30% OFF</b> aplicado no carrinho ·
            &nbsp;Boleto para negativados (análise de cadastro).
          </span>
        </div>
      </div>
    </header>
  );
}
