// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import productsData from "@/data/products.json";
import {
  Menu,
  X,
  User,
  LogIn,
  ChevronRight,
  MessageCircle,
  ShoppingCart,
  ShieldCheck,
  Percent,
  Truck,
  Search,
} from "lucide-react";

/* ================== Utils ================== */
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");
function fmt(n: number) {
  return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

/* ================== Tipos ================== */
type Product = {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  price?: number;
};
type Order = {
  code: string;
  items: Array<{ name: string; qty: number; price: number; total: number }>;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
};

/* ================== Modal “Minha conta” ================== */
function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Order | null>(null);
  const [waNumber, setWaNumber] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    try {
      const wa = localStorage.getItem("prostore:wa") || "";
      setWaNumber(wa);
    } catch {}
  }, [open]);

  function buscar() {
    try {
      const raw = localStorage.getItem("prostore:orders");
      const arr: Order[] = raw ? JSON.parse(raw) : [];
      const found = arr.find((o) => o.code.toLowerCase() === code.trim().toLowerCase());
      setResult(found || null);
    } catch {
      setResult(null);
    }
  }

  function whatsappUrl() {
    const base = "https://wa.me/";
    const phone = (waNumber || "").replace(/\D/g, "");
    const text = encodeURIComponent(
      `Olá! Preciso de ajuda com meu pedido${code ? ` (código ${code.trim()})` : ""}.`
    );
    return phone ? `${base}${phone}?text=${text}` : `${base}?text=${text}`;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
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

        <div className="p-4 space-y-4">
          <div>
            <div className="text-sm text-zinc-700">Acompanhar pedido</div>
            <div className="mt-2 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Digite seu código (ex.: PS-20250916-ABCD)"
                className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button
                onClick={buscar}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Consultar
              </button>
            </div>

            {result ? (
              <div className="mt-3 text-sm rounded-xl border p-3">
                <div className="font-semibold">Código: {result.code}</div>
                <ul className="mt-2 space-y-1">
                  {result.items.map((it, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="truncate">
                        {it.qty}x {it.name}
                      </span>
                      <span className="font-medium">{fmt(it.total)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 border-t pt-2 text-right text-sm">
                  <div className="text-zinc-600">Subtotal: {fmt(result.subtotal)}</div>
                  <div className="text-emerald-700">Cupom: − {fmt(result.discount)}</div>
                  <div className="font-semibold">Total: {fmt(result.total)}</div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="pt-2 border-t">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com atendente
              <ChevronRight className="h-4 w-4" />
            </a>
            <p className="mt-1 text-xs text-zinc-500">
              Dica: salve seu número do WhatsApp em <b>/checkout?admin=1</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== Busca ================== */
function SearchModal({
  open,
  onClose,
  list,
}: {
  open: boolean;
  onClose: () => void;
  list: Product[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q) return [];
    const term = norm(q);
    return list
      .filter((p) => norm(p.name).includes(term) || norm(p.brand).includes(term))
      .slice(0, 12);
  }, [q, list]);

  function go(p: Product) {
    onClose();
    const id = idNoExt(p.id);
    router.push(`/produto/${id}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-[12%] w-[92vw] max-w-2xl -translate-x-1/2 rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
        <div className="flex items-center gap-2 border-b p-3">
          <Search className="h-5 w-5 text-zinc-500" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar iPhone, Samsung…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button onClick={onClose} className="rounded p-1 hover:bg-zinc-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-sm text-zinc-500">Digite para buscar produtos…</div>
          ) : (
            <ul className="divide-y">
              {results.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-zinc-50 cursor-pointer"
                  onClick={() => go(p)}
                >
                  <span className="truncate text-sm">{p.name}</span>
                  <span className="text-xs text-zinc-500">
                    {p.price ? fmt(Number(p.price)) : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================== Header ================== */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { items } = useCart();
  const count = useMemo(() => (items ?? []).reduce((a, i) => a + (i.qty || 0), 0), [items]);

  // lista de produtos para busca (nome/brand/preço)
  const productList = useMemo(() => productsData as Product[], []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setShowAccount(false);
        setShowSearch(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Faixa superior com benefícios */}
      <div className="w-full bg-zinc-50 border-b border-zinc-200 text-[12px] text-zinc-700">
        <div className="mx-auto max-w-[1100px] px-4 py-1">
          <div className="hidden sm:flex items-center gap-4">
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Nota Fiscal
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-emerald-600" />
              30% OFF no PIX/Boleto
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              Frete grátis em selecionados
            </div>
            <div className="ml-auto inline-flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              Suporte via WhatsApp
            </div>
          </div>
          <div className="sm:hidden overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 min-w-max">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> NF
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5 text-emerald-600" /> 30% OFF Pix
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-emerald-600" /> Frete grátis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center gap-3">
          {/* menu mobile */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden rounded-lg p-2 hover:bg-zinc-100"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* logo */}
          <Link href="/" className="font-extrabold tracking-tight text-zinc-900">
            pro<span className="text-emerald-600">Store</span>
          </Link>

          {/* Busca (desktop) */}
          <div className="hidden md:flex flex-1 items-center">
            <button
              onClick={() => setShowSearch(true)}
              className="group flex w-full items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
              title="Buscar (Ctrl/Cmd + K)"
            >
              <Search className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
              <span className="text-zinc-600">Buscar produtos…</span>
              <span className="ml-auto hidden lg:inline rounded border px-1.5 text-[11px] text-zinc-500">
                Ctrl/⌘ + K
              </span>
            </button>
          </div>

          {/* links desktop */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Início
            </Link>
            <Link
              href="/ofertas"
              className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Ofertas
            </Link>

            {/* CTA “Análise de Boleto” – VERDE */}
            <Link
              href="/analise-boleto"
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              title="Análise de Boleto"
            >
              Análise de Boleto
            </Link>

            {/* “Entrar” abre modal */}
            <button
              onClick={() => setShowAccount(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              title="Minha conta"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </button>

            {/* Carrinho com contador */}
            <Link
              href="/carrinho"
              className="relative inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              title="Meu carrinho"
            >
              <ShoppingCart className="h-4 w-4" />
              Carrinho
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white grid place-items-center">
                  {count}
                </span>
              )}
            </Link>
          </nav>

          {/* ações mobile (direita) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="rounded-xl border border-zinc-300 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
              title="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/carrinho"
              className="relative rounded-xl border border-zinc-300 bg-white p-2 text-zinc-800 hover:bg-zinc-50"
              title="Meu carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white grid place-items-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setShowAccount(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </button>
          </div>
        </div>

        {/* menu mobile dropdown */}
        {open && (
          <div className="lg:hidden border-t border-zinc-200">
            <div className="mx-auto max-w-[1100px] px-4 py-3 flex flex-col gap-2">
              <Link href="/" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">Início</Link>
              <Link href="/ofertas" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">Ofertas</Link>
              <Link
                href="/analise-boleto"
                className="rounded-lg px-3 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Análise de Boleto
              </Link>
              <button
                onClick={() => { setShowAccount(true); setOpen(false); }}
                className="rounded-lg px-3 py-2 text-sm border border-zinc-300 text-zinc-800 bg-white hover:bg-zinc-50 text-left"
              >
                Entrar
              </button>
            </div>
          </div>
        )}
      </header>

      {/* modais */}
      <AccountModal open={showAccount} onClose={() => setShowAccount(false)} />
      <SearchModal open={showSearch} onClose={() => setShowSearch(false)} list={productList} />
    </>
  );
}
