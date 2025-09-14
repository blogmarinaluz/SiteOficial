"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import CartMini from "@/components/CartMini";
import useCart from "@/hooks/useCart";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Header() {
  const { items } = useCart();
  const pathname = usePathname();
  const [endAt, setEndAt] = useState<number>(() => {
    // persiste o fim da campanha por 7 dias
    const key = "promo_end_at";
    const cached = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (cached) return Number(cached);
    const end = Date.now() + 7 * 24 * 60 * 60 * 1000;
    if (typeof window !== "undefined") localStorage.setItem(key, String(end));
    return end;
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const left = Math.max(0, endAt - Date.now());
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  return (
    <header className="border-b bg-white">
      {/* Barra da campanha */}
      <div className="w-full bg-[#382ae1] text-white text-xs md:text-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="font-semibold">
            🔥 SEMANA DE PREÇOS BAIXOS — <b>30% OFF</b> no site inteiro (cupom aplicado no carrinho)
          </div>
          <div className="opacity-90">
            ⏳ termina em: <b>{pad(d)}d:{pad(h)}h:{pad(m)}m:{pad(s)}s</b>
          </div>
        </div>
      </div>

      {/* Faixa secundária */}
      <div className="text-center text-[13px] py-2 text-zinc-600">
        Especialista em celulares novos com garantia!
      </div>

      {/* Linha do topo */}
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#4b4bfb]">
          <span className="lowercase">pro</span><span className="capitalize">Store</span>
        </Link>

        <form
          action="/buscar"
          className="ml-2 flex-1 flex rounded-xl overflow-hidden border"
        >
          <input
            name="q"
            placeholder="Encontre celulares e tablets..."
            className="px-3 py-2 w-full outline-none"
            defaultValue={typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") ?? "" : ""}
          />
          <button className="bg-[#4b4bfb] text-white px-4">🔎</button>
        </form>

        <Link
          href="/minha-conta"
          className="hidden md:inline-flex border rounded-xl px-3 py-2 text-sm items-center gap-2"
        >
          ➜ Entrar
        </Link>

        <CartMini>
          <button
            aria-label="Abrir carrinho"
            className="relative bg-[#ff8c00] text-white rounded-xl px-3 py-2 font-medium"
          >
            🛒 Carrinho
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#ff8c00] rounded-full text-xs px-2 py-0.5 border">
                {count}
              </span>
            )}
          </button>
        </CartMini>
      </div>

      {/* Menu categorias */}
      <nav className="border-t">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-5 text-sm">
          <Link href="/categoria/apple" className={linkClass(pathname, "/categoria/apple")}>Apple</Link>
          <Link href="/categoria/samsung" className={linkClass(pathname, "/categoria/samsung")}>Samsung</Link>
          <Link href="/ofertas" className={linkClass(pathname, "/ofertas")}>Ofertas</Link>
          <Link href="/mais-buscados" className={linkClass(pathname, "/mais-buscados")}>Mais buscados</Link>

          <Link
            href="/analise-de-cadastro"
            className="ml-auto bg-[#ff8c00] text-white rounded-xl px-3 py-1.5 text-sm"
          >
            Análise de Boleto
          </Link>
        </div>
      </nav>
    </header>
  );
}

function linkClass(pathname: string, href: string) {
  const active = pathname?.startsWith(href);
  return `hover:underline ${active ? "font-semibold text-zinc-900" : "text-zinc-600"}`;
}
