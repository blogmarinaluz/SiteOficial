// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import productsData from "@/data/products.json";
import {
  Menu, X, User, LogIn, ChevronRight, MessageCircle, ShoppingCart,
  ShieldCheck, Percent, Truck, Search, ChevronDown,
} from "lucide-react";

/* ===== utils ===== */
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");
const fmt = (n: number) =>
  Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

/* ===== tipos ===== */
type Product = { id: string; name: string; brand?: string; price?: number };
type Order = {
  code: string;
  items: Array<{ name: string; qty: number; price: number; total: number }>;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
};

/* ===== componente de link com âncora (scroll com offset) ===== */
function AnchorLink({ hash, children, className }: { hash: string; children: React.ReactNode; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function scrollToHash(h: string) {
    const id = h.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.getElementById("site-header");
    const offset = (header?.offsetHeight ?? 90) + 12;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (pathname !== "/") {
      router.push(`/${hash}`);
      // aguarda render e faz o ajuste suave
      setTimeout(() => scrollToHash(hash), 60);
    } else {
      scrollToHash(hash);
    }
  }

  return (
    <a href={`/${hash}`} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

/* ===== Modal “Minha conta” ===== */
function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Order | null>(null);

  const WA_NUMBER = "5599984905715"; // número fixo informado pelo cliente

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
    const text = encodeURIComponent(
      `Olá! Preciso de ajuda com meu pedido${code ? ` (código ${code.trim()})` : ""}.`
    );
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  }

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
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Header ===== */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { items } = useCart();
  const count = useMemo(
    () => (items ?? []).reduce((a, i) => a + (i.qty || 0), 0),
    [items]
  );

  const [openMobile, setOpenMobile] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // busca inline (desktop)
  const [q, setQ] = useState("");
  const productList = useMemo(() => productsData as Product[], []);
  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const r = productList.filter(
      (p) => norm(p.name).includes(norm(term)) || norm(p.brand).includes(norm(term))
    );
    if (r[0]) router.push(`/produto/${idNoExt(r[0].id)}`);
    else router.push(`/ofertas`);
  }

  // dropdowns (desktop)
  const [openDrop, setOpenDrop] = useState<"apple" | "samsung" | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMobile(false);
        setOpenDrop(null);
        setShowAccount(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* faixa de benefícios */}
      <div className="w-full bg-zinc-50 border-b border-zinc-200 text-[12px] text-zinc-700">
        <div className="mx-auto max-w-[1100px] px-4 py-1 flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Nota Fiscal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5 text-emerald-600" /> 30% OFF no PIX/Boleto
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-emerald-600" /> Frete grátis em selecionados
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> Suporte via WhatsApp
          </span>
        </div>
      </div>

      {/* barra principal */}
      <header id="site-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center gap-3">
          {/* menu mobile */}
          <button
            onClick={() => setOpenMobile((v) => !v)}
            className="lg:hidden rounded-lg p-2 hover:bg-zinc-100"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* logo */}
          <Link href="/" className="font-extrabold tracking-tight text-zinc-900">
            pro<span className="text-emerald-600">Store</span>
          </Link>

          {/* busca (desktop) */}
          <form onSubmit={submitSearch} className="hidden md:flex flex-1 items-center pl-4">
            <div className="flex w-full items-center rounded-full border border-zinc-300 bg-white p-1.5">
              <Search className="mx-2 h-4 w-4 text-zinc-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por modelo, cor, armazenamento..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* ações (desktop) */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setShowAccount(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              title="Minha conta"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </button>

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

            <Link
              href="/analise-boleto"
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              title="Análise de Boleto"
            >
              Análise de Boleto
            </Link>
          </nav>
        </div>

        {/* segunda linha + dropdowns */}
        <div className="hidden md:block border-t border-zinc-200">
          <div className="mx-auto max-w-[1100px] px-4">
            <ul className="relative flex items-center gap-6 text-[14px] py-2 text-zinc-700">
              {/* iPhone */}
              <li
                className="relative"
                onMouseEnter={() => setOpenDrop("apple")}
                onMouseLeave={() => setOpenDrop((v) => (v === "apple" ? null : v))}
              >
                <button className="inline-flex items-center gap-1 hover:text-zinc-900">
                  iPhone <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {openDrop === "apple" && (
                  <div className="absolute left-0 top-[120%] z-50 w-[520px] rounded-xl border bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 14 Plus", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro"]
                        .map((label) => (
                          <Link
                            key={label}
                            href={`/ofertas?brand=apple`}
                            className="rounded-lg px-2 py-1 hover:bg-zinc-100"
                          >
                            {label}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </li>

              {/* Samsung */}
              <li
                className="relative"
                onMouseEnter={() => setOpenDrop("samsung")}
                onMouseLeave={() => setOpenDrop((v) => (v === "samsung" ? null : v))}
              >
                <button className="inline-flex items-center gap-1 hover:text-zinc-900">
                  Samsung <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {openDrop === "samsung" && (
                  <div className="absolute left-0 top-[120%] z-50 w-[520px] rounded-xl border bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {["Galaxy A", "Galaxy S", "Galaxy Z Flip", "Galaxy Z Fold", "Linha M", "Linha F"]
                        .map((label) => (
                          <Link
                            key={label}
                            href={`/ofertas?brand=samsung`}
                            className="rounded-lg px-2 py-1 hover:bg-zinc-100"
                          >
                            {label}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </li>

              {/* âncoras na home com scroll suave */}
              <li><AnchorLink hash="#mais-buscados" className="hover:text-zinc-900">Mais buscados</AnchorLink></li>
              <li><AnchorLink hash="#bbb" className="hover:text-zinc-900">BBB do dia</AnchorLink></li>
              <li><AnchorLink hash="#destaques" className="hover:text-zinc-900">Ofertas em destaque</AnchorLink></li>

              <li className="ml-auto">
                <Link href="/checkout" className="hover:text-zinc-900">Checkout</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* menu mobile */}
      {openMobile && (
        <div className="lg:hidden border-b border-zinc-200">
          <div className="mx-auto max-w-[1100px] px-4 py-3 flex flex-col gap-2">
            <form
              onSubmit={submitSearch}
              className="flex items-center rounded-xl border border-zinc-300 bg-white p-2"
            >
              <Search className="h-4 w-4 text-zinc-500 mr-2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder="Buscar produtos…"
              />
              <button
                type="submit"
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white"
              >
                Buscar
              </button>
            </form>

            {/* grupos simples no mobile */}
            <details className="rounded-lg bg-white border border-zinc-200">
              <summary className="cursor-pointer px-3 py-2 text-sm">iPhone</summary>
              <div className="px-3 pb-2 text-sm">
                <Link href="/ofertas?brand=apple" className="block rounded px-2 py-1 hover:bg-zinc-100">
                  Ver iPhones
                </Link>
              </div>
            </details>
            <details className="rounded-lg bg-white border border-zinc-200">
              <summary className="cursor-pointer px-3 py-2 text-sm">Samsung</summary>
              <div className="px-3 pb-2 text-sm">
                <Link href="/ofertas?brand=samsung" className="block rounded px-2 py-1 hover:bg-zinc-100">
                  Ver Samsungs
                </Link>
              </div>
            </details>

            <AnchorLink hash="#mais-buscados" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">Mais buscados</AnchorLink>
            <AnchorLink hash="#bbb" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">BBB do dia</AnchorLink>
            <AnchorLink hash="#destaques" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">Ofertas em destaque</AnchorLink>

            <div className="mt-1 flex gap-2">
              <button
                onClick={() => { setShowAccount(true); setOpenMobile(false); }}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                Entrar
              </button>
              <Link
                href="/carrinho"
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 text-center"
              >
                Carrinho
              </Link>
            </div>

            <Link
              href="/analise-boleto"
              className="mt-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white text-center hover:bg-emerald-700"
            >
              Análise de Boleto
            </Link>
          </div>
        </div>
      )}

      {/* modal conta */}
      <AccountModal open={showAccount} onClose={() => setShowAccount(false)} />
    </>
  );
}
