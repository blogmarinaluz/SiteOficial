// src/components/MobileCarousel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: string[];
  className?: string;
};

export default function MobileCarousel({ images, className = "" }: Props) {
  const list = useMemo(
    () => Array.from(new Set((images || []).filter(Boolean))),
    [images]
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / Math.max(w, 1));
      setIdx(Math.max(0, Math.min(i, list.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [list.length]);

  function go(to: number) {
    const el = ref.current;
    if (!el) return;
    const i = Math.max(0, Math.min(to, list.length - 1));
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIdx(i);
  }

  if (!list.length) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* faixa rolável com snap */}
      <div
        ref={ref}
        className="relative w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex w-full">
          {list.map((src, i) => (
            <div
              key={i}
              className="snap-center shrink-0 w-full grid place-items-center"
              style={{ height: "var(--prod-stage-h, 320px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src.startsWith("/") ? src : `/${src}`}
                alt={`Imagem ${i + 1}`}
                loading="lazy"
                decoding="async"
                style={{
                  height: "var(--prod-img-h, 280px)",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* indicadores */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Ir para imagem ${i + 1}`}
            className={`h-2 w-2 rounded-full ${
              i === idx ? "bg-zinc-900" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
