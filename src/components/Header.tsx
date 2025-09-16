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
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

type Product = {
  id: string;
  name: string;
  brand?: string;
  price: number;
  pricePromo?: number;
  image: string;
};

function appleModelLabel(name: string): string | null {
  const m =
    name
      ?.normalize("NFKD")
      ?.replace(/[\u0300-\u036f]/g, "")
      ?.match(/iphone\s*(se|\d{2,4}\s*(plus|pro|max|pro\s*max)?)?/i) || null;
  if (!m) return null;
  return (m[0] || "")
    .replace(/\s+/g, " ")
    .replace(/\s+(pro\s*max)$/, " Pro Max")
    .replace(/\s+(pro)$/, " Pro")
    .replace(/\s+(max)$/, " Max")
    .replace(/\s+(plus)$/, " Plus")
    .replace(/\bse\b$/, "SE")
    .replace(/\biphone\b/i, "iPhone")
    .trim();
}

/* === tolera brand com erro "samsumg" === */
function productBrand(p: Product): "apple" | "samsung" | "other" {
  const s = `${p.brand || ""} ${p.name || ""}`
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (s.includes("apple") || s.includes("iphone")) return "apple";
  if (s.includes("samsung") || s.includes("galaxy") || s.includes("samsumg")) return "samsung";
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
            <div className="text-sm text-zinc-700 mb-1">Acompanhar pedido</div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Código do pedido"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                onClick={buscar}
              >
                Buscar
              </button>
            </div>
            {result === null ? (
              <p className="text-xs text-zinc-500 mt-2">Nenhum pedido encontrado.</p>
            ) : result ? (
              <div className="mt-3 text-sm rounded-xl border p-3">
                <div><b>Código:</b> {result.code}</div>
                <div><b>Status:</b> {result.status}</div>
              </div>
            ) : null}
          </div>

          <div className="pt-2 border-t">
            <a
              href={whatsappUrl()}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com atendimento
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= header ========= */
export default function Header() {
  /* >>>>>> ADIÇÃO: controla só o modal "Minha conta" <<<<<< */
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  /* >>>>>> FIM DA ADIÇÃO <<<<<< */

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
    (catalog || []).forEach((p) => {
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
    (catalog || []).forEach((p) => {
      if (productBrand(p) !== "samsung") return;
      const s = (p.name || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      const fam = s.match(/galaxy\s*([a-z]+)\s*\d+/i)?.[1] || s.match(/galaxy\s*(s|a|m|z)/i)?.[1];
      if (fam) set.add(fam.toUpperCase());
    });
    return Array.from(set).sort();
  }, [catalog]);

  const [openDrop, setOpenDrop] = useState<"iphone" | "samsung" | null>(null);

  return (
    <>
      <header className="sticky top-0 z-[80] border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 lg:px-6">
          <div className="flex items-center gap-2 py-3">
            <button className="lg:hidden rounded-xl border border-zinc-300 p-2" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 font-bold text-zinc-900">
              <span className="inline-block rounded-lg bg-emerald-600 px-2 py-1 text-white">PROSTORE</span>
            </Link>

            <div className="ml-auto hidden lg:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.currentTarget.querySelector<HTMLInputElement>("#q")?.value || "").trim();
                  if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
                }}
                className="relative"
              >
                <div className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5">
                  <Search className="h-4 w-4 text-zinc-500" />
                  <input
                    id="q"
                    name="q"
                    className="w-[420px] outline-none text-sm"
                    placeholder="Buscar produtos…"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Buscar
                  </button>
                </div>
              </form>
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setIsAccountModalOpen(true)} {/* >>>>>> ADIÇÃO: abre o modal <<<<<< */}
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
                <span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white grid place-items-center">
                  {count}
                </span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-3 lg:px-6">
            <ul className="flex items-center gap-4 py-2 text-sm text-zinc-700">
              <li
                className="relative"
                onMouseEnter={() => setOpenDrop("iphone")}
                onMouseLeave={() => setOpenDrop((v) => (v === "iphone" ? null : v))}
              >
                <button className="inline-flex items-center gap-1 hover:text-zinc-900">
                  iPhone <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {openDrop === "iphone" && (
                  <div className="absolute left-0 top-[120%] z-50 w-[560px] rounded-xl border bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2">
                      {appleModels.map((m) => (
                        <Link
                          key={m}
                          href={`/buscar?q=${encodeURIComponent(m)}`}
                          className="flex items-center justify-between rounded-xl border px-3 py-2 hover:bg-zinc-50"
                        >
                          <span>{m}</span>
                          <ChevronRight className="h-4 w-4 text-zinc-500" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

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
                        <Link
                          key={label}
                          href={`/buscar?q=${encodeURIComponent(`Galaxy ${label}`)}`}
                          className="flex items-center justify-between rounded-xl border px-3 py-2 hover:bg-zinc-50"
                        >
                          <span>Galaxy {label}</span>
                          <ChevronRight className="h-4 w-4 text-zinc-500" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              <li>
                <a className="hover:text-zinc-900" href="/#venda-segura">
                  <ShieldCheck className="inline h-4 w-4 mr-1" /> Compra segura
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="/#ofertas">
                  <Percent className="inline h-4 w-4 mr-1" /> Ofertas
                </a>
              </li>
              <li>
                <a className="hover:text-zinc-900" href="/#frete">
                  <Truck className="inline h-4 w-4 mr-1" /> Frete grátis
                </a>
              </li>

              <li className="ml-auto">
                <Link href="/checkout" className="hover:text-zinc-900">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* modal (fora do header para não cortar o overlay) */}
      <AccountModal open={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
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
