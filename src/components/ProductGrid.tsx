// src/components/ProductGrid.tsx
import ProductCard, { Product } from "./ProductCard";

type Props = {
  products?: Product[];
  items?: Product[];            // compat com código antigo
  emptyMessage?: string;
  className?: string;
};

/**
 * Comportamento:
 * - Mobile/Tablet (até < lg): carrossel horizontal com scroll-snap (arrasta pro lado).
 * - Desktop (≥ lg): grid tradicional, igual ao que você já tinha.
 *
 * Não depende de nenhum outro componente novo.
 * Se quiser ajustar quantos cards “aparecem” por tela no mobile,
 * mude a largura do item em `flex-[0_0_82%]` (ex.: 75%, 70%).
 */
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
    <div className={className}>
      {/* MOBILE/TABLET: carrossel horizontal */}
      <div className="lg:hidden">
        <div
          className="
            flex gap-4 overflow-x-auto px-4 pb-2
            snap-x snap-mandatory
            [-webkit-overflow-scrolling:touch]
            [scrollbar-width:none]
          "
          // Oculta a barra no Chrome/Safari
          style={{ msOverflowStyle: "none" } as any}
        >
          {/* Chrome/Safari: esconder scrollbar */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {list.map((p) => (
            <div
              key={String(p.id)}
              className="
                flex-[0_0_82%] snap-start
              "
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
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
