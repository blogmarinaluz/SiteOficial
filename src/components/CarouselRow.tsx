"use client";

import { ReactNode, useRef } from "react";

export default function CarouselRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w * 0.9), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
        {children}
      </div>

      <button
        aria-label="voltar"
        onClick={() => scroll(-1)}
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 bg-white border rounded-full w-10 h-10 items-center justify-center shadow"
      >
        ‹
      </button>
      <button
        aria-label="avançar"
        onClick={() => scroll(1)}
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white border rounded-full w-10 h-10 items-center justify-center shadow"
      >
        ›
      </button>
    </div>
  );
}
