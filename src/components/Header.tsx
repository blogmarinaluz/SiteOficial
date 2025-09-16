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

/* ========= utils ========= */
const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");
const fmt = (n: number) =>
  Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

/* ========= tipos ========= */
type Product = { id: string; name: string; brand?: string; price?: number };

/* ========= modelos do catálogo ========= */
function appleModelLabel(name: string): string | null {
  const m =
    name.match(/iPhone\s+(SE(?:\s*\(\d{4}\))?|\d{2}(?:\s?(?:Plus|Pro|Pro Max))?)/i)?.[0] ||
    name.match(/iPhone\s+(XR|XS Max|XS)/i)?.[0];
  return m ? m.replace(/\s+/g, " ").trim() : null;
}

function samsungModelLabel(name: string): string | null {
  const z = name.match(/Galaxy\s+Z\s+(Flip|Fold)(?:\s*\d{0,2})?/i)?.[0];
  if (z) return z.replace(/\s+/g, " ").trim();
  const s2 = name.match(/Galaxy\s+(A|S)\s*0?\d{1,3}/i)?.[0];
  if (s2) {
    return s2
      .replace(/(Galaxy\s+[AS]\s*)(\d{1})(?!\d)/i, (_a, p1, p2) => `${p1}0${p2}`)
      .replace(/\s+/g, " ")
      .trim();
  }
  return null;
}

/* === tolera brand com erro "samsumg" === */
function productBrand(p: Product): "apple" | "samsung" | "other" {
  const b = norm(`${p.brand || ""} ${p.name || ""}`);
  if (b.includes("apple") || b.includes("iphone")) return "apple";
  if (b.includes("samsung") || b.includes("galaxy") || b.includes("samsumg")) return "samsung";
  return "other";
}

/* ========= modal ========= */
function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const WA_NUMBER = "5599984905715";

  function buscar() {
    try {
      const raw = localStorage.getItem("prostore:orders");
      const arr: any[] = raw ? JSON.parse(raw) : [];
      const found = arr.find((o) => norm(o.code) === norm(code));
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
                  {result.items.map((it: any, i: number) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="truncate">{it.qty}x {it.name}</span>
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

/* ========= header ========= */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { items } = useCart();
  const count = useMemo(
    () => (items ?? []).reduce((a: number, i: any) => a + (i.qty || 0), 0),
    [items]
  );

  const catalog = useMemo(() => productsData as Product[], []);
  const appleModels = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((p) => {
      if (productBrand(p) !== "apple") return;
      const label = appleModelLabel(p.name || "");
      if (label) set.add(label);
    });
    return Array.from(set).sort((a, b) => {
      const an = Number(a.match(/\d{2,4}/)?.[0] || 0);
      const bn = Number(b.match(/\d{2,4}/)?.[0] || 0);
      if (an !== bn) return an - bn;
      const order = ["", "Plus", "Pro", "Pro Max", "SE"];
      const av = order.findIndex((k) => norm(a).includes(norm(k)));
      const bv = order.findIndex((k) => norm(b).includes(norm(k)));
      return av - bv;
    });
  }, [catalog]);

  const samsungModels = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((p) => {
      if (productBrand(p) !== "samsung") return;
      const label = samsungModelLabel(p.name || "");
      if (label) set.add(label);
    });
    return Array.from(set).sort((a, b) => {
      const family = (s: string) =>
        norm(s).includes("z flip") ? "Z1" :
        norm(s).includes("z fold") ? "Z2" :
        norm(s).includes("galaxy s") ? "S" : "A";
      const fa = family(a), fb = family(b);
      if (fa !== fb) return fa.localeCompare(fb);
      const an = Number(a.match(/\d{1,3}/)?.[0] || 0);
      const bn = Number(b.match(/\d{1,3}/)?.[0] || 0);
      return an - bn;
    });
  }, [catalog]);

  // busca (mantém fluxo antigo)
  const [q, setQ] = useState("");
  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const r = catalog.filter(
      (p) => norm(p.name).includes(norm(term)) || norm(p.brand).includes(norm(term))
    );
    if (r[0]) router.push(`/produto/${idNoExt(r[0].id)}`);
    else router.push(`/ofertas`);
  }

  // dropdowns desktop
  const [openDrop, setOpenDrop] = useState<"apple" | "samsung" | null>(null);

  // (mantido, mas os links de âncora abaixo NÃO cancelam o comportamento padrão)
  function scrollToOnHome(_hash: string) {}

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDrop(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* faixa superior */}
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
          <button className="lg:hidden rounded-lg p-2 hover:bg-zinc-100" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>

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

          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => (document.getElementById("modal-open") as HTMLButtonElement)?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              title="Minha conta"
              id="modal-open"
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

        {/* linha 2 */}
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
                  <div className="absolute left-0 top-[120%] z-50 w-[560px] rounded-xl border bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2">
                      {appleModels.slice(0, 12).map((label) => (
                        <Link key={label} href={`/ofertas?brand=apple&model=${encodeURIComponent(label)}`} className="rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100">
                          {label}
                        </Link>
                      ))}
                      <Link href="/ofertas?brand=apple" className="rounded-lg px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-zinc-50">
                        Ver todos os iPhones
                      </Link>
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
                  <div className="absolute left-0 top-[120%] z-50 w-[560px] rounded-xl border bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2">
                      {samsungModels.slice(0, 14).map((label) => (
                        <Link key={label} href={`/ofertas?brand=samsung&model=${encodeURIComponent(label)}`} className="rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100">
                          {label}
                        </Link>
                      ))}
                      <Link href="/ofertas?brand=samsung" className="rounded-lg px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-zinc-50">
                        Ver todos Samsung
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {/* Âncoras — sem onClick, sem preventDefault */}
              <li><a className="hover:text-zinc-900" href="/#mais-buscados">Mais buscados</a></li>
              <li><a className="hover:text-zinc-900" href="/#bbb">BBB do dia</a></li>
              <li><a className="hover:text-zinc-900" href="/#destaques">Ofertas em destaque</a></li>

              <li className="ml-auto">
                <Link href="/checkout" className="hover:text-zinc-900">Checkout</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* modal (fora do header para não cortar o overlay) */}
      <AccountModal open={false} onClose={() => {}} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var btn;
              function openModal(){
                window.dispatchEvent(new CustomEvent('open-account-modal'));
              }
              function mount(){
                btn = document.getElementById('modal-open');
                if(btn){ btn.addEventListener('click', openModal); }
              }
              document.addEventListener('DOMContentLoaded', mount);
              mount();
            })();
          `,
        }}
      />
    </>
  );
}
