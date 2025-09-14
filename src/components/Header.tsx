"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, User, ChevronDown, Search } from "lucide-react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";

/** Pega o "nome base" do modelo (sem GB/cor) */
function baseModelName(p: any) {
  if (p.model_base) return String(p.model_base);
  if (p.model_key) {
    // Ex.: "iphone 14" já serve p/ buscar todas as variações
    return String(p.model_key).replace(/_/g, " ");
  }
  let s = String(p.name || "");
  s = s.replace(/\b(64|128|256|512|1024|1tb)\s*gb?\b/gi, ""); // remove GB
  s = s.replace(/\s-\s.*$/g, ""); // remove “- cor …”
  return s.trim();
}
/** Chave de agrupamento (modelo) */
function modelKey(p: any) {
  return (p.model_key || baseModelName(p)).toLowerCase().trim();
}
/** Únicos por modelo */
function uniqueModels(list: any[]) {
  const map = new Map<string, any>();
  for (const p of list) {
    const k = modelKey(p);
    if (!map.has(k)) map.set(k, p);
  }
  return Array.from(map.values());
}

export function Header() {
  const [q, setQ] = useState("");
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  const appleModels = useMemo(() => {
    const arr = (products as any[]).filter(
      (p) => String(p.brand || "").toLowerCase() === "apple"
    );
    return uniqueModels(arr)
      .map((p) => ({ label: baseModelName(p), q: modelKey(p) }))
      .slice(0, 14);
  }, []);

  const samsungModels = useMemo(() => {
    const arr = (products as any[]).filter(
      (p) => String(p.brand || "").toLowerCase() === "samsung"
    );
    return uniqueModels(arr)
      .map((p) => ({ label: baseModelName(p), q: modelKey(p) }))
      .slice(0, 14);
  }, []);

  // Dropdown que não some
  const [open, setOpen] = useState<null | "apple" | "samsung">(null);
  let timer: any;
  function onEnter(k: "apple" | "samsung") {
    clearTimeout(timer);
    setOpen(k);
  }
  function onLeave() {
    clearTimeout(timer);
    timer = setTimeout(() => setOpen(null), 140);
  }
  useEffect(() => () => clearTimeout(timer), []);

  return (
    <header className="header">
      <div className="container py-4 flex items-center gap-4">
        {/* Marca com S maiúsculo */}
        <Link href="/" className="text-2xl font-extrabold text-accent tracking-tight">
          proStore
        </Link>

        <nav className="hidden md:flex gap-6">
          {/* APPLE */}
          <div
            className="relative"
            onMouseEnter={() => onEnter("apple")}
            onMouseLeave={onLeave}
          >
            <button className="menu-link flex items-center gap-1">
              Apple <ChevronDown className="w-4 h-4" />
            </button>
            {open === "apple" && (
              <div
                className="absolute left-0 mt-2 bg-white border rounded-2xl shadow-lg p-3 w-[22rem] z-50"
                onMouseEnter={() => onEnter("apple")}
                onMouseLeave={onLeave}
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {appleModels.map((m) => (
                    <Link
                      key={m.q}
                      href={`/buscar?q=${encodeURIComponent(m.q)}`}
                      className="hover:text-accent"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SAMSUNG */}
          <div
            className="relative"
            onMouseEnter={() => onEnter("samsung")}
            onMouseLeave={onLeave}
          >
            <button className="menu-link flex items-center gap-1">
              Samsung <ChevronDown className="w-4 h-4" />
            </button>
            {open === "samsung" && (
              <div
                className="absolute left-0 mt-2 bg-white border rounded-2xl shadow-lg p-3 w-[22rem] z-50"
                onMouseEnter={() => onEnter("samsung")}
                onMouseLeave={onLeave}
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {samsungModels.map((m) => (
                    <Link
                      key={m.q}
                      href={`/buscar?q=${encodeURIComponent(m.q)}`}
                      className="hover:text-accent"
                    >
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link className="menu-link" href="/central-de-ajuda">Suporte</Link>
          <Link className="menu-link" href="/faq">FAQ</Link>
        </nav>

        {/* BUSCA compacta e alinhada */}
        <form action="/buscar" className="ml-auto flex-1 flex max-w-xl">
          <div className="w-full flex items-center border border-zinc-300 rounded-2xl overflow-hidden">
            <Search className="w-5 h-5 ml-3 text-zinc-500" />
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busque iPhone, Galaxy..."
              className="w-full px-3 py-2 outline-none"
            />
            <button className="btn-primary rounded-none rounded-r-2xl px-4">
              Buscar
            </button>
          </div>
        </form>

        <Link className="btn-outline relative hidden sm:inline-flex" href="/minha-conta">
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

      {/* BARRA DE AVISO melhoradinha, com pulso no cupom */}
      <div className="bg-accent text-white">
        <div className="container py-2 text-sm flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-white animate-ping" />
          <span>
            Cupom ativo: <b className="animate-pulse">30% OFF</b> aplicado no carrinho ·
            &nbsp;Boleto para negativados (análise de cadastro).
          </span>
        </div>
      </div>
    </header>
  );
}
