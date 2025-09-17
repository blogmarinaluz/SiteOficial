// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useMemo, useState } from "react";

export type Product = {
  id: string;
  name: string;
  brand?: string;
  price: number;
  image?: string;
  color?: string;
  storage?: string;
  model?: string;
  variantId?: string;
  freeShipping?: boolean;
};

const idNoExt = (id: string) => String(id).split(".")[0];

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", {
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
  const [imgOk, setImgOk] = useState(true);

  const href = useMemo(() => `/produto/${idNoExt(product.id)}`, [product.id]);
  const priceBRL = useMemo(() => formatBRL(product.price), [product.price]);

  const alt = useMemo(() => {
    const parts = [product.name, product.storage ? `${product.storage}GB` : "", product.color || ""]
      .filter(Boolean)
      .join(" ");
    return parts || product.name || "Produto";
  }, [product.name, product.storage, product.color]);

  function onAddToCart() {
    add({
      id: String(product.id),
      name: String(product.name),
      price: Number(product.price || 0),
      image: product.image,
      color: product.color,
      model: product.model,
      variantId: product.variantId,
      freeShipping: product.freeShipping,
      qty: 1,
    });
  }

  return (
    <div className={`group rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md transition ${className}`}>
      <Link href={href} className="block">
        <div className="relative aspect-[1/1] w-full overflow-hidden rounded-xl bg-zinc-50">
          {product.image && imgOk ? (
            <Image
              src={product.image}
              alt={alt}
              fill
              className="object-contain transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 50vw, 300px"
              priority={false}
              // Importante: evita o otimizador do Next (que não reconhece .jfif)
              unoptimized
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 text-xs text-neutral-500">
              sem imagem
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 space-y-1.5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
          {String(product.brand || "").toUpperCase()}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900">{product.name}</h3>
        <div className="text-lg font-extrabold text-zinc-900">{priceBRL}</div>

        <div className="text-[11px] text-zinc-500">
          {product.storage ? <span className="mr-1">{product.storage}GB</span> : null}
          {product.color ? <span>• {product.color}</span> : null}
          {product.freeShipping && (
            <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-200">
              frete grátis
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
          type="button"
          onClick={onAddToCart}
          className="h-10 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
