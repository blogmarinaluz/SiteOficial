import data from "@/data/products.json";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import BoletoModal from "@/components/BoletoModal";
import Testimonials from "@/components/Testimonials";
import WhatsChat from "@/components/WhatsChat";

function pick(n: number, sort?: (a: any, b: any) => number, filter?: (p: any) => boolean) {
  let arr = (data as any[]).slice();
  if (filter) arr = arr.filter(filter);
  if (sort) arr.sort(sort);
  return arr.slice(0, n);
}

export default function Home() {
  const all = data as any[];
  const ofertas = pick(6);

  const appleTop = all
    .filter((p) => p.brand?.toLowerCase() === "apple" && p.price)
    .sort((a, b) => (b.price || 0) - (a.price || 0))[0];
  const samsungTop = all
    .filter((p) => p.brand?.toLowerCase() === "samsung" && p.price)
    .sort((a, b) => (b.price || 0) - (a.price || 0))[0];
  const barato = all
    .filter((p) => p.price)
    .sort((a, b) => (a.price || 0) - (b.price || 0))[0];

  const ofertasDia = [appleTop, samsungTop, barato].filter(Boolean);
  const destaque = pick(6);

  return (
    <main>
      <BoletoModal />

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

      {/* Depoimentos novos (branco, carrossel auto) */}
      <Testimonials />

      {/* Bloco bonito do BOLETO (hero compacto) */}
      <section className="container py-10">
        <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="md:flex items-center gap-8">
            <div className="flex-1">
              <div className="text-emerald-100 text-sm font-semibold uppercase">Condição exclusiva</div>
              <h3 className="text-3xl font-extrabold mt-1">Boleto aprovado mesmo com score baixo</h3>
              <p className="text-emerald-50 mt-2">
                Análise simples e liberação em até <b>24h</b>. Sem cartão. Atendimento humano pelo WhatsApp.
              </p>
              <ul className="mt-4 text-emerald-50 text-sm grid sm:grid-cols-3 gap-3">
                <li className="bg-white/10 rounded-xl px-3 py-2">✔ Sem cartão</li>
                <li className="bg-white/10 rounded-xl px-3 py-2">✔ Aprovação rápida</li>
                <li className="bg-white/10 rounded-xl px-3 py-2">✔ Estoque imediato</li>
              </ul>
            </div>
            <div className="mt-6 md:mt-0">
              <Link href="/checkout" className="btn bg-white text-emerald-700 hover:bg-emerald-50">
                Solicitar pelo boleto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas do dia | BBB */}
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-4">Ofertas do dia | BBB = Bom, Bonito e Barato</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertasDia.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
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

      {/* Newsletter PRO (input destacado) */}
      <section className="bg-zinc-50">
        <div className="container py-12">
          <div className="rounded-2xl border bg-white p-6 md:p-8 md:flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Assine e receba ofertas exclusivas</h2>
              <p className="text-sm text-zinc-600 mt-1">Ganhe um cupom de boas-vindas no seu e-mail.</p>
            </div>
            <form className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] text-zinc-600">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="ex: nome@email.com"
                  className="input w-full ring-1 ring-zinc-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="btn-primary">Quero receber</button>
            </form>
          </div>
        </div>
      </section>

      {/* Chat WhatsApp flutuante */}
      <WhatsChat />
    </main>
  );
}
