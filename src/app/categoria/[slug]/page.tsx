// src/app/categoria/[slug]/page.tsx
import productsData from "@/data/products.json";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

type Params = { slug: string };
type P = any;

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const brandLabel = (slug: string) =>
  slug === "apple" ? "Apple" : slug === "samsung" ? "Samsung" : slug;

export default function CategoryPage({ params }: { params: Params }) {
  const slug = norm(params.slug);

  // filtra por marca (o JSON usa "apple" | "samsung")
  const all: P[] = productsData as any[];
  const list = all.filter((p) => norm(p.brand) === slug);

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        {brandLabel(slug)}
      </h1>

      {list.length === 0 ? (
        <p className="mt-6 text-zinc-600">
          Nenhum produto encontrado para esta categoria.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={String(p.id)} product={p as any} />
          ))}
        </div>
      )}
    </main>
  );
}
