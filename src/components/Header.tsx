// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ShoppingCart,
  Search,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";

/* ========= utils ========= */
function norm(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function cap(v: string) {
  return v?.[0]?.toUpperCase() + v?.slice(1);
}

/* ========= categorias ========= */
const CATS = [
  { slug: "apple", name: "Apple" },
  { slug: "samsung", name: "Samsung" },
  { slug: "mais-buscados", name: "Mais buscados" },
  { slug: "bbb-do-dia", name: "BBB do dia" },
];

/* ========= search suggestion mock ========= */
const SUG = [
  "iPhone 13 128GB",
  "iPhone 14 128GB",
  "Galaxy A54",
  "Galaxy S21 FE",
];

export default function Header() {
  const pathname = usePathname();
  const { itemsCount } = useCart();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!popRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (popRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    window.location.href = `/buscar?q=${encodeURIComponent(q.trim())}`;
  };

  const isActive = useMemo(() => {
    const p = norm(pathname);
    return (slug: string) =>
      p === `/${slug}` || p.startsWith(`/${slug}/`) ? "text-zinc-900" : "text-zinc-600";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo.svg" alt="proStore" width={28} height={28} />
          proStore
        </Link>

        {/* busca */}
        <form onSubmit={onSearch} className="hidden md:flex items-center gap-2 rounded-2xl border px-3 py-2 bg-white">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar aparelho..."
            className="w-72 outline-none text-sm"
          />
        </form>

        {/* ações */}
        <div className="flex items-center gap-3">
          {/* menu dropdown categorias */}
          <div className="relative">
            <button className="hidden md:inline-flex items-center gap-1 text-sm text-zinc-700 hover:text-zinc-900">
              Categorias <ChevronDown className="h-4 w-4" />
            </button>
            {/* (dropdown real poderia vir aqui) */}
          </div>

          <Link href="/carrinho" className="relative rounded-xl border px-3 h-10 inline-flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">Meu carrinho</span>
            {itemsCount ? (
              <span className="absolute -top-2 -right-2 h-5 min-w-[20px] rounded-full bg-emerald-600 text-white text-xs grid place-items-center px-1">
                {itemsCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {/* barra inferior (mobile) */}
      <div className="md:hidden border-t">
        <div className="container flex items-center gap-2 py-2">
          <form onSubmit={onSearch} className="flex-1 flex items-center gap-2 rounded-xl border px-3 py-2 bg-white">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="w-full outline-none text-sm"
            />
          </form>

          <button
            className="rounded-xl border h-10 w-10 grid place-items-center"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* drawer mobile */}
      {open ? (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl ring-1 ring-zinc-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <b className="text-lg">Menu</b>
              <button className="rounded p-2 hover:bg-zinc-100" aria-label="Fechar" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-3 grid gap-2 text-zinc-800">
              {CATS.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} onClick={() => setOpen(false)} className={`rounded px-2 py-2 hover:bg-zinc-50 ${isActive(c.slug)}`}>
                  {cap(c.name)}
                </Link>
              ))}
              <Link href="/carrinho" onClick={() => setOpen(false)} className={`rounded px-2 py-2 hover:bg-zinc-50 ${isActive("carrinho")}`}>
                Carrinho
              </Link>
              <Link href="/checkout" onClick={() => setOpen(false)} className={`rounded px-2 py-2 hover:bg-zinc-50 ${isActive("checkout")}`}>
                Checkout
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
