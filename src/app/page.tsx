import data from "@/data/products.json";
import ProductCard from "@/components/ProductCard";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-4">
      {children}
    </h2>
  );
}

function RowCarousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const featured = data.filter((p) => p.featured);
  const bbb = data.filter((p) => p.bbb);
  const popular = data.filter((p) => p.popular);

  // “Mais modelos” = tudo que não entrou como ‘featured’
  const moreModels = data.filter((p) => !p.featured);

  return (
    <div className="space-y-12">
      {/* CELULARES EM OFERTA */}
      <section>
        <SectionTitle>Celulares em Oferta</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p as any} />
          ))}
        </div>
      </section>

      {/* BBB */}
      <section>
        <SectionTitle>Ofertas do dia | BBB = Bom, Bonito e Barato</SectionTitle>
        <RowCarousel>
          {bbb.map((p) => (
            <div key={p.id} className="min-w-[220px] snap-start">
              <ProductCard p={p as any} />
            </div>
          ))}
        </RowCarousel>
      </section>

      {/* MAIS BUSCADOS */}
      <section>
        <SectionTitle>Mais buscados</SectionTitle>
        <RowCarousel>
          {popular.map((p) => (
            <div key={p.id} className="min-w-[220px] snap-start">
              <ProductCard p={p as any} />
            </div>
          ))}
        </RowCarousel>
      </section>

      {/* MAIS MODELOS */}
      <section>
        <SectionTitle>Mais modelos…</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {moreModels.slice(0, 12).map((p) => (
            <ProductCard key={p.id} p={p as any} />
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="/buscar?q=" className="btn-outline">
            Ver todos os modelos
          </a>
        </div>
      </section>
    </div>
  );
}
