// src/app/mais-buscados/page.tsx
import productsData from "@/data/products.json";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 60;

type P = any;

const toNumber = (v: any) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d.-]/g, ""));

export default function MaisBuscadosPage() {
  const all: P[] = productsData as any[];

  // Heurística simples para "mais buscados": ordena pelos mais caros (tende a ser o que a galera procura)
  // e pega os 12 primeiros. Ajustamos fácil depois se você quiser outra lógica.
  const list: P[] = [...all].sort((a, b) => toNumber(b?.price) - toNumber(a?.price)).slice(0, 12);

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Mais buscados
      </h1>

      {list.length === 0 ? (
        <p className="mt-6 text-zinc-600">Nenhum produto encontrado.</p>
      ) : (
        <div className="mt-6">
          <ProductGrid products={list as any[]} />
        </div>
      )}
    </main>
  );
}
