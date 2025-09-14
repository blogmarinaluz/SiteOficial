"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, User, Search, Flame } from "lucide-react";
import { useCart } from "@/hooks/useCart";

// ===== helpers do contador =====
type Left = { d: number; h: number; m: number; s: number; done: boolean };

function calcLeft(target: number): Left {
  const diff = target - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, done: false };
}
const pad = (n: number) => String(n).padStart(2, "0");

// ===== componente =====
export function Header() {
  const [q, setQ] = useState("");
  const { items } = useCart();
  const cartQty = useMemo(
    () => items.reduce((acc, it) => acc + (it.qty ?? 1), 0),
    [items]
  );

  // contador: fim em 7 dias a partir da primeira visita do usuário
  const [target, setTarget] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now() + 7 * 24 * 60 * 60 * 1000;
    const saved = localStorage.getItem("promoEnd");
    if (saved) return Number(saved);
    const t = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("promoEnd", String(t));
    return t;
  });
  const [left, setLeft] = useState<Left>(calcLeft(target));

  useEffect(() => {
    const id = setInterval(() => setLeft(calcLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  // se zerou, reinicia mais 7 dias (opcional — mantém a faixa viva)
  useEffect(() => {
    if (left.done) {
      const t = Date.now() + 7 * 24 * 60 * 60 * 1000;
      setTarget(t);
      if (typeof window !== "undefined") localStorage.setItem("promoEnd", String(t));
    }
  }, [left.done]);

  const cats = [
    { label: "Apple", href: "/categoria/apple" },
    { label: "Samsung", href: "/categoria/samsung" },
    { label: "Ofertas", href: "/#ofertas" },
    { label: "Mais buscados", href: "/#populares" },
  ];

  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      {/* TOP PROMO STRIP */}
      <div className="w-full bg-indigo-700 text-white">
        <div className="container mx-auto px-3">
          <div className="flex flex-col items-center justify-center py-2 text-center gap-2 md:flex-row md:justify-between md:text-left">
            <div className="flex items-center gap-2 font-bold tracking-wide">
              <Flame className="w-5 h-5" />
              <span className="uppercase">SEMANA DE PREÇOS BAIXOS</span>
              <span className="hidden md:inline">•</span>
              <span className="font-semibold">30% OFF no site inteiro</span>
              <span className="hidden md:inline">•</span>
              <span>Desconto aplicado no carrinho</span>
            </div>

            {/* contador */}
            <div className="flex items-center gap-3">
              <Box label="dias" value={pad(left.d)} />
              <Dots />
              <Box label="horas" value={pad(left.h)} />
              <Dots />
              <Box label="min" value={pad(left.m)} />
              <Dots />
              <Box label="seg" value={pad(left.s)} />
            </div>
          </div>
        </div>
      </div>

      {/* SUB-STRIP FRASE */}
      <div className="w-full bg-zinc-50 text-zinc-700">
        <div className="container mx-auto px-3">
          <div className="py-2 text-center text-sm">
            Especialista em celulares novos com garantia!
          </div>
        </div>
      </div>

      {/* LOGO + BUSCA + ENTRAR + CARRINHO */}
      <div className="container mx-auto px-3">
        <div className="flex items-center gap-4 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-indigo-700 whitespace-nowrap"
            aria-label="Voltar para a página inicial"
          >
            proStore
          </Link>

          {/* Busca centralizada e elástica */}
          <form
            action="/buscar"
            className="flex-1 flex items-stretch max-w-3xl mx-auto"
          >
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Encontre celulares e tablets…"
              className="w-full border border-zinc-300 rounded-l-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="rounded-r-2xl px-4 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Link
              href="/minha-conta"
              className="btn-outline hidden sm:inline-flex"
              aria-label="Entrar na conta"
            >
              <User className="w-5 h-5 mr-2" /> Entrar
            </Link>

            <Link
              href="/carrinho"
              className="relative inline-flex items-center btn-primary"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrinho
              {cartQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 grid place-content-center">
                  {cartQty}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORIAS + BOTÃO ANÁLISE DE BOLETO */}
      <div className="w-full border-t border-zinc-200">
        <div className="container mx-auto px-3">
          <div className="flex items-center justify-between py-2">
            <nav className="flex flex-wrap items-center gap-4 text-sm">
              {cats.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="text-zinc-700 hover:text-indigo-700 transition"
                >
                  {c.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/analise-de-cadastro"
              className="btn-primary"
              aria-label="Solicitar análise de Boleto"
            >
              Análise de Boleto
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// ===== componentes visuais do contador =====
function Box({ value, label }: { value: string; label: string }) {
  return (
    <div className="grid place-items-center">
      <div className="w-12 h-12 rounded-full bg-white text-indigo-700 font-extrabold grid place-content-center shadow-sm">
        {value}
      </div>
      <div className="text-xs mt-1 opacity-90">{label}</div>
    </div>
  );
}
function Dots() {
  return <span className="text-white/80 text-lg font-bold">•</span>;
}

export default Header;
