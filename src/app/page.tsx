import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import { catalog } from "@/lib/catalog"; // << usa o export correto

/**
 * Termos de destaque (ajuste conforme o catálogo real)
 */
const FEATURED = [
  "iphone 11", "iphone 12", "iphone 13", "iphone 14",
  "galaxy a07", "s21 fe", "s22", "s21+"
];
const BBB = ["galaxy a07", "iphone 11", "iphone 12"];
const POPULAR = ["iphone 14", "iphone 13", "s21 fe", "s22"];

function hasTerm(p: any, terms: string[]) {
  const name = `${p.brand} ${p.name}`.toLowerCase();
  return terms.some(t => name.includes(t));
}

export default function HomePage() {
  // Usa o catálogo já com flags (frete grátis) mescladas
  const all = (catalog as any[]);

  const featured = all.filter(p => hasTerm(p, FEATURED));
  const bbb = all.filter(p => hasTerm(p, BBB));
  const popular = all.filter(p => hasTerm(p, POPULAR));

  return (
    <main className="container mx-auto px-4 py-8">
      {/* CELULARES EM OFERTA (GRADE — sem carrossel) */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Celulares em Oferta
          </h2>
          <Link href="/ofertas" className="text-sm text-[#4b4bfb] hover:underline">ver tudo</Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* BBB do dia (mantém carrossel que você já tinha) */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Ofertas do dia | BBB = Bom, Bonito e Barato
          </h2>
          <Link href="/ofertas" className="text-sm text-[#4b4bfb] hover:underline">ver todas</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
          {bbb.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* MAIS BUSCADOS (mantém carrossel que você já tinha) */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Mais buscados
          </h2>
          <Link href="/mais-buscados" className="text-sm text-[#4b4bfb] hover:underline">ver todos</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
          {popular.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* MAIS MODELOS … (mantém grade adicional se você quiser) */}
      <section className="mb-12">
        <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight mb-4">Mais modelos…</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {all.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </main>
  );
}
