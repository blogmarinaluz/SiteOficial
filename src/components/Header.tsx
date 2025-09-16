// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
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
} from "lucide-react";

/* ===== Tipos (para consulta de pedido no modal) ===== */
type Order = {
  code: string;
  items: Array<{ name: string; qty: number; price: number; total: number }>;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
};

function fmt(n: number) {
  return Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

/* ===== Modal “Minha conta” (sem login) ===== */
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
              Dica: salve seu número de WhatsApp em <b>/checkout?admin=1</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Header ===== */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const { items } = useCart();
  const count = useMemo(() => (items ?? []).reduce((a, i) => a + (i.qty || 0), 0), [items]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setShowAccount(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* --- faixa superior com informações (desktop e scroll-x no mobile) --- */}
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

      {/* --- barra principal --- */}
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

          {/* grow */}
          <div className="flex-1" />

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

          {/* ações mobile (à direita) */}
          <div className="lg:hidden flex items-center gap-2">
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

      {/* modal “Minha conta” */}
      <AccountModal open={showAccount} onClose={() => setShowAccount(false)} />
    </>
  );
}
