import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import WhatsChat from "@/components/WhatsChat";
import productsData from "@/data/products.json";

export const revalidate = 60;

type P = any;

/* ===================== utils ===================== */
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const isBrand = (p: P, target: "apple" | "samsung") => {
  const b = norm(p?.brand);
  const n = norm(`${p?.brand} ${p?.name}`);
  return b === target || n.includes(target);
};
const priceNum = (x: any) => {
  const n = typeof x === "number" ? x : Number(String(x).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const sortByPriceDesc = (arr: P[]) =>
  [...(arr || [])].sort((a, b) => priceNum(b?.price) - priceNum(a?.price));
const pickTop = (arr: P[], n: number) => (arr || []).slice(0, n);
const excludeById = (arr: P[], used: Set<string>) =>
  (arr || []).filter((p) => !used.has(String(p?.id)));

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pickRandomIdsStable(arr: P[], n: number, seed = 202409) {
  const rng = mulberry32(seed);
  const idx = arr.map((_: any, i: number) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const take = idx.slice(0, Math.min(n, idx.length));
  return new Set(take.map((i) => String(arr[i]?.id)));
}
function interleave<A>(a: A[], b: A[], nEach: number) {
  const out: A[] = [];
  for (let i = 0; i < nEach; i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

/* ===================== page ===================== */
export default function HomePage() {
  // Base de produtos
  const raw: P[] = (productsData as any[]);

  // Frete Grátis: exatamente 20 aparelhos aleatórios no site inteiro
  const FREE_COUNT = 20;
  const freeIds = pickRandomIdsStable(raw, FREE_COUNT, 202409);
  const all: P[] = raw.map((p) => ({ ...p, freeShipping: freeIds.has(String(p?.id)) }));

  // 1) CELULARES EM OFERTA: 4 Samsung + 4 Apple (intercalados)
  const samsungs = pickTop(all.filter((p) => isBrand(p, "samsung")), 4);
  const apples = pickTop(all.filter((p) => isBrand(p, "apple")), 4);
  let emOferta = interleave(samsungs, apples, 4);
  if (emOferta.length < 8) {
    const falta = 8 - emOferta.length;
    const usados = new Set<string>(emOferta.map((p) => String(p.id)));
    const resto = excludeById(all, usados);
    emOferta = [...emOferta, ...pickTop(resto, falta)];
  }

  // 2) BBB: mais caros (8), sem repetir os de Em Oferta
  const used1 = new Set<string>(emOferta.map((p) => String(p.id)));
  const bbb = pickTop(sortByPriceDesc(excludeById(all, used1)), 8);

  // 3) Destaque: 2 Apple + 2 Samsung, sem repetir os anteriores
  const used2 = new Set<string>([...used1, ...bbb.map((p) => String(p.id))]);
  const restantes = excludeById(all, used2);
  const destaque = [
    ...pickTop(sortByPriceDesc(restantes.filter((p) => isBrand(p, "apple"))), 2),
    ...pickTop(sortByPriceDesc(restantes.filter((p) => isBrand(p, "samsung"))), 2),
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {/* 1) CELULARES EM OFERTA — 4 Samsung + 4 Apple */}
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

      {/* 2) Depoimentos */}
      <section className="pt-12">
        <Testimonials />
      </section>

      {/* 3) CONDIÇÃO EXCLUSIVA — elegante, inline e enxuta */}
      <section aria-labelledby="exclusive-heading" className="mt-8">
        <div className="mx-auto max-w-[1100px] rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-[1px] shadow-md">
          <div className="rounded-2xl bg-white/6 px-6 py-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* Texto principal */}
              <div className="md:flex-1 md:pr-6">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/90">
                  Condição exclusiva
                </p>
                <h2
                  id="exclusive-heading"
                  className="mt-1 text-2xl md:text-[28px] font-extrabold leading-tight text-white"
                >
                  Boleto aprovado mesmo com score baixo
                </h2>
                <p className="mt-2 text-sm md:text-[15px] text-white/90 max-w-2xl">
                  Análise simples e liberação em até <strong>24h</strong>. Sem cartão. Atendimento humano pelo WhatsApp.
                </p>

                {/* Benefícios em linha (chips) */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/10 backdrop-blur">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                      <path d="M7.5 13.5 4 10l1.2-1.2 2.3 2.3 6.5-6.5L15.4 6l-7.9 7.5z" fill="currentColor" />
                    </svg>
                    Sem cartão
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/10 backdrop-blur">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                      <path d="M7.5 13.5 4 10l1.2-1.2 2.3 2.3 6.5-6.5L15.4 6l-7.9 7.5z" fill="currentColor" />
                    </svg>
                    Aprovação rápida
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/10 backdrop-blur">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                      <path d="M7.5 13.5 4 10l1.2-1.2 2.3 2.3 6.5-6.5L15.4 6l-7.9 7.5z" fill="currentColor" />
                    </svg>
                    Estoque imediato
                  </span>
                </div>
              </div>

              {/* CTA à direita */}
              <div className="shrink-0">
                <a
                  href="/analise-de-cadastro"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                  aria-label="Solicitar análise pelo boleto"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true">
                      <path d="M10 2 4 5v6c0 5 3.8 9.7 8 11 4.2-1.3 8-6 8-11V5l-8-3z" fill="currentColor" />
                    </svg>
                  </span>
                  Solicitar pelo boleto
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) BBB — mais caros */}
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

      {/* 5) Destaque — 2 Apple + 2 Samsung */}
      <section className="pt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight">
            Ofertas em Destaque
          </h2>
        </div>
        <div className="mt-4">
          <ProductGrid products={destaque} />
        </div>
      </section>

      {/* 6) Newsletter */}
      <section className="mt-10">
        <div className="mx-auto max-w-[1100px] rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-7 shadow-md">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              Inscreva-se na nossa Newsletter
            </h3>
            <p className="mt-1 text-sm text-white/90">
              Fique por dentro das novidades e promoções exclusivas
            </p>
          </div>

          <form className="mx-auto mt-4 flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-3" action="#" noValidate>
            <label className="sr-only" htmlFor="nl-name">Nome</label>
            <input
              id="nl-name"
              type="text"
              placeholder="Digite o seu nome"
              className="w-full rounded-xl border-0 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none ring-1 ring-white/40 focus:ring-2 focus:ring-white"
              required
            />
            <label className="sr-only" htmlFor="nl-email">E-mail</label>
            <input
              id="nl-email"
              type="email"
              placeholder="Digite o seu e-mail"
              className="w-full rounded-xl border-0 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none ring-1 ring-white/40 focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="button"
              className="w-full sm:w-auto rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              Cadastrar
            </button>
          </form>

          <p className="mx-auto mt-3 max-w-4xl text-[11px] leading-relaxed text-white/90">
            *Ao clicar em cadastrar você autoriza a coleta, armazenamento e tratamento de dados, de acordo com a
            <a href="#" className="underline underline-offset-2"> Política de Privacidade</a>,
            <a href="#" className="underline underline-offset-2"> Termos de Uso</a> e
            <a href="#" className="underline underline-offset-2"> Política de Cookies</a>.
          </p>
        </div>
      </section>

      {/* Bubble do WhatsApp (se quiser manter) */}
      <WhatsChat />
    </main>
  );
}
