// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import productsData from "@/data/products.json";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Menu, ShieldCheck, Percent, Truck, Search, ShoppingCart } from "lucide-react";

type Product = { id: string; name: string; brand?: string; price?: number };

const norm = (v: unknown) => String(v ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
const idNoExt = (id: string) => String(id).split(".")[0];
const catalog: Product[] = (productsData as Product[]) ?? [];

export default function Header() {
  const router = useRouter();

  // Cart: compatível mesmo quando hook expõe count() como função
  const cart: any = useCart();
  const rawCount = cart?.count;
  const count = typeof rawCount === "function" ? Number(rawCount() ?? 0) : Number(rawCount ?? 0);

  const [q, setQ] = useState("");

  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const r = catalog.filter(
      (p) => norm(p.name).includes(norm(term)) || norm(p.brand).includes(norm(term))
    );
    if (r[0]) router.push(`/produto/${idNoExt(r[0].id)}`);
    else router.push(`/buscar?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="header bg-brand-gradient text-white">
      {/* Barra de avisos */}
      <div className="w-full border-b border-white/10 text-[12px]">
        <div className="container-safe flex items-center gap-4 py-1">
          <span className="inline-flex items-center gap-1.5 text-white/90">
            <Percent className="h-3.5 w-3.5" /> 12% OFF no Pix
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/90">
            <Truck className="h-3.5 w-3.5" /> Frete grátis*
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-white/90">
            <ShieldCheck className="h-3.5 w-3.5" /> 90 dias de garantia
          </span>
        </div>
      </div>

      {/* Navegação principal */}
      <div className="container-safe flex items-center gap-3 py-3">
        {/* Menu mobile (placeholder) */}
        <button className="rounded-2xl p-2 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link href="/" prefetch={false} className="font-extrabold tracking-tight text-white">
          pro<span className="text-accent">Store</span>
        </Link>

        {/* Busca desktop */}
        <form onSubmit={submitSearch} className="ml-auto hidden min-w-[320px] max-w-lg flex-1 md:block">
          <div className="flex w-full items-center rounded-2xl border border-white/10 bg-white/10 p-1.5 backdrop-blur">
            <Search className="mx-2 h-4 w-4 text-white/70" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar iPhone, Samsung..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
            />
            <button
              type="submit"
              className="btn btn-primary rounded-2xl px-4 py-1.5 text-sm"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Ações: auth + carrinho */}
        <nav className="ml-2 flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-ghost rounded-2xl px-3 py-2 text-sm" title="Entrar ou criar conta">
                Entrar
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{ elements: { userButtonPopoverCard: "rounded-2xl border shadow-xl" } }} />
          </SignedIn>

          <Link href="/carrinho" className="relative inline-flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm font-medium hover:bg-white/5" title="Meu carrinho">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-fg">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* Busca mobile */}
      <div className="border-t border-white/10 md:hidden">
        <form onSubmit={submitSearch} className="container-safe py-2">
          <div className="flex w-full items-center rounded-full border border-white/10 bg-white/10 p-1.5 backdrop-blur">
            <Search className="mx-2 h-4 w-4 text-white/70" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar iPhone, Samsung..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
            />
            <button type="submit" className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-fg hover:bg-emerald-600">
              Buscar
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
