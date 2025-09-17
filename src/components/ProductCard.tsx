// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

export type Product = {
  id: string;
  brand: "apple" | "samsung" | string;
  name: string;
  image: string; // caminho em /public ou relativo
  price: number;
  freeShipping?: boolean;
};

type Props = {
  product: Product;
};

/** Normaliza caminho para /public sem quebrar imagens existentes */
function normalizeSrc(src: string) {
  if (!src) return "/";
  return src.startsWith("/") ? src : `/${src}`;
}

export default function ProductCard({ product }: Props) {
  const { add } = useCart();
  const original = Number(product?.price) || 0;
  const promo = withCoupon(original); // 30% OFF (mesma regra já usada)
  const parcela = promo / 10;

  const brand = (product?.brand || "").toLowerCase();
  const isApple = brand === "apple" || product?.name?.toLowerCase()?.includes("iphone");
  const isSamsung = brand === "samsung" || product?.name?.toLowerCase()?.includes("galaxy");

  // Altura dinâmica do "palco" da imagem e do container do <Image />
  const imgHeightVar = isApple ? "var(--img-h-apple, 210px)"
                      : isSamsung ? "var(--img-h-samsung, 230px)"
                      : "220px";
  const imgScaleVar = isApple ? "var(--img-scale-apple, 1)"
                      : isSamsung ? "var(--img-scale-samsung, 1.22)"
                      : "1";

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="card group shadow-soft border border-zinc-200 rounded-2xl bg-white">
      {/* PALCO DA IMAGEM (altura controlada por variáveis CSS) */}
      <div className="stage relative flex items-end justify-center overflow-hidden">
        {/* badge frete grátis */}
        {product?.freeShipping && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-600 text-white text-[11px] px-2 py-0.5 shadow-sm">
            frete grátis
          </span>
        )}

        {/* skeleton shimmer enquanto a imagem carrega */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="skeleton w-20 h-20 rounded-full" aria-hidden />
          </div>
        )}

        <Link
          href={`/produto/${encodeURIComponent(product?.id ?? "")}`}
          className="block w-full"
          prefetch={false}
        >
          <div className="relative w-full" style={{ height: imgHeightVar }}>
            <Image
              src={normalizeSrc(product?.image)}
              alt={product?.name ?? "Produto"}
              fill
              // Tamanhos responsivos: no mobile ~82vw (carrossel), no desktop ~25–33vw
              sizes="(max-width: 1023px) 82vw, (max-width: 1279px) 33vw, 25vw"
              priority={false}
              draggable={false}
              className="object-contain select-none transition-transform duration-300"
              style={{ transform: `scale(${imgScaleVar})`, transformOrigin: "center bottom" } as any}
              onLoadingComplete={() => setLoaded(true)}
            />
          </div>
        </Link>
      </div>

      {/* CONTEÚDO */}
      <div className="p-3">
        <Link
          href={`/produto/${encodeURIComponent(product?.id ?? "")}`}
          className="line-clamp-2 font-medium leading-snug hover:underline"
          prefetch={false}
        >
          {product?.name ?? "Produto"}
        </Link>

        <div className="mt-2">
          <div className="text-zinc-400 text-sm line-through">
            {br(original)}
          </div>
          <div className="text-lg font-bold">
            {br(promo)}
          </div>
          <div className="text-zinc-500 text-[13px]">
            em 10x de <strong>{br(parcela)}</strong> sem juros
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            href={`/produto/${encodeURIComponent(product?.id ?? "")}`}
            className="flex-1 h-10 inline-flex items-center justify-center rounded-xl border border-zinc-300 hover:bg-zinc-50 transition text-sm"
            prefetch={false}
          >
            Ver detalhes
          </Link>
          <button
            onClick={() => add(product, 1)}
            className="flex-1 h-10 inline-flex items-center justify-center rounded-xl text-white shadow-sm transition bg-emerald-600 hover:bg-emerald-700 text-sm"
          >
            Adicionar
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Fallbacks das variáveis (caso globals.css não esteja carregado) */
        :global(:root) {
          --card-stage-h: 240px;
          --img-h-apple: 210px;
          --img-h-samsung: 230px;
          --img-scale-apple: 1;
          --img-scale-samsung: 1.22;
        }

        .stage {
          height: var(--card-stage-h, 240px);
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00));
          border-bottom: 1px solid rgba(0,0,0,0.06);
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          padding: 12px 8px 0 8px;
        }

        /* shimmer */
        .skeleton {
          position: relative;
          overflow: hidden;
          background: linear-gradient(100deg, #f1f5f9 40%, #e5e7eb 50%, #f1f5f9 60%);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (min-width: 1024px) {
          :global(:root) {
            --card-stage-h: 260px;
          }
        }
      `}</style>
    </div>
  );
}
