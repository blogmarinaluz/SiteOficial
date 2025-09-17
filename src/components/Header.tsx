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

const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");

const catalog: Product[] = (productsData as any).map((p: any) => ({
  id: String(p.id),
  name: String(p.name || ""),
  brand: String(p.brand || ""),
  price: Number(p.price || 0),
}));

export default function Header() {
  const router = useRouter();

  const cart = useCart() as any;
  const rawCount = cart?.count;
  const count =
    typeof rawCount === "function" ? Number(rawCount() ?? 0) : Number(rawCount ?? 0);

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
    <header className="header">
      <div className="w-full border-b border-zinc-200 bg-zinc-50 text-[12px] text-zinc-700">
        <div className="mx-auto flex max-w-[1100px] items-center gap-4 px-4 py-1">
          <span className="inline-flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5" /> 12% OFF no Pix
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Frete grátis*
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> 90 dias de garantia
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-4 py-3">
        <button className="rounded-lg p-2 hover:bg-zinc-100 lg:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" prefetch={false} className="font-extrabold tracking-tight text-zinc-900">
          pro<span className="text-emerald-600">Store</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden flex-1 items-center pl-4 md:flex">
          <div className="flex w-full items-center rounded-full border border-zinc-300 bg-white p-1.5">
            <Search className="mx-2 h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por modelo, marca..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Buscar
            </button>
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="redirect">
              <button
                className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                title="Entrar ou criar conta"
              >
                Entrar
              </button>
            </SignInButton>
          </SignedOut>

        <SignedIn>
            <UserButton
              appearance={{ elements: { userButtonPopoverCard: "rounded-2xl border shadow-xl" } }}
            />
          </SignedIn>

          <Link
            href="/carrinho"
            className="relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50"
            title="Meu carrinho"
          >
            <ShoppingCart className="h-4 w-4" />
            Carrinho
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <div className="border-t border-zinc-200 md:hidden">
        <form onSubmit={submitSearch} className="mx-auto max-w-[1100px] px-4 py-2">
          <div className="flex w-full items-center rounded-full border border-zinc-300 bg-white p-1.5">
            <Search className="mx-2 h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por modelo, marca..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
