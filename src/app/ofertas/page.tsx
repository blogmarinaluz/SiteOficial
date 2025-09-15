// src/app/ofertas/page.tsx
import productsData from "@/data/products.json";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 60;

type P = any;

const toNumber = (v: any) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d.-]/g, ""));

export default function OfertasPage() {
  const all: P[] = productsData as any[];

  // "Ofertas do dia": sua estratégia é mostrar os mais caros (30% OFF impacta mais)
  const list: P[] = [...all]
    .filter((p) => toNumber(p?.price) > 0)
    .sort((a, b) => toNumber(b?.price) - toNumber(a?.price));

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Ofertas do dia
      </h1>

      {list.length === 0 ? (
        <p className="mt-6 text-zinc-600">Nenhum produto em oferta no momento.</p>
      ) : (
        <div className="mt-6">
          <ProductGrid products={list as any[]} />
        </div>
      )}
    </main>
  );
}
