import ProductCard from "@/components/ProductCard";
import CarouselRow from "@/components/CarouselRow";
import products from "@/data/products.json";

/** Ajuste o tipo conforme seu JSON se quiser mais forte */
type Product = {
  id: string | number;
  brand: string;
  name: string;
  image: string;
  price: number;
  tag?: string;
  freeShipping?: boolean;
  featured?: boolean; // Celulares em Oferta (grid)
  bbb?: boolean;      // Ofertas do dia | BBB (carrossel)
  popular?: boolean;  // Mais buscados (carrossel)
};

export default function Page() {
  const list = products as unknown as Product[];

  // Seleções com fallback caso o JSON ainda não tenha flags
  const ofertas = (list.filter(p => p.featured).length ? list.filter(p => p.featured) : list).slice(0, 6);
  const bbb = (list.filter(p => p.bbb).length ? list.filter(p => p.bbb) : list).slice(0, 12);
  const maisBuscados = (list.filter(p => p.popular).length ? list.filter(p => p.popular) : list).slice(0, 12);

  return (
    <div className="space-y-12">
      {/* CELULARES EM OFERTA (GRID + 'Mais modelos…') */}
      <section>
        <h1 className="mb-4 text-xl font-bold">Celulares em Oferta</h1>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {ofertas.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-5 text-center">
          <a href="/buscar" className="btn-outline">
            Mais modelos…
          </a>
        </div>
      </section>

      {/* OFERTAS DO DIA | BBB (CARROSSEL 4-por-vez) */}
      <CarouselRow
        title="Ofertas do dia | BBB = Bom, Bonito e Barato"
        items={bbb}
      />

      {/* MAIS BUSCADOS (CARROSSEL 4-por-vez) */}
      <CarouselRow title="Mais buscados" items={maisBuscados} />
    </div>
  );
}
