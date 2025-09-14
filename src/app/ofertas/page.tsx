import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

const TERMS = [
  "iphone 11", "iphone 12", "iphone 13", "iphone 14",
  "galaxy a07", "s21 fe", "s22", "s21+"
];

function mark(p: any) {
  const name = `${p.brand} ${p.name}`.toLowerCase();
  const freeShipping = ["iphone", "galaxy a07", "s21 fe", "s22"].some(t => name.includes(t));
  const featured = TERMS.some(t => name.includes(t));
  return { ...p, freeShipping, __featured: featured };
}

export default function OfertasPage() {
  const list = (products as any[]).map(mark).filter(p => p.__featured);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">Celulares em Oferta</h1>
      {list.length === 0 ? (
        <div className="border rounded-2xl p-6 text-sm text-zinc-600">
          Nenhuma oferta ativa no momento.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </main>
  );
}
