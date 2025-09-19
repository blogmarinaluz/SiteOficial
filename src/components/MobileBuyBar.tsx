// src/components/MobileBuyBar.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useMemo } from "react";

type MobileProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
  color?: string;
  storage?: string;
  variantId?: string;
  freeShipping?: boolean;
};

interface Props {
  product: MobileProduct;
  className?: string;
}

export default function MobileBuyBar({ product, className = "" }: Props) {
  const router = useRouter();
  const { add } = useCart();

  const priceBRL = useMemo(
    () =>
      (product?.price ?? 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 2,
      }),
    [product?.price]
  );

  function onAddToCart() {
    if (!product) return;
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      storage: product.storage,
      variantId: product.variantId,
      freeShipping: product.freeShipping,
      qty: 1, // <<< quantidade aqui
    });
  }

  function onBuyNow() {
    onAddToCart();
    router.push("/checkout");
  }

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white lg:hidden ${className}`}>
      <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-4 py-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-zinc-500 leading-none">à vista</span>
          <strong className="text-lg leading-none">{priceBRL}</strong>
        </div>

        <button
          onClick={onAddToCart}
          className="ml-auto rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
          aria-label="Adicionar ao carrinho"
        >
          Adicionar
        </button>

        <button
          onClick={onBuyNow}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          aria-label="Comprar agora"
        >
          Comprar agora
        </button>
      </div>
    </div>
  );
}
