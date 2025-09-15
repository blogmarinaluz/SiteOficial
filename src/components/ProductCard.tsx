"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

export type Product = {
  id: string;
  brand: "apple" | "samsung" | string;
  name: string;
  image: string;
  price: number;
  freeShipping?: boolean;
};

function capBrand(brand: string) {
  const b = (brand || "").toLowerCase();
  if (b === "apple") return "Apple";
  if (b === "samsung") return "Samsung";
  return brand?.charAt(0).toUpperCase() + brand?.slice(1);
}

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const { add } = useCart();

  // preços
  const original = Number(product?.price) || 0;
  const promo = withCoupon(original); // 30% OFF (sua função)
  const parcela = promo / 10;

  return (
    <div className="card relative overflow-hidden">
      {/* Selo frete grátis */}
      {product.freeShipping && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-emerald-700/30">
          Frete grátis
        </span>
      )}

      <Link href={`/produto/${product.id}`} className="group block">
        {/* Imagem */}
        <div className="mb-3 flex h-40 w-full items-center justify-center rounded-xl bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="h-36 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        {/* Título */}
        <div className="mb-1 text-xs text-zinc-500">{capBrand(product.brand)}</div>
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-900">
          {product.name}
        </h3>

        {/* Preços */}
        <div className="mt-2">
          <div className="text-[13px] text-zinc-500 line-through">{br(original)}</div>
          <div className="mt-0.5 text-[15px] font-extrabold text-emerald-700">
            A partir de {br(promo)}{" "}
            <span className="font-normal text-zinc-700">no pix ou boleto</span>
          </div>

          {/* Cartão + parcelamento */}
          <div className="mt-1 flex items-center gap-2 text-[13px] text-zinc-700">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
              <path d="M2.5 9.5h19" />
            </svg>
            <span>
              ou {br(promo)} em até{" "}
              <strong className="font-semibold">10x de {br(parcela)}</strong> sem juros
            </span>
          </div>
        </div>
      </Link>

      {/* Ações – sem classes globais, 100% na sua paleta */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          href={`/produto/${product.id}`}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
        >
          Ver detalhes
        </Link>

        <button
          onClick={() => add(product, 1)}
          className="inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-white shadow-sm transition bg-emerald-600 hover:bg-emerald-700"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
