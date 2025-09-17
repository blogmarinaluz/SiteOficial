// src/components/ProductGrid.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard, { Product } from "./ProductCard";

type Props = {
  products?: Product[];
  items?: Product[];            // compat com código antigo
  emptyMessage?: string;
  className?: string;
};

export default function ProductGrid({
  products,
  items,
  emptyMessage = "Nenhum produto encontrado.",
  className = "",
}: Props) {
  const list: Product[] = (products ?? items ?? []) as Product[];

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [active, setActive] = useState(0);

  const GAP = 16; // px — manter em sincronia com 'gap-4'
  const ITEM_RATIO = 0.82; // 82% da largura da viewport do track

  const calcStep = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const item = el.querySelector<HTMLElement>("[data-item]");
    return (item?.offsetWidth ?? Math.ceil(el.clientWidth * ITEM_RATIO)) + GAP;
  };

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 8);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 8);

    const step = calcStep();
    if (step > 0) {
      const idx = Math.round(scrollLeft / step);
      setActive(Math.min(Math.max(idx, 0), Math.max(0, list.length - 1)));
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [list.length]);

  // Dica "Deslize →" somente uma vez por sessão e apenas em telas pequenas
  useEffect(() => {
    try {
      const isSmall = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
      const already = typeof window !== "undefined" ? sessionStorage.getItem("swipeHintShown") === "1" : true;
      if (isSmall && !already && canRight) {
        setShowHint(true);
        sessionStorage.setItem("swipeHintShown", "1");
        const t = setTimeout(() => setShowHint(false), 2200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, [canRight]);

  const scrollByOne = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = calcStep();
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!list || list.length === 0) {
    return <p className="mt-6 text-zinc-600">{emptyMessage}</p>;
  }

  const showDots = list.length > 1 && list.length <= 8;

  return (
    <div className={className}>
      {/* MOBILE/TABLET: carrossel horizontal com setas, gradientes e dots */}
      <div className="relative lg:hidden">
        {/* dica de swipe */}
        {showHint && canRight && (
          <div className="pointer-events-none absolute bottom-14 right-6 z-30 animate-pulse text-[13px] font-medium text-zinc-700">
            <div className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 shadow-sm border border-zinc-200">
              Deslize
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}

        {/* botões de navegação (apenas se houver overflow) */}
        {canLeft && (
          <button
            aria-label="Anterior"
            onClick={() => scrollByOne(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 shadow-sm border border-zinc-200"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" className="mx-auto">
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {canRight && (
          <button
            aria-label="Próximo"
            onClick={() => scrollByOne(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 shadow-sm border border-zinc-200"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" className="mx-auto">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* gradientes nas bordas para indicar overflow */}
        {canLeft && <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-white to-white/0" />}
        {canRight && <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-white to-white/0" />}

        <div
          ref={trackRef}
          role="listbox"
          aria-label="Lista de produtos"
          className="
            flex gap-4 overflow-x-auto px-4 pb-2 pt-1
            snap-x snap-mandatory
            no-scrollbar
            [-webkit-overflow-scrolling:touch]
            [scroll-snap-stop:always]
          "
        >
          {list.map((p, i) => (
            <div
              key={String(p.id)}
              data-item
              className="flex-[0_0_82%] snap-start"
              role="option"
              aria-label={p?.name}
              aria-selected={i === active}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Dots indicadores (apenas quando poucos itens, para não poluir) */}
        {showDots && (
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {Array.from({ length: list.length }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-zinc-800" : "w-2 bg-zinc-300"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP: grid como antes */}
      <div
        className="
          hidden lg:grid gap-6
          lg:grid-cols-3 xl:grid-cols-4
        "
      >
        {list.map((p) => (
          <ProductCard key={String(p.id)} product={p} />
        ))}
      </div>
    </div>
  );
}
