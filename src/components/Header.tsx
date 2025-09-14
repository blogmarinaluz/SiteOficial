"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CartMini from "@/components/CartMini";
import { useCart } from "@/hooks/useCart";

function two(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Header() {
  // ---- Countdown (7 dias a partir de hoje) ----
  const [remain, setRemain] = useState<{ d: number; h: number; m: number; s: number }>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  useEffect(() => {
    // fixa a data final por 7 dias a partir do primeiro acesso e guarda no localStorage
    const key = "promo_deadline";
    const now = Date.now();
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    let deadline = saved ? Number(saved) : 0;

    if (!deadline || isNaN(deadline) || deadline < now) {
      deadline = now + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(key, String(deadline));
    }

    const tick = () => {
      const diff = Math.max(0, deadline - Date.now());
      const d = Math.floor(diff / (24 * 60 * 60 * 1000));
      const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const s = Math.floor((diff % (60 * 1000)) / 1000);
      setRemain({ d, h, m, s });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ---- Busca ----
  const [q, setQ] = useState("");
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    // redireciona para a página de ofertas com query
    window.location.href = `/ofertas?q=${encodeURIComponent(term)}`;
  };

  // ---- Contagem rápida do carrinho (mostramos só na barra de categorias) ----
  const { items } = useCart();
  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  return (
    <header className="border-b bg-white">
      {/* TOP BAR PROMO */}
      <div className="bg-[#111] text-white">
        <div className="container mx-auto px-4 py-2 text-center">
          <div className="text-[13px] leading-tight font-semibold tracking-wide">
            SEMANA DE PREÇOS BAIXOS — 30% OFF no site inteiro — Boleto para negativados
          </div>
          <div className="mt-1 text-sm">
            Termina em:{" "}
            <span className="font-mono">
              {two(remain.d)}d : {two(remain.h)}h : {two(remain.m)}m : {two(remain.s)}s
            </span>
          </div>
        </div>
      </div>

      {/* TAGLINE */}
      <div className="bg-zinc-50">
        <div className="container mx-auto px-4 py-2 text-center text-sm text-zinc-700">
          Especialista em celulares novos com garantia!
        </div>
      </div>

      {/* LOGO + BUSCA + AÇÕES */}
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-zinc-900">pro</span>
          <span className="text-emerald-600">Store</span>
        </Link>

        {/* Busca */}
        <form onSubmit={submitSearch} className="flex-1 flex items-stretch gap-0 max-w-3xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder="Buscar por modelo, cor, armazenamento…"
            className="w-full border border-zinc-300 rounded-l-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 rounded-r-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Buscar
          </button>
        </form>

        {/* Entrar / Carrinho */}
        <Link
          href="/login"
          className="hidden sm:inline-block text-sm text-zinc-700 hover:text-zinc-900"
        >
          Entrar
        </Link>

        {/* <<< AQUI: CartMini auto-fechado, sem children >>> */}
        <CartMini />
      </div>

      {/* CATEGORIAS + BOTÃO BOLETO */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/ofertas?brand=apple" className="hover:text-emerald-600">
              iPhone
            </Link>
            <Link href="/ofertas?brand=samsung" className="hover:text-emerald-600">
              Samsung
            </Link>
            <Link href="/ofertas?popular=1" className="hover:text-emerald-600">
              Mais buscados
            </Link>
            <Link href="/ofertas?bbb=1" className="hover:text-emerald-600">
              BBB do dia
            </Link>
            <Link href="/ofertas?featured=1" className="hover:text-emerald-600">
              Ofertas em destaque
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/analise-de-cadastro"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
            >
              Análise de Boleto
            </Link>
            <Link
              href="/checkout"
              className="text-sm text-zinc-700 hover:text-zinc-900"
              title="Ir para o checkout"
            >
              Checkout
            </Link>
            {count > 0 && (
              <span className="text-xs text-emerald-700 font-semibold">
                {count} item{count > 1 ? "s" : ""} no carrinho
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
