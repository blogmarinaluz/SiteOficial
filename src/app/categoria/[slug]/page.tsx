// src/app/categoria/[slug]/page.tsx
import products from "@/data/products.json";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  brand?: string;
  name: string;
  image?: string;
  price: number;
  freeShipping?: boolean;
  featured?: boolean;
  popular?: boolean;
  bbb?: boolean;
};

function titleFromSlug(slug: string) {
  const s = slug.replace(/-/g, " ").trim();
  return `Linha ${s.charAt(0).toUpperCase() + s.slice(1)}`;
}

export default function CategoriaPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (params.slug || "").toLowerCase();

  // filtro bem tolerante: brand, id e name
  const list: Product[] = (products as Product[]).filter((p) => {
    const brand = (p.brand || "").toLowerCase();
    const id = (p.id || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return (
      brand === slug ||
      id.startsWith(`${slug}_`) ||
      name.includes(slug) // garante Samsung mesmo se brand vier diferente
    );
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">{titleFromSlug(slug)}</h1>

      {list.length === 0 ? (
        <div className="rounded-2xl border p-6 text-zinc-600">
          Nenhum produto encontrado para{" "}
          <b>{titleFromSlug(slug).replace("Linha ", "")}</b>.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} p={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
