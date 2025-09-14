import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CarouselRow from "@/components/CarouselRow";
import products from "@/data/products.json";

type P = {
  id: string; brand: string; name: string; image?: string; price?: number;
};

// heurísticas para montar blocos sem mexer no JSON
const all: P[] = (products as any[]).filter(p => p && p.id && p.name);

// oferta = os 8 primeiros com preço
const oferta = all.filter(p => typeof p.price === "number").slice(0, 8);

// BBB = 8 mais baratos (preço asc)
const bbb = all
  .filter(p => typeof p.price === "number")
  .sort((a,b) => (a.price||0) - (b.price||0))
  .slice(0, 8);

// populares = mistura Apple/Samsung por padrão
const populares = [
  ...all.filter(p => p.brand?.toLowerCase().includes("apple")).slice(0, 4),
  ...all.filter(p => p.brand?.toLowerCase().includes("samsung")).slice(0, 4),
].slice(0, 8);

// “mais modelos” = vitrine compacta
const maisModelos = all.slice(8, 20);

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Celulares em Oferta */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold mb-4">Celulares em Oferta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {oferta.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* BBB */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold mb-4">Ofertas do dia | BBB = Bom, Bonito e Barato</h2>
          <Carousel>
            {bbb.map((p) => <ProductCard key={p.id} p={p} />)}
          </Carousel>
        </section>

        {/* Mais buscados */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold mb-4">Mais buscados</h2>
          <Carousel>
            {populares.map((p) => <ProductCard key={p.id} p={p} />)}
          </Carousel>
        </section>

        {/* Mais modelos */}
        <section className="mb-4">
          <h2 className="text-xl font-extrabold mb-4">Mais modelos…</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {maisModelos.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          <div className="mt-6 text-center">
            <a href="/buscar?q=" className="btn-outline">Ver catálogo completo</a>
          </div>
        </section>
      </main>
    </>
  );
}
