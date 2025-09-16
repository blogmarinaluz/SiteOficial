"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

export type Product = {
  id: string;
  brand: "apple" | "samsung" | string;
  name: string;
  image: string; // pode ser "/public/..." ou remoto permitido no next.config
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

  const original = Number(product?.price) || 0;
  const promo = withCoupon(original); // 30% OFF
  const parcela = promo / 10;

  const isSamsung = (product?.brand || "").toLowerCase() === "samsung";

  return (
    <div className="card relative overflow-hidden">
      {product.freeShipping && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-600/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-emerald-700/30">
          Frete grátis
        </span>
      )}

      <Link href={`/produto/${product.id}`} className="group block">
        {/* ====== IMAGEM (palco com altura fixa via CSS var para manter layout) ====== */}
        <div className="mb-3">
          <div className="w-full rounded-xl bg-white ring-1 ring-zinc-200 p-2">
            {/* palco fixo; por padrão 240px (pode ser sobrescrito por seção via --card-stage-h) */}
            <div
              className="relative w-full flex items-center justify-center overflow-hidden"
              style={{ height: "var(--card-stage-h, 240px)" }}
            >
              {/* next/image com fill para manter responsividade e evitar CLS */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                // Tamanhos responsivos (mobile primeiro):
                // - até 640px: a imagem ocupa ~50vw (2 cards por linha)
                // - até 1024px: ~33vw (3 cards)
                // - acima: ~25vw (4 cards)
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain"
                // Escalas diferentes conforme a marca, mantendo o visual aprovado
                style={{
                  transform: isSamsung
                    ? "scale(var(--img-scale-samsung, 1.22))"
                    : "scale(var(--img-scale-apple, 1))",
                }}
                priority={false}
              />
            </div>
          </div>
        </div>
        {/* ========================================================== */}

        <div className="px-0">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
            {capBrand(product.brand)}
          </div>

          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:underline group-hover:underline-offset-2">
            {product.name}
          </h3>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-zinc-900">{br(promo)}</span>
              <span className="text-sm text-zinc-500 line-through">{br(original)}</span>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                30% OFF
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-zinc-700">
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
        </div>
      </Link>

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
