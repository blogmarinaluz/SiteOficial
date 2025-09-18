"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import productsData from "@/data/products.json";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Menu,
  X,
  ShieldCheck,
  Truck,
  Search,
  ShoppingCart,
} from "lucide-react";

type Product = { id: string; name: string; brand?: string; price?: number };

const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const idNoExt = (id: string) => String(id).split(".")[0];
const catalog: Product[] = (productsData as Product[]) ?? [];

const NAV = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/contato", label: "Contato" },
];

const CATEGORIES = [
  { href: "/categorias/iphone", label: "iPhone" },
  { href: "/categorias/samsung", label: "Samsung Galaxy" },
  { href: "/categorias/xiaomi", label: "Xiaomi" },
  { href: "/categorias/acessorios", label: "Acessórios" },
  { href: "/categorias/wearables", label: "Wearables" },
  { href: "/categorias/casa-inteligente", label: "Casa inteligente" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cart: any = useCart();
  const rawCount = cart?.count;
  const count =
    typeof rawCount === "function"
      ? Number(rawCount() ?? 0)
      : Number(rawCount ?? 0);

  function submitSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const r = catalog.filter(
      (p) =>
        norm(p.name).includes(norm(term)) ||
        norm(p.brand).includes(norm(term))
    );
    if (r[0]) router.push(`/produto/${idNoExt(r[0].id)}`);
    else router.push(`/buscar?q=${encodeURIComponent(term)}`);
    setOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-50 bg-brand-gradient text-white shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Barra de avisos */}
      <div className="w-full border-b border-white/10 text-[11px] sm:text-[12px]">
        <div className="container-safe flex items-center justify-center gap-4 overflow-x-auto whitespace-nowrap py-1.5 scrollbar-none">
          <span className="inline-flex items-center gap-1.5 text-white/90">
            <strong className="font-semibold">30% OFF</strong> no boleto e Pix
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/90">
            <Truck className="h-3.5 w-3.5" /> Frete grátis*
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/90">
            <ShieldCheck className="h-3.5 w-3.5" /> 90 dias de garantia
          </span>
        </div>
      </div>

      {/* Navegação principal */}
      <div className="container-safe flex items-center gap-3 py-2.5 sm:py-3">
        {/* Menu mobile */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-2xl p-2 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-extrabold tracking-tight text-white text-3xl sm:text-4xl leading-none"
          aria-label="Ir para a página inicial"
        >
          pro<span className="text-accent">Store</span>
        </Link>

        {/* Navegação desktop */}
        <nav
          className="ml-2 hidden items-center gap-1 lg:flex"
          aria-label="Primária"
        >
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white/10" : "hover:bg-white/5",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Busca desktop */}
        <form
          onSubmit={submitSearch}
          className="ml-auto hidden min-w-[320px] max-w-lg flex-1 md:block"
          aria-label="Busca"
        >
          <div className="flex w-full items-center rounded-2xl border border-white/10 bg-white/10 p-1.5 backdrop-blur">
            <Search className="mx-2 h-4 w-4 text-white/70" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por modelo, marca..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
              aria-label="Buscar produtos"
            />
            <button
              type="submit"
              className="btn btn-primary rounded-2xl px-4 py-1.5 text-sm"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Ações: auth + carrinho */}
        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <SignedOut>
            <SignInButton mode="redirect">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm hover:bg-white/5">
                Entrar / Cadastrar
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard:
                    "rounded-2xl border shadow-xl",
                },
              }}
            />
          </SignedIn>

          <Link
            href="/carrinho"
            className="relative inline-flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm font-medium hover:bg-white/5"
            title="Meu carrinho"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-fg">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Drawer Mobile */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="mobile-drawer"
            className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-xs bg-white text-black shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
              <Link
                href="/"
                className="font-extrabold tracking-tight text-3xl leading-none"
                onClick={() => setOpen(false)}
                aria-label="Ir para a página inicial"
              >
                pro<span className="text-[#10b981]">Store</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl p-2 hover:bg-black/5"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="px-2 py-2"
              aria-label="Primária (mobile)"
            >
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block rounded-2xl px-3 py-3 text-base",
                      active ? "bg-black/5" : "hover:bg-black/5",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-2 border-t border-black/10 px-2 pt-2">
              <SignedOut>
                <SignInButton mode="redirect">
                  <button className="btn btn-primary w-full rounded-2xl">
                    Entrar / Cadastrar
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/minha-conta"
                  onClick={() => setOpen(false)}
                  className="btn w-full rounded-2xl border border-black/10 bg-white hover:bg-black/5"
                >
                  Minha conta
                </Link>
              </SignedIn>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
