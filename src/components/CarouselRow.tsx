"use client";
import { PropsWithChildren, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselRow({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  const step = 320; // quanto avança por clique

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => ref.current?.scrollBy({ left: -step, behavior: "smooth" })}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow hidden sm:flex"
        aria-label="Anterior"
      >
        <ChevronLeft />
      </button>

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
        {children}
      </div>

      <button
        type="button"
        onClick={() => ref.current?.scrollBy({ left: step, behavior: "smooth" })}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow hidden sm:flex"
        aria-label="Próximo"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
