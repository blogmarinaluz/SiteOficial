"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { br, withCoupon } from "@/lib/format";
import { useCart } from "@/hooks/useCart";

type Product = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  color?: string;
  storage?: string | number;
  freeShipping?: boolean;
};

// helpers
function stripQuery(s: string) {
  const i = s.indexOf("?");
  return i >= 0 ? s.slice(0, i) : s;
}
function stripExt(s: string) {
  return s.replace(/\.(jpg|jpeg|png|webp)$/i, "");
}
function filename(path: string) {
  const p = String(path || "");
  return p.split("/").pop() || p;
}
function productSlug(p: Product) {
  // usa id se tiver, senão cai no nome da imagem
  const base = p.id ? p.id : filename(p.image);
  return stripExt(stripQuery(base));
}
function brandLabel(b?: string) {
  const v = (b || "").toLowerCase();
  if (v === "apple") return "Apple";
  if (v === "samsung") return "Samsung";
  return b || "";
}

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const slug = productSlug(p);
  const precoPix = withCoupon(p.price);
  const parcela10 = p.price / 10;

  return (
    <article className="rounded-2xl border bg-white overflow-hidden flex flex-col hover:shadow-md transition">
      {/* área da imagem */}
      <Link href={`/produto/${encodeURIComponent(slug)}`} className="block">
        <div className="w-full aspect-[4/5] bg-white p-4">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-contain"
          />
        </div>
      </Link>

      {/* conteúdo */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="text-xs text-zinc-500">{brandLabel(p.brand)}</div>

        <Link
          href={`/produto/${encodeURIComponent(slug)}`}
          className="font-semibold leading-snug mt-0.5"
        >
          {p.name}
        </Link>

        <div className="mt-2 space-y-0.5">
          <div className="text-lg font-extrabold text-accent">
            {br(precoPix)} <span className="text-xs font-medium">no PIX</span>
          </div>
          <div className="text-xs text-zinc-500 line-through">{br(p.price)}</div>
          <div className="text-xs text-zinc-700">
            ou 10x de <b>{br(parcela10)}</b>{" "}
            <span className="text-emerald-600 font-medium">sem juros</span>
          </div>
          {p.freeShipping && (
            <div className="text-xs text-emerald-700 font-semibold">
              Frete: Grátis
            </div>
          )}
        </div>

        <button
          className="btn-primary mt-3"
          onClick={() =>
            add(
              {
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.image,
                color: p.color,
                storage: p.storage,
              },
              1
            )
          }
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Adicionar
        </button>
      </div>
    </article>
  );
}
