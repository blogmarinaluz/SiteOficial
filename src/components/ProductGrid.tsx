// src/components/ProductGrid.tsx
"use client";

import { useMemo, useRef } from "react";
import ProductCard from "./ProductCard";
import productsData from "@/data/products.json";

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

type Props = {
  products?: P[];
  limit?: number;
  /** 
   * auto = carrossel no mobile + grid no desktop (padrão)
   * carousel = força carrossel em todas as larguras
   * grid = força grade em todas as larguras
   */
  variant?: "auto" | "carousel" | "grid";
};

export default function ProductGrid({ products, limit, variant = "auto" }: Props) {
  const list = useMemo(() => {
    const base: P[] = (products && products.length ? products : (productsData as any[])) as P[];
    const arr = [...base];
    if (typeof limit === "number" && limit > 0) return arr.slice(0, limit);
    return arr;
  }, [products, limit]);

  const trackRef = useRef<HTMLDivElement>(null);

  const slide = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // largura aproximada do card (inclui gap)
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.clientWidth + 12 : el.clientWidth * 0.8;
    el.scrollTo({ left: el.scrollLeft + dir * step, behavior: "smooth" });
  };

  if (!list || list.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Nenhum produto disponível no momento.
      </div>
    );
  }

  const showCarouselEverywhere = variant === "carousel";
  const showGridEverywhere = variant === "grid";

  return (
    <div>
      {/* Carrossel (mobile por padrão; todas as larguras quando variant='carousel') */}
      <div className={["relative", showGridEverywhere ? "hidden" : "block md:hidden", showCarouselEverywhere ? "block" : ""].join(" ")}>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1" ref={trackRef}>
          {list.map((p) => (
            <div
              key={String(p?.id)}
              data-card
              className="snap-start shrink-0 w-[78vw] sm:w-[320px]"
            >
              <ProductCard product={p as any} />
            </div>
          ))}
        </div>

        {/* Controles */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
          <button
            type="button"
            onClick={() => slide(-1)}
            className="pointer-events-auto hidden h-10 w-10 -translate-x-2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow md:flex hover:bg-white"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            className="pointer-events-auto hidden h-10 w-10 translate-x-2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow md:flex hover:bg-white"
            aria-label="Próximo"
          >
            ›
          </button>
        </div>
      </div>

      {/* Grid (desktop por padrão; todas as larguras quando variant='grid') */}
      <div className={[showCarouselEverywhere ? "hidden" : "hidden md:grid", showGridEverywhere ? "grid" : ""].join(" ")} style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.75rem" }}>
        {list.map((p) => (
          <ProductCard key={String(p?.id)} product={p as any} />
        ))}
      </div>
    </div>
  );
}
