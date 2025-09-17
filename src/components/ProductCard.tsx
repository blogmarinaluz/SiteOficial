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

  return (
    <div className="card group shadow-soft border border-zinc-200 rounded-2xl bg-white">
      {/* PALCO DA IMAGEM (altura controlada por variáveis CSS) */}
      <div className="stage relative flex items-end justify-center">
        {/* badge frete grátis */}
        {product?.freeShipping && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-600 text-white text-[11px] px-2 py-0.5 shadow-sm">
            frete grátis
          </span>
        )}

        <Link
          href={`/produto/${encodeURIComponent(product?.id ?? "")}`}
          className="block w-full"
          prefetch={false}
        >
          <img
            src={normalizeSrc(product?.image)}
            alt={product?.name ?? "Produto"}
            className={`mx-auto block select-none`}
            draggable={false}
          />
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
        /* Alturas e escalas com variáveis e fallbacks (funciona sem globals) */
        :global(:root) {
          --card-stage-h: 240px;
          --img-h-apple: 210px;
          --img-h-samsung: 230px;
          --img-scale-apple: 1;
          --img-scale-samsung: 1.22;
        }

        /* BBB e Destaque podem sobrescrever via globals.css:
           .ctx-bbb / .ctx-destaque já predefinidas no seu arquivo */
        .stage {
          height: var(--card-stage-h, 240px);
          background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00));
          border-bottom: 1px solid rgba(0,0,0,0.06);
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          padding: 12px 8px 0 8px;
        }

        img {
          height: ${isApple ? "var(--img-h-apple, 210px)" : isSamsung ? "var(--img-h-samsung, 230px)" : "220px"};
          width: auto;
          transform: scale(${isApple ? "var(--img-scale-apple, 1)" : isSamsung ? "var(--img-scale-samsung, 1.22)" : "1"});
          transform-origin: center bottom;
          image-rendering: -webkit-optimize-contrast;
        }

        @media (min-width: 1024px) {
          :global(:root) {
            --card-stage-h: 260px;
          }
          img {
            height: ${isApple ? "calc(var(--img-h-apple, 210px) + 16px)" : isSamsung ? "calc(var(--img-h-samsung, 230px) + 16px)" : "236px"};
          }
        }
      `}</style>
    </div>
  );
}

