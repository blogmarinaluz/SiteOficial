"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, User, ChevronDown } from "lucide-react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";

function uniqueBy<T, K extends string | number>(arr: T[], key: (t: T) => K) {
  const map = new Map<K, T>();
  for (const it of arr) {
    const k = key(it);
    if (!map.has(k)) map.set(k, it);
  }
  return Array.from(map.values());
}

export function Header() {
  const [q, setQ] = useState("");
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  const appleList = useMemo(
    () =>
      uniqueBy(
        (products as any[]).filter((p) => p.brand?.toLowerCase() === "apple"),
        (p: any) => p.model_key
      ).slice(0, 8),
    []
  );
  const samsungList = useMemo(
    () =>
      uniqueBy(
        (products as any[]).filter((p) => p.brand?.toLowerCase() === "samsung"),
        (p: any) => p.model_key
      ).slice(0, 8),
    []
  );

  // MENU CONTROLADO PRA NÃO SUMIR NO HOVER
  const [open, setOpen] = useState<null | "apple" | "samsung">(null);
  let timer: any;
  function onEnter(k: "apple" | "samsung") {
    clearTimeout(timer);
    setOpen(k);
  }
  function onLeave() {
    clearTimeout(timer);
    timer = setTimeout(() => setOpen(null), 180);
  }
  useEffect(() => () => clearTimeout(timer), []);

  return (
    <header className="header">
      <div className="container py-4 flex items-center gap-4">
        <Link href="/" className="text-2xl font-extrabold text-accent">
          prostore
        </Link>

        <nav className="hidden md:flex gap-6">
          <div
            className="relative"
            onMouseEnter={() => onEnter("apple")}
            onMouseLeave={onLeave}
          >
            <Link href="/categoria/apple" className="menu-link flex items-center gap-1">
              Apple <ChevronDown className="w-4 h-4" />
            </Link>
            {open === "apple" && (
              <div className="absolute left-0 mt-2 bg-white border rounded-2xl shadow-lg p-3 w-80 z-50"
                   onMouseEnter={() => onEnter("apple")}
                   onMouseLeave={onLeave}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {appleList.map((m: any) => (
                    <Link
                      key={m.model_key}
                      href={`/buscar?q=${encodeURIComponent(m.model_key)}`}
                      className="hover:text-accent"
                    >
                      {m.name}
                    </Link>
                  ))}
                  <Link href="/categoria/apple" className="text-accent font-medium mt-1">
                    Mais modelos…
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => onEnter("samsung")}
            onMouseLeave={onLeave}
          >
            <Link href="/categoria/samsung" className="menu-link flex items-center gap-1">
              Samsung <ChevronDown className="w-4 h-4" />
            </Link>
            {open === "samsung" && (
              <div className="absolute left-0 mt-2 bg-white border rounded-2xl shadow-lg p-3 w-80 z-50"
                   onMouseEnter={() => onEnter("samsung")}
                   onMouseLeave={onLeave}>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {samsungList.map((m: any) => (
                    <Link
                      key={m.model_key}
                      href={`/buscar?q=${encodeURIComponent(m.model_key)}`}
                      className="hover:text-accent"
                    >
                      {m.name}
                    </Link>
                  ))}
                  <Link href="/categoria/samsung" className="text-accent font-medium mt-1">
                    Mais modelos…
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link className="menu-link" href="/central-de-ajuda">Suporte</Link>
          <Link className="menu-link" href="/faq">FAQ</Link>
        </nav>

        <form action="/buscar" className="flex-1 flex max-w-xl">
          <input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busque iPhone, Galaxy..."
            className="w-full border border-zinc-300 rounded-l-2xl px-3 py-2 outline-none"
          />
          <button className="btn-primary rounded-l-none">Buscar</button>
        </form>

        <Link className="btn-outline relative" href="/minha-conta">
          <User className="w-5 h-5 mr-2" /> Minha Conta
        </Link>

        <Link className="btn-primary relative" href="/carrinho">
          <ShoppingCart className="w-5 h-5 mr-2" /> Carrinho
          {count > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] px-1 rounded-full bg-red-600 text-white text-[11px] grid place-items-center">
              {count}
            </span>
          )}
        </Link>
      </div>

      <div className="bg-accent text-white">
        <div className="container py-2 text-sm">
          Cupom ativo: <b>30% OFF</b> aplicado no carrinho · Boleto para negativados (análise de cadastro).
        </div>
      </div>
    </header>
  );
}
