import data from "@/data/products.json";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

function pick(n: number, sort?: (a: any, b: any) => number, filter?: (p: any) => boolean) {
  let arr = (data as any[]).slice();
  if (filter) arr = arr.filter(filter);
  if (sort) arr.sort(sort);
  return arr.slice(0, n);
}

export default function Home() {
  const ofertas = pick(6); // vitrine inicial
  const destaque = pick(6); // ofertas em destaque
  const bbb = pick(6, (a, b) => (a.price || 0) - (b.price || 0)); // mais baratos

  return (
    <main>
      {/* Celulares em Oferta */}
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-4">Celulares em Oferta</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/categoria/apple" className="btn-secondary">
            Mais modelos…
          </Link>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-zinc-50">
        <div className="container py-8">
          <h2 className="text-2xl font-bold mb-4">Depoimentos</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <blockquote className="border rounded-2xl p-4 text-sm">
              “Chegou rápido e com nota.” — <b>Ana</b>
            </blockquote>
            <blockquote className="border rounded-2xl p-4 text-sm">
              “A análise no boleto foi tranquila.” — <b>Lucas</b>
            </blockquote>
            <blockquote className="border rounded-2xl p-4 text-sm">
              “Atendimento via WhatsApp top!” — <b>Marina</b>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Ofertas em Destaque */}
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-4">Ofertas em Destaque</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destaque.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Boleto */}
      <section className="container py-8">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <h3 className="text-xl font-semibold mb-1">Pague no BOLETO mesmo com score baixo</h3>
          <p className="text-sm text-green-900">
            Fazemos uma análise de cadastro simples e liberamos o boleto em até 24h. Sem consulta ao cartão.
            Finalize o pedido e te atendemos no WhatsApp.
          </p>
        </div>
      </section>

      {/* Ofertas do dia | BBB */}
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-4">Ofertas do dia | BBB = Bom, Bonito e Barato</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bbb.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-zinc-50">
        <div className="container py-10">
          <h2 className="text-2xl font-bold mb-2">Inscreva-se na nossa Newsletter</h2>
          <p className="text-sm text-zinc-600 mb-4">Receba ofertas exclusivas e novidades.</p>
          <form className="flex gap-2 max-w-md">
            <input type="email" placeholder="Seu e-mail" className="input flex-1" />
            <button className="btn-primary">Inscrever</button>
          </form>
        </div>
      </section>
    </main>
  );
}
