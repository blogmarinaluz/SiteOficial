// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import productsData from "@/data/products.json";

// ======================= SEO (não altera o visual) =======================
function setMetaTag(name: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setOG(property: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function canonicalUrl(path = "/") {
  try {
    if (path.startsWith("http")) return path;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return origin + (path.startsWith("/") ? path : `/${path}`);
  } catch {
    return path;
  }
}

function HomeSEO() {
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = origin || "/";
    const title = "proStore • Celulares Apple & Samsung com 30% OFF";
    const description =
      "Ofertas reais em iPhone e Samsung: 30% OFF no PIX/Boleto e até 10x sem juros. Frete grátis em produtos selecionados.";

    document.title = title;
    setMetaTag("description", description);
    setMetaTag("robots", "index, follow");
    setOG("og:title", title);
    setOG("og:description", description);
    setOG("og:type", "website");
    setOG("og:url", url);
    setOG("og:image", `${origin}/og-prostore.jpg`);
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", `${origin}/og-prostore.jpg`);
    // canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl("/");
  }, []);

  return null;
}

// ======================= Helpers de catálogo =======================
type P = {
  id: string;
  name: string;
  brand?: string;
  price?: number;
  tags?: string[];
  color?: string;
  storage?: string | number;
  freeShipping?: boolean;
};

function norm(v: unknown) {
  return String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function score(p: P) {
  const price = Number(p.price || 0);
  const len = (p.name || "").length;
  return price * 0.9 + len * 10;
};

const pickTop = (arr: P[], n: number) => [...arr].sort((a, b) => score(a) - score(b)).slice(0, n);

function interleave<A>(a: A[], b: A[], n: number, seed = 12345) {
  const rnd = mulberry32(seed);
  const res: A[] = [];
  let ia = 0, ib = 0;
  while (res.length < n && (ia < a.length || ib < b.length)) {
    if (ia < a.length && (ib >= b.length || rnd() > 0.5)) res.push(a[ia++]);
    if (ib < b.length && res.length < n) res.push(b[ib++]);
  }
  return res.slice(0, n);
}

// frete grátis fake (estático)
function domIdsStable(list: P[], n = 24, seed = 202409) {
  const rnd = mulberry32(seed);
  const arr = [...list];
  const chosen = new Set<string>();
  while (arr.length && chosen.size < n) {
    const i = Math.floor(rnd() * arr.length);
    chosen.add(String(arr[i]?.id));
    arr.splice(i, 1);
  }
  return chosen;
}

export default function Page() {
  const raw: P[] = useMemo(() => (productsData as any) as P[], []);
  const FREE_COUNT = 36;
  const freeIds = useMemo(() => domIdsStable(raw, FREE_COUNT, 202409), [raw]);

  const all: P[] = useMemo(
    () =>
      raw.map((p) => ({
        ...p,
        freeShipping: freeIds.has(String(p?.id)),
      })),
    [raw, freeIds]
  );

  // 1) “Mais buscados” (na Home vamos usar a seção "Celulares em Oferta")
  const emOferta = useMemo(() => pickTop(all, 12), [all]);

  // 2) Ofertas do dia | BBB
  const ofApple = all.filter((p) => norm(p.brand).includes("apple") || norm(p.name).includes("iphone"));
  const ofSam = all.filter((p) => norm(p.brand).includes("samsung") || norm(p.name).includes("galaxy") || norm(p.name).includes("samsumg"));
  const ofertasDia = useMemo(() => interleave(ofApple, ofSam, 12), [ofApple, ofSam]);

  // 3) Ofertas em Destaque
  const destaque = pickTop(all, 12);
  const destaqueSafe = destaque.length >= 8 ? destaque : all.slice(0, 12);

  // Newsletter (visual)
  const [nlName, setNlName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlMsg, setNlMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  function onNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNlMsg({ type: "ok", text: "Obrigado! Você receberá nossas ofertas em breve." });
    setNlName("");
    setNlEmail("");
  }

  return (
    <main className="min-h-[60vh]">
      <HomeSEO />

      {/* 1) Hero */}
      <section className="relative">
        <div className="mx-auto max-w-[1100px] px-4 py-8 grid gap-6 md:grid-cols-[1.35fr,1fr] md:items-center">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h1 className="text-2xl md:text-[28px] font-extrabold tracking-tight">
              Economize de verdade: 30% OFF no PIX/Boleto
            </h1>
            <p className="mt-2 text-zinc-700">
              iPhone e Samsung com garantia e nota fiscal. Até 10x sem juros no cartão.
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/ofertas"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Ver ofertas
              </Link>
              <Link
                href="/#mais-buscados"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
              >
                Mais buscados
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-bold">Assine e receba promoções</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Promoções exclusivas e novidades da <b>proStore</b> direto no seu e-mail.
            </p>

            <form onSubmit={onNewsletterSubmit} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center" noValidate>
              <label className="sr-only" htmlFor="nl-name">Nome</label>
              <input
                id="nl-name"
                value={nlName}
                onChange={(e) => setNlName(e.target.value)}
                type="text"
                placeholder="Seu nome"
                className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-zinc-300 focus:ring-2 focus:ring-emerald-400"
              />

              <label className="sr-only" htmlFor="nl-email">E-mail</label>
              <input
                id="nl-email"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                type="email"
                placeholder="Seu e-mail"
                className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-zinc-300 focus:ring-2 focus:ring-emerald-400"
              />

              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Quero receber
              </button>
            </form>

            {nlMsg && (
              <div
                className={
                  "md:col-span-2 mt-1 text-sm " +
                  (nlMsg.type === "ok" ? "text-emerald-700" : "text-rose-600")
                }
                role="status"
              >
                {nlMsg.text}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2) Celulares em oferta  →  ID para âncora "mais-buscados" */}
      <section id="mais-buscados" className="mx-auto max-w-[1100px] px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Celulares em Oferta</h2>
          <Link href="/ofertas" className="text-sm text-emerald-700 hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="mt-4">
          <ProductGrid products={emOferta as any[]} />
        </div>
      </section>

      {/* 3) Ofertas do dia | BBB  →  ID para âncora "bbb" */}
      <section id="bbb" className="mx-auto max-w-[1100px] px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Ofertas do dia | BBB = Bom, Bonito e Barato</h2>
          <Link href="/bbb-do-dia" className="text-sm text-emerald-700 hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="mt-4">
          <ProductGrid products={ofertasDia as any[]} />
        </div>
      </section>

      {/* 4) Depoimentos */}
      <section className="mx-auto max-w-[1100px] px-4">
        <Testimonials />
      </section>

      {/* 5) Ofertas em destaque  →  ID para âncora "destaques" */}
      <section id="destaques" className="mx-auto max-w-[1100px] px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Ofertas em Destaque</h2>
          <Link href="/mais-buscados" className="text-sm text-emerald-700 hover:underline">
            Ver mais
          </Link>
        </div>
        <div className="mt-4">
          <ProductGrid products={destaqueSafe as any[]} />
        </div>
      </section>
    </main>
  );
}
