import ProductGrid from "@/components/ProductGrid";
import CarouselRow from "@/components/CarouselRow";
import Testimonials from "@/components/Testimonials";
import WhatsChat from "@/components/WhatsChat";
import { getCatalog } from "@/lib/catalog"; // assume este export; se o nome for diferente, me diga que mando a versão compatível.

export const revalidate = 60;

export default async function HomePage() {
  // Espera-se que getCatalog retorne listas: featured, bbb, popular, etc.
  const catalog = await getCatalog();
  const featured = catalog?.featured || [];
  const bbb = catalog?.bbb || [];
  const popular = catalog?.popular || [];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
      {/* CELULARES EM OFERTA (grade) */}
      <section className="pt-6">
        <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
          Celulares em Oferta
        </h2>
        <div className="mt-4">
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* BBB do dia (permanece carrossel) */}
      {bbb && bbb.length > 0 && (
        <section className="pt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
              Ofertas do dia | BBB
            </h2>
          </div>
          <div className="mt-4">
            <CarouselRow products={bbb} />
          </div>
        </section>
      )}

      {/* Mais buscados (permanece carrossel) */}
      {popular && popular.length > 0 && (
        <section className="pt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
              Mais buscados
            </h2>
          </div>
          <div className="mt-4">
            <CarouselRow products={popular} />
          </div>
        </section>
      )}

      {/* Depoimentos */}
      <section className="pt-12">
        <Testimonials />
      </section>

      {/* WhatsApp flutuante */}
      <WhatsChat />
    </main>
  );
}
