// src/components/ProductGalleryMobile.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt?: string;
};

function normalizeSrc(src: string) {
  if (!src) return "/";
  return src.startsWith("/") ? src : `/${src}`;
}

export default function ProductGalleryMobile({ images, alt = "Foto do produto" }: Props) {
  const list = Array.from(new Set((images || []).map(normalizeSrc)));
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const GAP = 12;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, clientWidth } = el;
      const step = clientWidth + GAP; // 1 slide por tela
      const idx = Math.round(scrollLeft / step);
      setActive(Math.max(0, Math.min(idx, Math.max(0, list.length - 1))));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [list.length]);

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="lg:hidden">
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [scroll-snap-stop:always] rounded-2xl border bg-white p-2"
      >
        {list.map((src, i) => (
          <div key={i} className="snap-start shrink-0 w-full" style={{ scrollSnapAlign: "start" }}>
            <div className="relative w-full" style={{ height: "var(--prod-stage-h, 420px)" }}>
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain select-none"
                sizes="100vw"
                priority={i === 0}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* dots */}
      {list.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {list.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-zinc-800" : "w-2 bg-zinc-300"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
