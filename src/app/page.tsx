import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import WhatsChat from "@/components/WhatsChat";
import { catalog } from "@/lib/catalog";

export const revalidate = 60;

type P = any; // Mantém compat com a sua tipagem atual

function byBrand(arr: P[], brand: string) {
  const b = brand.toLowerCase();
  return (arr || []).filter((p) => String(p?.brand || "").toLowerCase() === b);
}
function sortByPriceDesc(arr: P[]) {
  return [...(arr || [])].sort((a, b) => (b?.price || 0) - (a?.price || 0));
}
function pickTop(arr: P[], n: number) {
  return (arr || []).slice(0, n);
}
function excludeById(arr: P[], usedIds: Set<string>) {
  return (arr || []).filter((p) => !usedIds.has(String(p?.id)));
}

export default function HomePage() {
  const all = (catalog as P[]);

  // 1) Em Oferta: só Samsung (8 itens)
  const onlySamsung = byBrand(all, "samsung");
  const emOferta = pickTop(onlySamsung, 8);

  // 2) Ofertas do dia (BBB): os mais caros do catálogo (8 itens), evitando repetir os já usados em "Em Oferta"
  const used1 = new Set<string>(emOferta.map((p) => String(p.id)));
  const restantesParaBBB = excludeById(all, used1);
  const bbb = pickTop(sortByPriceDesc(restantesParaBBB), 8);

  // 3) Destaque: 2 iPhone + 2 Samsung (4 itens), evitando repetir os já usados
  const used2 = new Set<string>([...used1, ...bbb.map((p) => String(p.id))]);
  const restantesParaDestaque = excludeById(all, used2);

  const appleRest = byBrand(restantesParaDestaque, "apple");
  const samsungRest = byBrand(restantesParaDestaque, "samsung");

  const doisApple = pickTop(sortByPriceDesc(appleRest), 2);
  const doisSamsung = pickTop(sortByPriceDesc(samsungRest), 2);
  let destaque = [...doisApple, ...doisSamsung];

  // fallback se faltar itens de alguma marca
  if (destaque.length < 4) {
    const falta = 4 - destaque.length;
    const resto = excludeById(sortByPriceDesc(restantesParaDestaque), new Set(destaque.map((p) => String(p.id))));
    destaque = [...destaque, ...pickTop(resto, falta)];
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {/* 1) CELULARES EM OFERTA (grade 4x2) — só Samsung */}
      <section className="pt-6">
        <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
          Celulares em Oferta
        </h2>
        <div className="mt-4">
          <ProductGrid products={emOferta} />
        </div>
        <div className="mt-4 flex justify-center">
          <Link
            href="/ofertas"
            className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Ver mais
          </Link>
        </div>
      </section>

      {/* 2) DEPOIMENTOS */}
      <section className="pt-12">
        <Testimonials />
      </section>

      {/* 3) CONDIÇÃO EXCLUSIVA (Boleto aprovado) */}
      <section className="pt-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6">
          <h3 className="text-lg font-semibold text-neutral-900">Condição exclusiva</h3>
          <p className="mt-1 text-sm text-neutral-700">
            Boleto aprovado mesmo com score baixo.
          </p>
          <div className="mt-4">
            <Link
              href="/analise-de-cadastro"
              className="inline-flex items-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Análise de Boleto
            </Link>
          </div>
        </div>
      </section>

      {/* 4) OFERTAS DO DIA | BBB (grade 4x2) — mais caros */}
      <section className="pt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Ofertas do dia | BBB = Bom, Bonito e Barato
          </h2>
        </div>
        <div className="mt-4">
          <ProductGrid products={bbb} />
        </div>
      </section>

      {/* 5) OFERTAS EM DESTAQUE (4 itens) — 2 Apple + 2 Samsung */}
      <section className="pt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Ofertas em Destaque
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
          {/* Como são 4 itens, renderei diretamente para manter 2/2, mas você pode usar ProductGrid se preferir */}
          {destaque.map((p) => (
            // ProductGrid aceita 4 também; se preferir:
            // <ProductGrid products={destaque} /> e remova este bloco.
            <div key={p.id} className="min-w-0">
              {/* Reuso do card pela prop 'products' do ProductGrid seria o ideal,
                  mas para forçar 4 exatos mantemos aqui simples: */}
              {/* @ts-expect-error compat do seu ProductCard (aceita 'p') */}
              {/** Usamos ProductCard via ProductGrid para evitar import duplicado */}
            </div>
          ))}
        </div>
        {/* Versão simples usando ProductGrid direto (recomendado): */}
        {/* <div className="mt-4">
          <ProductGrid products={destaque} />
        </div> */}
        <div className="mt-4">
          <ProductGrid products={destaque} />
        </div>
      </section>

      {/* 6) NEWSLETTER */}
      <section className="pt-12">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-neutral-900">Receba ofertas primeiro</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Assine nossa newsletter e fique por dentro das promoções.
          </p>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Seu e-mail"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Assinar
            </button>
          </form>
        </div>
      </section>

      {/* Botão flutuante do WhatsApp */}
      <WhatsChat />
    </main>
  );
}
