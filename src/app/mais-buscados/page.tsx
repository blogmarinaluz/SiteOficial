// src/app/mais-buscados/page.tsx
import products from "@/data/products.json";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  brand?: string;
  name: string;
  image?: string;
  price: number;
  popular?: boolean;
  featured?: boolean;
  freeShipping?: boolean;
  bbb?: boolean;
};

export default function MaisBuscadosPage() {
  const all = products as Product[];

  let list = all.filter((p) => p.popular === true);

  // fallback: primeiros 12 (pra nunca ficar vazio)
  if (list.length === 0) {
    list = all.slice(0, 12);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Mais buscados</h1>

      {list.length === 0 ? (
        <div className="rounded-2xl border p-6 text-zinc-600">
          Nenhum produto listado neste momento.
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
