import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

const POPULAR = ["iphone 14", "iphone 13", "s21 fe", "s22"];

function mark(p: any) {
  const name = `${p.brand} ${p.name}`.toLowerCase();
  const popular = POPULAR.some(t => name.includes(t));
  const freeShipping = popular;
  return { ...p, freeShipping, __popular: popular };
}

export default function MaisBuscadosPage() {
  const list = (products as any[]).map(mark).filter(p => p.__popular);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">Mais buscados</h1>
      {list.length === 0 ? (
        <div className="border rounded-2xl p-6 text-sm text-zinc-600">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </main>
  );
}
