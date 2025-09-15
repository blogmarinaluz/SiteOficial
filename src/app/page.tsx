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

      {/* 3) Condição exclusiva */}
      <section className="pt-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6">
          <h3 className="text-lg font-semibold text-neutral-900">Condição exclusiva</h3>
          <p className="mt-1 text-sm text-neutral-700">Boleto aprovado mesmo com score baixo.</p>
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
