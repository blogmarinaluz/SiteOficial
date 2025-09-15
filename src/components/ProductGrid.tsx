import ProductCard, { Product } from "./ProductCard";

type Props = {
  products?: Product[];
  items?: Product[];            // compat com código antigo
  emptyMessage?: string;        // <— faltava tipar isso
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
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {list.map((p) => (
        <ProductCard key={String(p.id)} product={p} />
      ))}
    </div>
  );
}
