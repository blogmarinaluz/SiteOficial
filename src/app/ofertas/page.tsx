import productsData from "@/data/products.json";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 60;

type P = any;
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();

export default function BuscarPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const term = norm(searchParams?.q);
  const data: P[] = productsData as any[];

  const items = !term
    ? []
    : data.filter((p) =>
        [p?.name, p?.brand, p?.storage, p?.color]
          .map(norm)
          .join(" ")
          .includes(term)
      );

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Resultados para: “{searchParams?.q ?? ""}”
      </h1>
      <div className="mt-6">
        <ProductGrid products={items as any[]} emptyMessage="Nenhum produto encontrado." />
      </div>
    </main>
  );
}
