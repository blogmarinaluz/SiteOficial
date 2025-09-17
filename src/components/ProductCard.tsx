// src/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

type P = {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  price?: number;
  oldPrice?: number;
  variantId?: string;
  freeShipping?: boolean;
  [key: string]: any;
};

export default function ProductCard({ product }: { product: P }) {
  const cart: any = useCart();
  const [imgOk, setImgOk] = useState(true);

  const id = String(product?.id ?? "");
  const name = String(product?.name ?? "");
  const image = String(product?.image ?? "");
  const price = Number(product?.price ?? 0);

  // Next não otimiza .jfif — servir sem optimizer
  const unoptimized = /\.jfif(\?|$)/i.test(image);

  function addToCart() {
    if (!id) return;
    // Enviar somente campos que com certeza existem em CartItem
    const item = {
      id,
      name,
      price,
      image,
      // qty é aceito como opcional em Omit<CartItem, 'qty'> & { qty?: number }
      qty: 1,
    };
    try {
      cart?.add?.(item);
    } catch {}
  }

  const href = `/produto/${id.split(".")[0]}`;

  return (
    <article className="group rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100">
          {imgOk && image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 80vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              priority={false}
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

      <div className="mt-3 space-y-1.5">
        {product?.brand && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            {product.brand}
          </span>
        )}
        <Link href={href} className="block text-sm font-semibold text-neutral-900 hover:underline">
          {name}
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-neutral-900">
            {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
          {product?.oldPrice && product.oldPrice > price && (
            <span className="text-xs text-neutral-500 line-through">
              {Number(product.oldPrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          )}
        </div>

        {product?.freeShipping && (
          <div className="text-[11px] font-medium text-emerald-700">Frete grátis*</div>
        )}

        <div className="mt-2 flex gap-2">
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
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
