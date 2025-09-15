import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import WhatsChat from "@/components/WhatsChat";
import productsData from "@/data/products.json";
import flagsData from "@/data/flags.json";

export const revalidate = 60;

type P = any;

// ---------- helpers ----------
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const isBrand = (p: P, target: "apple" | "samsung") => {
  const b = norm(p?.brand);
  const n = norm(`${p?.brand} ${p?.name}`); // também olha o nome
  return b === target || n.includes(target);
};
const priceNum = (x: any) => {
  const n = typeof x === "number" ? x : Number(String(x).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
function sortByPriceDesc(arr: P[]) {
  return [...(arr || [])].sort((a, b) => priceNum(b?.price) - priceNum(a?.price));
}
function pickTop(arr: P[], n: number) {
  return (arr || []).slice(0, n);
}
function excludeById(arr: P[], used: Set<string>) {
  return (arr || []).filter((p) => !used.has(String(p?.id)));
}

// ---------- página ----------
export default function HomePage() {
  // 1) Normaliza produtos + aplica freeShipping via flags.json (chave = nome do arquivo da imagem)
  const flags = flagsData as Record<string, { freeShipping?: boolean }>;
  const all: P[] = (productsData as any[]).map((p: any) => {
    const file = String(p?.image || "").split("/").pop() || "";
    const freeShipping = !!flags[file]?.freeShipping;
    return { ...p, freeShipping };
  });

  // 2) Em Oferta: só Samsung (robusto) — 8 itens
  let emOferta = (all || []).filter((p) => isBrand(p, "samsung"));
  if (emOferta.length < 8) {
    // fallback: completa com qualquer produto que contenha "samsung" no nome
    const extra = (all || []).filter(
      (p) => norm(`${p?.brand} ${p?.name}`).includes("samsung")
    );
    const ids = new Set(emOferta.map((p) => String(p.id)));
    emOferta = [...emOferta, ...extra.filter((p) => !ids.has(String(p.id)))];
  }
  emOferta = pickTop(emOferta, 8);
  if (emOferta.length === 0) {
    // fallback final: mostra os primeiros 8 produtos para não ficar vazio
    emOferta = pickTop(all, 8);
  }

  // 3) BBB: mais caros (8), sem repetir os de Em Oferta
  const used1 = new Set<string>(emOferta.map((p) => String(p.id)));
  const bbb = pickTop(sortByPriceDesc(excludeById(all, used1)), 8);

  // 4) Destaque: 2 Apple + 2 Samsung, sem repetir anteriores
  const used2 = new Set<string>([...used1, ...bbb.map((p) => String(p.id))]);
  const restantes = excludeById(all, used2);

  let doisApple = restantes.filter((p) => isBrand(p, "apple"));
  let doisSamsung = restantes.filter((p) => isBrand(p, "samsung"));
  doisApple = pickTop(sortByPriceDesc(doisApple), 2);
  doisSamsung = pickTop(sortByPriceDesc(doisSamsung), 2);

  let destaque = [...doisApple, ...doisSamsung];
  if (destaque.length < 4) {
    const falta = 4 - destaque.length;
    const resto = excludeById(sortByPriceDesc(restantes), new Set(destaque.map((p) => String(p.id))));
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

      {/* 4) OFERTAS DO DIA | BBB — mais caros */}
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

      {/* 5) OFERTAS EM DESTAQUE — 2 Apple + 2 Samsung */}
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

      <WhatsChat />
    </main>
  );
}
