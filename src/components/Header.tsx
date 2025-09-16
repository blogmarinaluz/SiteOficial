"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search as SearchIcon,
  LogIn,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";

/* Tipos do catálogo */
type Product = {
  id: string;
  name: string;
  brand?: string;
  model_key?: string;
  image?: string;
  price: number;
};

const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();

/* Remove “128 GB” etc. do nome para agrupar modelos */
const stripStorage = (name: string) =>
  name.replace(/\b(\d{2,4})\s?gb\b/gi, "").trim();

export default function Header() {
  const router = useRouter();
  const sp = useSearchParams();
  const { items = [] }: any = useCart() ?? { items: [] };
  const cartQty = useMemo(
    () => items.reduce((acc: number, it: any) => acc + (it.qty ?? it.quantity ?? 1), 0),
    [items]
  );

  /* ----- Busca ----- */
  const [query, setQuery] = useState(() => sp.get("q") || "");
  function doSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const q = query.trim();
    router.push(`/buscar${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  /* ----- Menus dinâmicos a partir do products.json ----- */
  const catalog = products as Product[];

  function uniqueByModel(list: Product[]) {
    const map = new Map<string, Product>();
    for (const p of list) {
      const key = norm(p.model_key || stripStorage(p.name));
      if (!map.has(key)) map.set(key, p);
    }
    return Array.from(map.values());
  }

  const menuApple = useMemo(() => {
    const apple = catalog.filter(
      (p) => /iphone|apple/i.test(p.name) || /apple/i.test(p.brand || "")
    );
    return uniqueByModel(apple).slice(0, 12);
  }, [catalog]);

  const menuSamsung = useMemo(() => {
    const sams = catalog.filter(
      (p) =>
        /samsung|galaxy/i.test(p.name) || /samsung/i.test(p.brand || "")
    );
    return uniqueByModel(sams).slice(0, 12);
  }, [catalog]);

  /* ----- Controle de dropdown com atraso para evitar “sumir rápido” ----- */
  const [open, setOpen] = useState<null | "apple" | "samsung">(null);
  const closeTimer = useRef<any>(null);

  const openMenu = (k: "apple" | "samsung") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(k);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  return (
    /* isolate + z garantem que o header e os menus fiquem acima das imagens */
    <header className="relative z-[80] isolate w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      {/* Barra superior fina */}
      <div className="hidden md:block text-[11px] text-zinc-600 bg-zinc-50">
        <div className="container py-1.5">
          Especialista em celulares novos com garantia!
        </div>
      </div>

      {/* Linha principal */}
      <div className="container flex items-center gap-3 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 font-extrabold text-2xl tracking-tight">
          <span className="text-zinc-900">pro</span>
          <span className="text-emerald-700">Store</span>
        </Link>

        {/* Busca */}
        <form onSubmit={doSearch} className="flex-1 relative hidden sm:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por modelo, cor, armazenamento..."
            className="w-full rounded-full border border-zinc-200 pl-4 pr-[96px] py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2"
            aria-label="Buscar"
          >
            <SearchIcon className="h-4 w-4" />
            Buscar
          </button>
        </form>

        {/* Ações */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            <LogIn className="h-4 w-4 text-emerald-700" />
            Entrar
          </Link>

          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            <span className="relative">
              <ShoppingCart className="h-4 w-4 text-emerald-700" />
              {cartQty > 0 && (
                <span className="absolute -right-1.5 -top-1.5 inline-flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] h-4 min-w-[16px] px-1">
                  {cartQty}
                </span>
              )}
            </span>
            Carrinho
          </Link>

          <Link
            href="/analise-boleto"
            className="hidden sm:inline-flex rounded-full bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 text-sm font-medium"
          >
            Análise de Boleto
          </Link>

          <Link
            href="/checkout"
            className="hidden sm:inline-flex text-sm text-zinc-700 hover:text-zinc-900"
          >
            Checkout
          </Link>
        </div>
      </div>

      {/* Navegação */}
      <nav className="container -mt-1 mb-2">
        <ul className="flex flex-wrap items-center gap-2 text-[13px] text-zinc-700">
          {/* iPhone */}
          <li
            className="relative"
            onMouseEnter={() => openMenu("apple")}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-zinc-100 ${
                open === "apple" ? "bg-zinc-100" : ""
              }`}
              aria-haspopup="menu"
              aria-expanded={open === "apple"}
            >
              iPhone <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {/* Dropdown */}
            <div
              role="menu"
              className={`absolute left-0 top-full mt-2 w-[320px] rounded-xl border bg-white shadow-lg p-2 transition
                          ${open === "apple" ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}
                          z-[90]`}
              onMouseEnter={() => openMenu("apple")}
              onMouseLeave={scheduleClose}
            >
              {menuApple.length ? (
                menuApple.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produto/${idNoExt(p.id)}`}
                    className="block rounded-md px-2 py-1.5 hover:bg-zinc-50"
                  >
                    {p.name}
                  </Link>
                ))
              ) : (
                <span className="block px-2 py-1.5 text-sm text-zinc-500">
                  Em breve
                </span>
              )}
            </div>
          </li>

          {/* Samsung */}
          <li
            className="relative"
            onMouseEnter={() => openMenu("samsung")}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-zinc-100 ${
                open === "samsung" ? "bg-zinc-100" : ""
              }`}
              aria-haspopup="menu"
              aria-expanded={open === "samsung"}
            >
              Samsung <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {/* Dropdown */}
            <div
              role="menu"
              className={`absolute left-0 top-full mt-2 w-[320px] rounded-xl border bg-white shadow-lg p-2 transition
                          ${open === "samsung" ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}
                          z-[90]`}
              onMouseEnter={() => openMenu("samsung")}
              onMouseLeave={scheduleClose}
            >
              {menuSamsung.length ? (
                menuSamsung.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produto/${idNoExt(p.id)}`}
                    className="block rounded-md px-2 py-1.5 hover:bg-zinc-50"
                  >
                    {p.name}
                  </Link>
                ))
              ) : (
                <span className="block px-2 py-1.5 text-sm text-zinc-500">
                  Em breve
                </span>
              )}
            </div>
          </li>

          {/* Demais links */}
          <li>
            <Link href="/mais-buscados" className="inline-flex rounded-md px-2 py-1 hover:bg-zinc-100">
              Mais buscados
            </Link>
          </li>
          <li>
            <Link href="/bbb-do-dia" className="inline-flex rounded-md px-2 py-1 hover:bg-zinc-100">
              BBB do dia
            </Link>
          </li>
          <li>
            <Link href="/ofertas" className="inline-flex rounded-md px-2 py-1 hover:bg-zinc-100">
              Ofertas em destaque
            </Link>
          </li>
        </ul>
      </nav>

      {/* Busca mobile */}
      <div className="container pb-3 sm:hidden">
        <form onSubmit={doSearch} className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por modelo, cor, armazenamento..."
            className="w-full rounded-full border border-zinc-200 pl-4 pr-[76px] py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-2"
            aria-label="Buscar"
          >
            <SearchIcon className="h-4 w-4" />
            Buscar
          </button>
        </form>
      </div>
    </header>
  );
}
