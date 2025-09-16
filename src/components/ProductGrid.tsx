// src/components/ProductGrid.tsx
import Link from "next/link";
import type { Product } from "./ProductCard";

type Props = {
  products?: Product[];
  items?: Product[];
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

  if (!list || list.length === 0) {
    return <p className="mt-6 text-zinc-600">{emptyMessage}</p>;
  }

  return (
    <div className={`mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {list.map((p) => (
        <Link
          key={p.id}
          href={`/produto/${p.id}`}
          className="rounded-2xl border bg-white p-3 hover:shadow-sm transition"
        >
          <div className="w-full rounded-xl bg-white ring-1 ring-zinc-200 p-2">
            <div
              className="w-full flex items-center justify-center overflow-hidden"
              style={{ height: "var(--card-stage-h, 240px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image.startsWith("/") ? p.image : `/${p.image}`}
                alt={p.name}
                loading="lazy"
                decoding="async"
                style={{
                  height: "var(--img-h-apple, 220px)",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <div className="text-xs uppercase text-zinc-500">{p.brand}</div>
            <div className="text-sm font-semibold text-zinc-900">{p.name}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
