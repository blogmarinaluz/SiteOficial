import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

export const metadata = {
  title: "Ofertas — proStore",
  description:
    "Seleção de ofertas com 30% OFF no carrinho. Boleto para negativados (análise de cadastro).",
};

export default function OfertasPage() {
  // Mostra itens marcados como featured ou com tag contendo “oferta”
  const list = (products as any[]).filter((p: any) => {
    const tag = (p.tag || "").toString().toLowerCase();
    return p.featured === true || tag.includes("oferta");
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Ofertas</h1>

      {list.length === 0 ? (
        <div className="rounded-2xl border p-8 text-zinc-600">
          Nenhuma oferta ativa no momento.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
