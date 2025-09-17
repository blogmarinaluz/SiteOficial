// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useMemo } from "react";

type Product = {
  id: string;
  name: string;
  brand?: string;
  price: number;
  image?: string;
  color?: string;
  storage?: string;
  variantId?: string;
  freeShipping?: boolean;
  // Campos extras (se existirem no seu JSON) não quebram
  [k: string]: any;
};

function idNoExt(id: string) {
  return String(id).replace(/\.[a-z0-9]+$/i, "");
}

function formatBRL(value: number) {
  return (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}

interface Props {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: Props) {
  const { add } = useCart();

  const href = useMemo(() => `/produto/${idNoExt(product.id)}`, [product.id]);
  const priceBRL = useMemo(() => formatBRL(product.price), [product.price]);

  const alt = useMemo(() => {
    const parts = [product.name, product.storage ? `${product.storage}GB` : "", product.color || ""]
      .filter(Boolean)
      .join(" ");
    return parts || product.name || "Produto";
  }, [product.name, product.storage, product.color]);

  function onAddToCart() {
    // AQUI o add recebe um objeto com qty
    add({
      id: String(product.id),
      name: String(product.name),
      price: Number(product.price || 0),
      image: product.image,
      color: product.color,
      storage: product.storage,
      variantId: product.variantId,
      freeShipping: product.freeShipping,
      qty: 1,
    });
  }

  return (
    <div
      className={`group rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md transition ${className}`}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[1/1] w-full overflow-hidden rounded-xl bg-zinc-50">
          {product.image ? (
            <Image
              src={product.image}
              alt={alt}
              fill
              className="object-contain transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, 300px"
              priority={false}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-zinc-400 text-sm">
              sem imagem
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 space-y-1.5">
        {product.brand && (
          <span className="inline-block text-[11px] font-medium uppercase tracking-wide text-emerald-700">
            {product.brand}
          </span>
        )}
        <Link
          href={href}
          className="line-clamp-2 font-semibold leading-snug text-zinc-900 hover:underline"
        >
          {product.name}
        </Link>

        <div className="mt-1">
          <span className="text-lg font-bold">{priceBRL}</span>
          {product.freeShipping && (
            <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              Frete grátis
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={href}
          className="h-10 flex-1 inline-flex items-center justify-center rounded-xl border border-zinc-300 text-sm font-medium hover:bg-zinc-50"
        >
          Ver detalhes
        </Link>

        <button
          onClick={onAddToCart}
          className="flex-1 h-10 inline-flex items-center justify-center rounded-xl text-white shadow-sm transition bg-emerald-600 hover:bg-emerald-700 text-sm"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
