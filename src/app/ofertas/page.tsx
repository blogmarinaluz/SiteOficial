import productsData from "@/data/products.json";
import ProductGrid from "@/components/ProductGrid";
import { withCoupon } from "@/lib/format";

export const revalidate = 60;

type P = any;
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();

export default function OfertasPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const term = norm(searchParams?.q);
  const data: P[] = productsData as any[];

  let items: P[] = [];

  if (term) {
    // ✅ MODO BUSCA (mantém seu comportamento)
    items = data.filter((p) =>
      [p?.name, p?.brand, p?.storage, p?.color].map(norm).join(" ").includes(term)
    );
  } else {
    // ✅ MODO "OFERTAS EM DESTAQUE" (sem q)
    const byTag = data.filter((p) => {
      const t = norm((p as any).tag);
      const n = norm(p?.name);
      return (
        t.includes("destaque") ||
        t.includes("oferta") ||
        t.includes("promo") ||
        n.includes("destaque")
      );
    });

    if (byTag.length > 0) {
      items = byTag;
    } else {
      // Fallback: 12 melhores preços considerando desconto no PIX
      items = [...data]
        .sort(
          (a, b) =>
            Number(withCoupon((a as any).price)) -
            Number(withCoupon((b as any).price))
        )
        .slice(0, 12);
    }
  }

  const isSearch = !!term;

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        {isSearch
          ? <>Resultados para: “{searchParams?.q ?? ""}”</>
          : "Ofertas em destaque"}
      </h1>

      {!isSearch && (
        <p className="mt-1 text-sm text-zinc-600">
          Seleção com preços especiais. Atualizamos frequentemente.
        </p>
      )}

      <div className="mt-6">
        <ProductGrid
          products={items as any[]}
          emptyMessage={isSearch ? "Nenhum produto encontrado." : "Nenhuma oferta disponível no momento."}
        />
      </div>
    </main>
  );
}
