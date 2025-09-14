// src/app/ofertas/page.tsx
import products from "@/data/products.json";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  brand?: string;
  name: string;
  image?: string;
  price: number;
  tag?: string;
  featured?: boolean;
  freeShipping?: boolean;
  popular?: boolean;
  bbb?: boolean;
};

export default function OfertasPage() {
  const all = products as Product[];

  // ofertas explícitas (featured ou tag)
  let list = all.filter((p) => p.featured === true || !!p.tag);

  // fallback: pega os 12 mais baratos
  if (list.length === 0) {
    list = [...all].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)).slice(0, 12);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Celulares em Oferta</h1>

      {list.length === 0 ? (
        <div className="rounded-2xl border p-6 text-zinc-600">
          Nenhuma oferta ativa no momento.
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
