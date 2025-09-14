"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, LogIn, Search } from "lucide-react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Header() {
  // termina em 7 dias
  const endsAt = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.getTime();
  }, []);

  const [left, setLeft] = useState(endsAt - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(endsAt - Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const days = Math.max(0, Math.floor(left / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((left / (1000 * 60 * 60)) % 24));
  const mins = Math.max(0, Math.floor((left / (1000 * 60)) % 60));
  const secs = Math.max(0, Math.floor((left / 1000) % 60));

  return (
    <header className="w-full border-b bg-white">
      {/* faixa de campanha */}
      <div className="w-full bg-indigo-800 text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-6 text-sm font-medium">
          <span>🔥 <b>SEMANA DE PREÇOS BAIXOS</b> — <b>30% OFF</b> no site inteiro (cupom aplicado no carrinho)</span>
          <span className="hidden sm:flex items-center gap-2">
            ⏳ termina em:
            <b>{pad(days)}d:{pad(hours)}h:{pad(mins)}m:{pad(secs)}s</b>
          </span>
        </div>
      </div>

      {/* tagline */}
      <div className="w-full bg-zinc-50 border-b">
        <div className="container mx-auto px-4 py-2 text-center text-sm text-zinc-700">
          Especialista em celulares novos com garantia!
        </div>
      </div>

      {/* barra principal */}
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <Link href="/" className="text-2xl font-extrabold text-indigo-700 tracking-tight">proStore</Link>

        <form action="/buscar" className="flex-1 flex items-stretch">
          <input
            name="q"
            placeholder="Encontre celulares e tablets…"
            className="w-full border border-zinc-300 rounded-l-2xl px-4 py-2 outline-none"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 rounded-r-2xl px-4 text-white flex items-center justify-center">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <Link href="/minha-conta" className="btn-outline flex items-center gap-2">
          <LogIn className="w-5 h-5" /> Entrar
        </Link>
        <Link href="/carrinho" className="btn-primary flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Carrinho
        </Link>
      </div>

      {/* categorias + boleto */}
      <div className="container mx-auto px-4 pb-4 flex items-center justify-between gap-4">
        <nav className="flex gap-6 text-sm">
          <Link href="/categoria/apple" className="hover:text-indigo-700">Apple</Link>
          <Link href="/categoria/samsung" className="hover:text-indigo-700">Samsung</Link>
          <Link href="/ofertas" className="hover:text-indigo-700">Ofertas</Link>
          <Link href="/mais-buscados" className="hover:text-indigo-700">Mais buscados</Link>
        </nav>
        <Link href="/analise-de-cadastro" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-2xl text-sm">
          Análise de Boleto
        </Link>
      </div>
    </header>
  );
}
