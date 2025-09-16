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
...
const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");

const fmt = (n: number) =>
  Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

/* ========= tipos ========= */
type Product = { id: string; name: string; brand?: string; price?: number };

/* ========= extração de MODELOS diretamente do catálogo ========= */
/** iPhone 14, iPhone 14 Plus, iPhone 15 Pro Max, iPhone SE (2022)… */
function appleModelLabel(name: string): string | null {
  const m =
    name.match(/iPhone\s+(SE(?:\s*\(\d{4}\))?|\d{2}(?:\s?(?:Plus|Pro|Pro Max))?)/i)?.[0] ||
    name.match(/iPhone\s+(XR|XS Max|XS)/i)?.[0];
  return m ? m.replace(/\s+/g, " ").trim() : null;
}

/** Galaxy A14, Galaxy A07, Galaxy S21, Galaxy Z Flip, Galaxy Z Fold… */
function samsungModelLabel(name: string): string | null {
  const s1 = name.match(/Galaxy\s+Z\s+(Flip|Fold)\s*\d{0,2}/i)?.[0];
  if (s1) return s1.replace(/\s+/g, " ").trim();
  const s2 = name.match(/Galaxy\s+(A|S)\s*0?\d{1,3}/i)?.[0];
  if (s2) {
    return s2
      .replace(/(Galaxy\s+[AS]\s*)(\d{1})(?!\d)/i, (_a, p1, p2) => `${p1}0${p2}`)
      .replace(/\s+/g, " ")
      .trim();
  }
  return null;
}

function productBrand(p: Product): "apple" | "samsung" | "other" {
  const b = norm(p.brand || p.name);
  if (b.includes("apple") || b.includes("iphone")) return "apple";
  if (b.includes("samsung")) return "samsung";
  return "other";
}

