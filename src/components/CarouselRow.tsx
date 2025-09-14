// src/components/CarouselRow.tsx — COMPLETO
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  children: React.ReactNode; // <— necessário para usar <CarouselRow>...</CarouselRow>
  className?: string;
};

export default function CarouselRow({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  function scrollBy(dx: number) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  }

  return (
    <div className={`relative ${className}`}>
      {/* trilho */}
      <div
        ref={ref}
        className="overflow-x-auto no-scrollbar scroll-smooth"
      >
        <div className="flex gap-4 pr-6">{children}</div>
      </div>

      {/* botões */}
      <button
        type="button"
        aria-label="Anterior"
        onClick={() => scrollBy(-320)}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white shadow hover:bg-zinc-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Próximo"
        onClick={() => scrollBy(320)}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white shadow hover:bg-zinc-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* util: esconder barra de rolagem (coloque no seu globals.css se ainda não tiver)
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/

