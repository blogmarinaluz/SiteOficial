// src/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Truck, Percent } from "lucide-react";

type P = {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  price?: number;
  oldPrice?: number;
  freeShipping?: boolean;
  [key: string]: any;
};

function formatBRL(v: number) {
  try {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  } catch {
    return `R$ ${Number(v || 0).toFixed(2)}`;
  }
}

export default function ProductCard({ product }: { product: P }) {
  const cart: any = useCart();
  const [imgOk, setImgOk] = useState(true);

  const id = String(product?.id ?? "");
  const name = String(product?.name ?? "");
  const brand = String(product?.brand ?? "");
  const image = String(product?.image ?? "");
  const price = Number(product?.price ?? 0);
  const oldPrice = Number(product?.oldPrice ?? 0);
  const freeShipping = Boolean(product?.freeShipping);

  // Política comercial: 30% no Pix/Boleto
  const pixPrice = useMemo(() => Math.max(0, +(price * 0.7).toFixed(2)), [price]);

  const unoptimized = /\.jfif(\?|$)/i.test(image);
  const href = `/produto/${id.split(".")[0]}`;

  function addToCart() {
    if (!id) return;
    const item = { id, name, price, image, qty: 1 };
    try {
      cart?.add?.(item);
    } catch {}
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Badges na imagem */}
      <div className="absolute left-2 top-2 z-20 flex flex-col gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2 py-1 text-[11px] font-semibold text-emerald-950 ring-1 ring-emerald-700/40">
          <Percent className="h-3 w-3" /> 30% no Pix/Boleto
        </span>
      </div>
      {freeShipping && (
        <div className="absolute right-2 top-2 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/30">
            <Truck className="h-3.5 w-3.5" /> Frete grátis*
          </span>
        </div>
      )}

      {/* Imagem do produto */}
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          {imgOk && image ? (
            <Image
              src={image}
              alt={name || brand || "produto"}
              fill
              priority={false}
              sizes="(max-width: 768px) 80vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              unoptimized={unoptimized}
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-neutral-100 to-neutral-200">
              <span className="rounded-full bg-neutral-300 px-3 py-1 text-xs text-neutral-700">
                imagem indisponível
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="space-y-2 p-3">
        {brand && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            {brand}
          </span>
        )}
        <Link href={href} className="block text-sm font-semibold leading-snug text-neutral-900 hover:underline min-h-[40px]">
          {name}
        </Link>

        {/* Preços */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-neutral-900">
              {formatBRL(price)}
            </span>
            {oldPrice > price && (
              <span className="text-xs text-neutral-500 line-through">
                {formatBRL(oldPrice)}
              </span>
            )}
          </div>
          <div className="text-[12px] text-neutral-700">
            <span className="font-semibold text-emerald-700">{formatBRL(pixPrice)}</span>{" "}
            no Pix/Boleto
          </div>
        </div>

        {/* Ações */}
        <div className="mt-3 flex gap-2">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Ver detalhes
          </Link>
          <button
            type="button"
            onClick={addToCart}
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            aria-label={`Adicionar ${name} ao carrinho`}
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
