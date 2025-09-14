import ProductCard from "@/components/ProductCard";
import CarouselRow from "@/components/CarouselRow";
import Link from "next/link";
import products from "@/data/products.json";

/**
 * Regras de destaque sem mexer no products.json
 * Ajuste os termos conforme o seu catálogo.
 */
const FEATURED = [
  "iphone 11", "iphone 12", "iphone 13", "iphone 14",
  "galaxy a07", "s21 fe", "s22", "s21+"
];
const BBB = ["galaxy a07", "iphone 11", "iphone 12"];
const POPULAR = ["iphone 14", "iphone 13", "s21 fe", "s22"];

// "Frete Grátis" em alguns itens (±20) por nome
const FRETE_GRATIS = [
  "iphone 11 64", "iphone 11 128",
  "iphone 12 128", "iphone 13 128",
  "iphone 14 128", "iphone 14",
  "galaxy a07 128", "galaxy a07 256",
  "s21 fe 128", "s22 128", "s21+ 128",
  "galaxy s21", "galaxy s22", "s21 fe", "a07"
];

function mark(p: any) {
  const name = `${p.brand} ${p.name}`.toLowerCase();
  const has = (arr: string[]) => arr.some(t => name.includes(t));
  return {
    ...p,
    freeShipping: has(FRETE_GRATIS),
    __featured: has(FEATURED),
    __bbb: has(BBB),
    __popular: has(POPULAR),
  };
}

export default function Home() {
  const list = (products as any[]).map(mark);

  const featured = list.filter(p => p.__featured).slice(0, 12);
  const bbb = list.filter(p => p.__bbb).slice(0, 8);
  const popular = list.filter(p => p.__popular).slice(0, 8);

  // grade "Mais modelos..." -> pega um mix
  const grid = list.slice(0, 12);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* CELULARES EM OFERTA */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">Celulares em Oferta</h2>
          <Link href="/ofertas" className="text-sm text-[#4b4bfb] hover:underline">ver tudo</Link>
        </div>
        <CarouselRow>
          {featured.map(p => <ProductCard key={p.id} p={p} />)}
        </CarouselRow>
      </section>

      {/* BBB */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">Ofertas do dia | BBB = Bom, Bonito e Barato</h2>
          <Link href="/ofertas" className="text-sm text-[#4b4bfb] hover:underline">ver todas</Link>
        </div>
        <CarouselRow>
          {bbb.map(p => <ProductCard key={p.id} p={p} />)}
        </CarouselRow>
      </section>

      {/* MAIS BUSCADOS */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">Mais buscados</h2>
          <Link href="/mais-buscados" className="text-sm text-[#4b4bfb] hover:underline">ver todos</Link>
        </div>
        <CarouselRow>
          {popular.map(p => <ProductCard key={p.id} p={p} />)}
        </CarouselRow>
      </section>

      {/* MAIS MODELOS ... */}
      <section className="mb-12">
        <h2 className="text-xl font-extrabold mb-4">Mais modelos…</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {grid.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </main>
  );
}
