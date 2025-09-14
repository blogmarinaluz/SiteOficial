// src/app/page.tsx  — COMPLETO

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CarouselRow from "@/components/CarouselRow";
import products from "@/data/products.json";

type P = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  freeShipping?: boolean;
  featured?: boolean; // “Celulares em Oferta”
  bbb?: boolean;      // carrossel BBB
  popular?: boolean;  // carrossel “Mais buscados”
};

export default function HomePage() {
  const list = products as unknown as P[];

  const featured = list.filter(p => p.featured).slice(0, 12);
  const bbb = list.filter(p => p.bbb).slice(0, 12);
  const popular = list.filter(p => p.popular).slice(0, 12);
  const more = list.slice(0, 12); // grid “Mais modelos…”

  return (
    <>
      {/* CELULARES EM OFERTA */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold mb-4">Celulares em Oferta</h2>
        {featured.length === 0 ? (
          <div className="text-sm text-zinc-500">Sem destaques no momento.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* BBB */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold mb-4">
          Ofertas do dia | BBB = Bom, Bonito e Barato
        </h2>
        {bbb.length === 0 ? (
          <div className="text-sm text-zinc-500">Sem ofertas BBB no momento.</div>
        ) : (
          <CarouselRow>
            {bbb.map(p => (
              <div key={p.id} className="w-[260px]">
                <ProductCard p={p} />
              </div>
            ))}
          </CarouselRow>
        )}
      </section>

      {/* MAIS BUSCADOS */}
      <section className="mb-10">
        <h2 className="text-xl font-extrabold mb-4">Mais buscados</h2>
        {popular.length === 0 ? (
          <div className="text-sm text-zinc-500">Sem itens populares no momento.</div>
        ) : (
          <CarouselRow>
            {popular.map(p => (
              <div key={p.id} className="w-[260px]">
                <ProductCard p={p} />
              </div>
            ))}
          </CarouselRow>
        )}
      </section>

      {/* MAIS MODELOS */}
      <section className="mb-6">
        <h2 className="text-xl font-extrabold mb-4">Mais modelos…</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {more.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/buscar?q=" className="btn-outline inline-block">
            Ver mais modelos
          </Link>
        </div>
      </section>
    </>
  );
}
