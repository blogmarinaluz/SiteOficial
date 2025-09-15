import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import WhatsChat from "@/components/WhatsChat";
import productsData from "@/data/products.json";

export const revalidate = 60;

type P = any;

// ---------- utils ----------
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

// ---------- page ----------
export default function HomePage() {
  // Base de produtos
  const raw: P[] = (productsData as any[]);

  // === Frete Grátis: exatamente 20 aparelhos aleatórios no site inteiro ===
  const FREE_COUNT = 20;
  const freeIds = pickRandomIdsStable(raw, FREE_COUNT, 202409);
  const all: P[] = raw.map((p) => ({ ...p, freeShipping: freeIds.has(String(p?.id)) }));

  // 1) CELULARES EM OFERTA: 4 Samsung + 4 Apple (intercalados)
  const samsungs = pickTop(all.filter((p) => isBrand(p, "samsung")), 4);
  const apples   = pickTop(all.filter((p) => isBrand(p, "apple")), 4);
  let emOferta   = interleave(samsungs, apples, 4);
  // fallback se faltar itens de alguma marca
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

      {/* CONDIÇÃO EXCLUSIVA - VERSÃO PROFISSIONAL COMPACTA */}
<section aria-labelledby="exclusive-heading" className="mt-8">
  <div className="mx-auto max-w-7xl rounded-lg p-[1px] bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-sm">
    <div className="rounded-lg bg-white/6 px-6 py-5 md:flex md:items-center md:gap-6 lg:py-6">
      {/* LEFT: texto (limita largura para evitar espaço morto) */}
      <div className="flex-1">
        <div className="md:flex md:items-start md:gap-4">
          <div className="md:flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/90">Condição exclusiva</p>
            <h2 id="exclusive-heading" className="mt-1 text-lg font-bold leading-snug text-white max-w-xl">
              Boleto aprovado mesmo com score baixo
            </h2>
            <p className="mt-2 text-sm text-white/90 max-w-md">
              Análise ágil e liberação em até <strong>24h</strong>. Sem necessidade de cartão — atendimento humano via WhatsApp para acompanhar o processo.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: bullets + CTA (compacto) */}
      <div className="mt-3 md:mt-0 md:w-80">
        <ul className="grid gap-2">
          <li className="flex items-start gap-3 rounded-md bg-white/8 px-3 py-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M9.3 16.3 4.7 11.7l1.4-1.4 3.2 3.2 7.9-7.9 1.4 1.4z" fill="currentColor" /></svg>
            </span>
            <div className="text-sm">
              <div className="font-semibold text-white">Sem cartão</div>
              <div className="text-[12px] text-white/80">Análise documental e score alternativo</div>
            </div>
          </li>

          <li className="flex items-start gap-3 rounded-md bg-white/8 px-3 py-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M9.3 16.3 4.7 11.7l1.4-1.4 3.2 3.2 7.9-7.9 1.4 1.4z" fill="currentColor" /></svg>
            </span>
            <div className="text-sm">
              <div className="font-semibold text-white">Aprovação rápida</div>
              <div className="text-[12px] text-white/80">Análise em até 24h com revisão humana</div>
            </div>
          </li>

          <li className="flex items-start gap-3 rounded-md bg-white/8 px-3 py-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M9.3 16.3 4.7 11.7l1.4-1.4 3.2 3.2 7.9-7.9 1.4 1.4z" fill="currentColor" /></svg>
            </span>
            <div className="text-sm">
              <div className="font-semibold text-white">Estoque imediato</div>
              <div className="text-[12px] text-white/80">Reservamos o aparelho após aprovação</div>
            </div>
          </li>
        </ul>

        <div className="mt-3 flex items-center gap-3">
          <Link
            href="/analise-de-cadastro"
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm hover:shadow-md"
            aria-label="Solicitar análise de boleto"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
              <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true"><path d="M12 2 2 7v5c0 5 3.8 9.7 8 11 4.2-1.3 8-6 8-11V7l-8-5z" fill="currentColor" /></svg>
            </span>
            Solicitar pelo boleto
          </Link>

          <Link href="/analise-de-cadastro" className="text-sm font-medium text-white/90 hover:underline" aria-label="Saiba mais">
            Saiba mais
          </Link>
        </div>

        <p className="mt-2 text-xs text-white/80">
          Clique em <strong>Solicitar pelo boleto</strong> para abrir a página de análise — o formulário coleta os dados necessários.
        </p>
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
            <button className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Assinar
            </button>
          </form>
        </div>
      </section>

      <WhatsChat />
    </main>
  );
}