function idNoExtSafe(p: Product) {
  return idNoExt(String(p.id || ""));
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();

  /* catálogo em memória */
  const catalog = useMemo<Product[]>(() => (productsData as any[]) as Product[], []);

  /* modelos Apple/Samsung apenas do que existe no catálogo */
  const appleModels = useMemo(() => {
    const set = new Set<string>();
    for (const p of catalog) {
      if (productBrand(p) !== "apple") continue;
      const label = appleModelLabel(p.name);
      if (label) set.add(label);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [catalog]);

  const samsungModels = useMemo(() => {
    const set = new Set<string>();
    for (const p of catalog) {
      if (productBrand(p) !== "samsung") continue;
      const label = samsungModelLabel(p.name);
      if (label) set.add(label);
    }
    // ordena por família: Z > S > A; depois crescente pelo número
    return Array.from(set).sort((a, b) => {
      const family = (s: string) =>
        norm(s).includes("z ") ? "Z" : norm(s).includes("galaxy s") ? "S" : "A";
      const fa = family(a), fb = family(b);
      if (fa !== fb) return fa.localeCompare(fb);
      const an = Number(a.match(/\d{1,3}/)?.[0] || 0);
      const bn = Number(b.match(/\d{1,3}/)?.[0] || 0);
      return an - bn;
    });
  }, [catalog]);

  // busca
  const [q, setQ] = useState("");
  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const term = q.trim();
    if (!term) return;
    // >>> ALTERADO: abre a página de resultados de busca
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  }

  // modal conta (Entrar)
  const [accountOpen, setAccountOpen] = useState(false);

  // dropdowns desktop
  const [openDrop, setOpenDrop] = useState<"apple" | "samsung" | null>(null);

  // scroll anchor helper (para os itens de 2ª linha)
  function scrollToOnHome(hash: string) {
    const go = () => {
      const el = document.getElementById(hash.replace("#", ""));
      const header = document.getElementById("site-header");
      const offset = (header?.offsetHeight ?? 90) + 12;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
    if (pathname !== "/") {
      router.push(`/${hash}`);
      setTimeout(go, 60);
    } else {
      go();
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDrop(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* faixa superior */}
      <div className="w-full bg-zinc-50 border-b border-zinc-200 text-[12px] ...
        {/* conteúdo omitido visualmente idêntico */}
      </div>

      <header id="site-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center gap-2 py-3">
            {/* logo */}
            <Link href="/" className="text-xl font-extrabold tracking-tight">
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
              {/* >>> ALTERADO: abre modal via estado React */}
              <button
                onClick={() => setAccountOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                title="Minha conta"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </button>

              <Link
                href="/carrinho"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                title="Carrinho"
              >
                <ShoppingCart className="h-4 w-4" />
                Carrinho
                {totalItems > 0 && (
                  <span className="ml-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                href="/ofertas"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Análise de Boleto
              </Link>
            </nav>
          </div>

          {/* linha 2 (menus) */}
          <div className="hidden md:block pb-3">
            <ul className="flex items-center gap-6 text-sm text-zinc-700">
              {/* iPhone */}
              <li
                className="relative"
                onMouseEnter={() => setOpenDrop("apple")}
                onMouseLeave={() => setOpenDrop((v) => (v === "apple" ? null : v))}
              >
                <button className="inline-flex items-center gap-1 hover:text-zinc-900">
                  iPhone <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {openDrop === "apple" && appleModels.length > 0 && (
                  <div className="absolute left-0 top-[120%] z-50 w-[560px] rounded-xl border bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2">
                      {appleModels.slice(0, 12).map((label) => (
                        <Link
                          key={label}
                          /* >>> ALTERADO: envia para resultados de busca com o modelo */
                          href={`/buscar?q=${encodeURIComponent(label)}`}
                          className="rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100"
                        >
                          {label}
                        </Link>
                      ))}
                      <Link
                        href="/buscar?q=iphone"
                        className="rounded-lg px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-zinc-50"
                      >
                        Ver todos iPhone
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

                {openDrop === "samsung" && samsungModels.length > 0 && (
                  <div className="absolute left-0 top-[120%] z-50 w-[560px] rounded-xl border bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2">
                      {samsungModels.slice(0, 14).map((label) => (
                        <Link
                          key={label}
                          /* >>> ALTERADO: envia para resultados de busca com o modelo */
                          href={`/buscar?q=${encodeURIComponent(label)}`}
                          className="rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100"
                        >
                          {label}
                        </Link>
                      ))}
                      <Link
                        href="/buscar?q=samsung"
                        className="rounded-lg px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-zinc-50"
                      >
                        Ver todos Samsung
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              {/* âncoras da home / ou páginas dedicadas */}
              <li>
                <a
                  className="hover:text-zinc-900"
                  onClick={(e) => {
                    if (pathname !== "/") {
                      e.preventDefault();
                      router.push("/mais-buscados");
                    } else {
                      e.preventDefault();
                      scrollToOnHome("#mais-buscados");
                    }
                  }}
                >
                  Mais buscados
                </a>
              </li>

              <li>
                <a
                  className="hover:text-zinc-900"
                  onClick={(e) => {
                    if (pathname !== "/") {
                      e.preventDefault();
                      router.push("/bbb-do-dia");
                    } else {
                      e.preventDefault();
                      scrollToOnHome("#bbb");
                    }
                  }}
                >
                  BBB do dia
                </a>
              </li>

              <li>
                <a
                  className="hover:text-zinc-900"
                  onClick={(e) => {
                    if (pathname !== "/") {
                      e.preventDefault();
                      router.push("/ofertas");
                    } else {
                      e.preventDefault();
                      scrollToOnHome("#destaques");
                    }
                  }}
                >
                  Ofertas em destaque
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
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}

/* ========= modal “Minha conta” ========= */
function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any | null>(null);

  const WA_NUMBER = "5599984905715"; // fixo (pedido do cliente)

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

  // ... restante do modal permanece igual (renderização, contato WhatsApp, etc.)
  return (
    <>
      {/* overlay + conteúdo do modal exatamente como já estava */}
      {/* ... */}
    </>
  );
}
