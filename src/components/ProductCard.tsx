// src/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Truck, CheckCircle } from "lucide-react";

type P = {
  id: string;
  name: string;
  brand?: string;
  image?: string;
  price?: number;     // preço base (cartão)
  oldPrice?: number;  // opcional (não usado como principal aqui)
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
  const price = Number(product?.price ?? 0); // preço no cartão
  const freeShipping = Boolean(product?.freeShipping);

  // Política: 30% OFF no Pix/Boleto em cima do preço base
  const pixPrice = useMemo(() => Math.max(0, +(price * 0.7).toFixed(2)), [price]);
  const installment = useMemo(() => Math.max(0, +(price / 10).toFixed(2)), [price]);

  const unoptimized = /\.jfif(\?|$)/i.test(image);
  const href = `/produto/${id.split(".")[0]}`;

  function addToCart() {
    if (!id) return;
    const item = { id, name, price, image, qty: 1 };
    try {
      cart?.add?.(item);
      setAdded(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setAdded(false), 1800);
    } catch {}
  };
    try {
      cart?.add?.(item);
    } catch {}
  }

  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Imagem / frame */}
      <Link href={href} className="block">
        <div className="relative w-full h-[240px] sm:h-[230px] md:h-[220px] bg-white">
          {/* Badges alinhados no topo da imagem */}
          <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-950 ring-1 ring-emerald-700/40">
              30% no Pix/Boleto
            </span>

            {freeShipping && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/30">
                <Truck className="h-3.5 w-3.5" /> Frete grátis*
              </span>
            )}
          </div>

          {/* Moldura */}
          <div className="absolute inset-3 rounded-xl bg-white ring-1 ring-neutral-200/70 shadow-[0_1px_6px_rgba(0,0,0,0.04)]" />
          {/* Área de imagem */}
          <div className="absolute inset-3 rounded-xl overflow-hidden">
            {imgOk && image ? (
              <Image
                src={image}
                alt={name || brand || "produto"}
                fill
                priority={false}
                sizes="(max-width: 768px) 80vw, 33vw"
                className="object-contain"
                unoptimized={unoptimized}
                onError={() => setImgOk(false)}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-white to-neutral-50">
                <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-700">
                  imagem indisponível
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="space-y-2 p-3">
        {brand && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            {brand}
          </span>
        )}
        <Link href={href} className="block min-h-[40px] text-sm font-semibold leading-snug text-neutral-900 hover:underline">
          {name}
        </Link>

        {/* Preços */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-emerald-700">
              {formatBRL(pixPrice)}
            </span>
            {price > pixPrice && (
              <span className="text-xs text-neutral-500 line-through">
                {formatBRL(price)}
              </span>
            )}
          </div>
          <div className="text-[12px] text-neutral-700">
            no Pix/Boleto • <span className="font-medium text-neutral-900">30% OFF</span>
          </div>
          <div className="text-[12px] text-neutral-700">
            ou <span className="font-semibold">{formatBRL(installment)}</span> x 10 sem juros no cartão
          </div>
        </div>

        {/* Ações – tamanho consistente */}
        <div className="mt-3 flex gap-2">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-emerald-600/40 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Ver detalhes
          </Link>
          <button
            type="button"
            onClick={addToCart}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            aria-label={`Adicionar ${name} ao carrinho`}
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </button>
        </div>
      </div>
    {added && (
      <div className="fixed inset-0 z-[60] pointer-events-none">
        <div role="status" aria-live="polite" className="pointer-events-auto absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-black/80 px-4 py-3 text-white shadow-lg backdrop-blur-sm">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span>Adicionado ao carrinho</span>
        </div>
      </div>
    )}
</article>
  );
}
