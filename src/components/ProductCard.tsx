"use client";

import Link from "next/link";
import { br, withCoupon } from "@/lib/format";
import { useCart } from "@/hooks/useCart";

type Product = {
  id: string | number;
  brand: string;         // "apple" | "samsung" | etc
  name: string;          // "iPhone 14 128GB"
  image: string;
  price: number;         // preço “tabela” (sem cupom)
  tag?: string;          // ex.: "Oferta Relâmpago", "Quinzena5"
  freeShipping?: boolean;
};

function capBrand(s: string) {
  if (!s) return s;
  const m = s.toLowerCase();
  if (m === "apple") return "Apple";
  if (m === "samsung") return "Samsung";
  return m[0].toUpperCase() + m.slice(1);
}

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();

  const brand = capBrand(p.brand);
  const pricePix = withCoupon(p.price);         // preço “no pix” com cupom 30%
  const installmentQty = 10;
  const perInstallment = p.price / installmentQty;

  return (
    <article className="relative rounded-2xl border bg-white p-3 hover:shadow-lg transition">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex gap-2">
        {p.tag && (
          <span className="rounded-full bg-orange-500/90 px-2.5 py-1 text-[11px] font-bold uppercase text-white shadow">
            {p.tag}
          </span>
        )}
        {p.freeShipping && (
          <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
            Frete Grátis
          </span>
        )}
      </div>

      {/* Imagem 1:1, centralizada e sem cortar */}
      <Link href={`/produto/${p.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 grid place-items-center">
          <img
            src={p.image}
            alt={p.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Texto */}
      <div className="mt-3 space-y-1">
        <div className="text-xs font-medium text-zinc-500">{brand}</div>
        <Link
          href={`/produto/${p.id}`}
          className="line-clamp-2 text-sm font-semibold text-zinc-900 hover:text-accent"
        >
          {p.name}
        </Link>

        {/* Preço PIX grande (destacado) */}
        <div className="mt-1 text-[11px] text-zinc-500">A partir de</div>
        <div className="text-2xl font-extrabold text-orange-600 leading-none">
          {br(pricePix)}
        </div>
        <div className="text-[11px] text-zinc-500">no pix</div>

        {/* Linha do cartão – usa o ícone /icons/card.svg se você colocar em /public */}
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-700">
          <img
            src="/icons/card.svg"
            alt=""
            className="h-4 w-4"
            onError={(e) => ((e.currentTarget.style.display = "none"))}
          />
          <span>
            Ou <b>{br(p.price)}</b> em até <b>{installmentQty}x</b> de{" "}
            <b>{br(perInstallment)}</b> s/ juros
          </span>
        </div>
      </div>

      {/* Ações claras */}
      <div className="mt-3 flex gap-2">
        <Link href={`/produto/${p.id}`} className="btn-outline flex-1 text-center">
          Ver produto
        </Link>
        <button
          className="btn-primary flex-1"
          onClick={() =>
            add({
              id: String(p.id),
              name: p.name,
              price: p.price,         // deixa o hook aplicar cupom/total
              image: p.image,
            })
          }
        >
          Adicionar
        </button>
      </div>
    </article>
  );
}
