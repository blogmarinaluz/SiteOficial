import ProductCard, { Product } from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
