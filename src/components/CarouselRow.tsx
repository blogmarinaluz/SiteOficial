"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";

type Product = any;

export default function CarouselRow({
  title,
  items,
}: {
  title: string;
  items: Product[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const step = 320; // rolagem por clique (ajustei p/ caber 4)

  const go = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  return (
    <section className="my-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="hidden gap-2 md:flex">
          <button className="btn-outline px-3" onClick={() => go("prev")}>◀</button>
          <button className="btn-outline px-3" onClick={() => go("next")}>▶</button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {items.map((p) => (
          <div key={p.id} className="min-w-[260px] snap-start md:min-w-[300px]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
