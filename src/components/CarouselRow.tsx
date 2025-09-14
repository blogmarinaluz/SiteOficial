"use client";

import { useRef } from "react";

export default function CarouselRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const delta = el.clientWidth * 0.9 * dir; // rola ~90% da largura
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* seta esquerda (desktop) */}
      <button
        aria-label="Anterior"
        onClick={() => scroll(-1)}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border rounded-full px-3 py-2 shadow"
      >
        ‹
      </button>

      {/* faixa rolável */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 px-1
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.isArray(children)
          ? children.map((c, i) => (
              <div key={i} className="snap-start shrink-0">
                {c}
              </div>
            ))
          : <div className="snap-start shrink-0">{children}</div>}
      </div>

      {/* seta direita (desktop) */}
      <button
        aria-label="Próximo"
        onClick={() => scroll(1)}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border rounded-full px-3 py-2 shadow"
      >
        ›
      </button>
    </div>
  );
}
