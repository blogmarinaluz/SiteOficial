// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import productsData from "@/data/products.json";
import { Menu, X, User, LogIn, ChevronRight, MessageCircle, ShoppingCart, ShieldCheck, Percent, Truck, Search } from "lucide-react";

/* ========= utils ========= */
const norm = (v: unknown) => String(v ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");
const fmt = (n: number) => Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

/* ========= tipos ========= */
type Product = { id: string; name: string; brand?: string; price?: number };

/* ========= catálogo para busca ========= */
const catalog: Product[] = (productsData as any).map((p: any) => ({
  id: String(p.id),
  name: String(p.name || ""),
  brand: String(p.brand || ""),
  price: Number(p.price || 0),
}));

/* ========= modal de conta (simplificado, controlado por estado) ========= */
function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2 text-zinc-800">
            <User className="h-5 w-5" />
            <b>Minha conta</b>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-zinc-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <p className="text-zinc-700">Área do cliente em breve.</p>
          <p className="text-zinc-600">Enquanto isso, você pode finalizar a compra normalmente e acompanhar o pedido pelo código enviado por e-mail.</p>
          <Link href="/minha-conta" className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 hover:bg-zinc-50">
            Ir para minha conta <ChevronRight className="h-4 w-4" />
          </Link>
          <a href="https://wa.me/5599984905715" target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-700">
            <MessageCircle className="h-4 w-4" /> Suporte no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();

  // busca
  const [q, setQ] = useState("");
  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const r = catalog.filter((p) => norm(p.name).includes(norm(term)) || norm(p.brand).includes(norm(term)));
    if (r[0]) router.push(`/produto/${idNoExt(r[0].id)}`);
    else router.push(`/buscar?q=${encodeURIComponent(term)}`);
  }

  // modal de conta controlado por estado (sem script inline)
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="header">
      {/* faixa superior */}
      <div className="w-full bg-zinc-50 border-b border-zinc-200 text-[12px] text-zinc-700">
        <div className="mx-auto max-w-[1100px] px-4 py-1 flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5"><Percent className="h-3.5 w-3.5" /> 12% OFF no Pix</span>
          <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Frete grátis*</span>
          <span className="ml-auto inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> 90 dias de garantia</span>
        </div>
      </div>

      {/* linha principal */}
      <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center gap-3">
        <button className="lg:hidden rounded-lg p-2 hover:bg-zinc-100" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>

        {/* LOGO corrigido */}
        <Link href="/" prefetch={false} className="font-extrabold tracking-tight text-zinc-900">
          pro<span className="text-emerald-600">Store</span>
        </Link>

        {/* busca (desktop) */}
        <form onSubmit={submitSearch} className="hidden md:flex flex-1 items-center pl-4">
          <div className="flex w-full items-center rounded-full border border-zinc-300 bg-white p-1.5">
            <Search className="mx-2 h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por modelo, marca..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <button type="submit" className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Buscar
            </button>
          </div>
        </form>

        {/* ações */}
        <nav className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setAccountOpen(true)}
            className="rounded-xl border px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            title="Minha conta"
          >
            <LogIn className="h-4 w-4 inline-block mr-1" />
            Entrar
          </button>

          <Link href="/carrinho" className="relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-zinc-50" title="Meu carrinho">
            <ShoppingCart className="h-4 w-4" />
            Carrinho
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white grid place-items-center">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* busca (mobile) */}
      <div className="md:hidden border-t border-zinc-200">
        <form onSubmit={submitSearch} className="mx-auto max-w-[1100px] px-4 py-2">
          <div className="flex w-full items-center rounded-full border border-zinc-300 bg-white p-1.5">
            <Search className="mx-2 h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por modelo, marca..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
            <button type="submit" className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* modal de conta */}
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </header>
  );
}
