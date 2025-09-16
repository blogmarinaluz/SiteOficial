// src/components/ProductCard.tsx
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
  return brand?.[0]?.toUpperCase() + brand?.slice(1);
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const price = product.price ?? 0;
  const promo = withCoupon(price, 0.3); // 30% OFF
  const parcela = Math.ceil((promo || 0) / 10);

  return (
    <div className="relative rounded-2xl border bg-white p-3 transition hover:shadow-sm">
      {product.freeShipping && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-emerald-700/30">
          Frete grátis
        </span>
      )}

      {/* CARD LINK (imagem + textos) */}
      <Link href={`/produto/${product.id}`} className="group block">
        {/* IMAGEM com palco fixo (controlado por CSS var) */}
        <div className="mb-3">
          <div className="w-full rounded-xl bg-white ring-1 ring-zinc-200 p-2">
            <div
              className="w-full flex items-center justify-center overflow-hidden"
              style={{ height: "var(--card-stage-h, 240px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image?.startsWith("/") ? product.image : `/${product.image}`}
                alt={product.name}
                loading="lazy"
                decoding="async"
                style={{
                  height: "var(--img-h-apple, 220px)",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>

        {/* TEXTOS */}
        <div className="space-y-1">
          {!!product.brand && (
            <div className="text-xs uppercase text-zinc-500">{capBrand(product.brand)}</div>
          )}
          <div className="text-sm font-semibold text-zinc-900">{product.name}</div>

          <div className="text-sm text-zinc-600">
            <svg
              className="mr-1 inline-block align-[-2px]"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
              <path d="M2.5 9.5h19" />
            </svg>
            à vista por <strong className="font-semibold text-emerald-700">{br(promo)}</strong>
          </div>

          <div className="text-xs text-zinc-500">
            <svg
              className="mr-1 inline-block align-[-2px]"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
              <path d="M2.5 9.5h19" />
            </svg>
            ou 10x de <strong className="font-semibold">{br(parcela)}</strong> sem juros
          </div>
        </div>
      </Link>

      {/* AÇÕES */}
      <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Link
          href={`/produto/${product.id}`}
          className="inline-flex w-full sm:w-auto h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 shadow-sm"
          title="Ver detalhes"
        >
          Ver detalhes
        </Link>

        <button
          onClick={() => add(product, 1)}
          className="inline-flex w-full sm:w-auto h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition bg-emerald-600 hover:bg-emerald-700"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

