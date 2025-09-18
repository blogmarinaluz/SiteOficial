// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import productsData from "@/data/products.json";
import HeroCarousel from "@/components/HeroCarousel";

/* ======================= SEO helpers ======================= */
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

function setMetaProperty(prop: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  if (typeof document === "undefined") return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function absUrl(path: string): string {
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

    try {
      document.title = title;
      setMetaTag("description", description);
      setCanonical(url);
      setMetaProperty("og:title", title);
      setMetaProperty("og:description", description);
      setMetaProperty("og:type", "website");
      setMetaProperty("og:url", url);
      setMetaProperty("og:image", absUrl("/og-home.jpg"));
      setMetaTag("twitter:card", "summary_large_image");
      setMetaTag("twitter:title", title);
      setMetaTag("twitter:description", description);
    } catch {}
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const websiteJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "proStore",
    url: origin || "/",
  };
  const orgJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "proStore",
    url: origin || "/",
    logo: absUrl("/logo.png"),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }} />
    </>
  );
}

/* ======================= Catálogo / util ======================= */
type P = any;
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();

function isApple(p: P) {
  const b = norm(p?.brand);
  const n = norm(`${p?.brand} ${p?.name}`);
  return b === "apple" || n.includes("iphone");
}
function isSamsung(p: P) {
  const b = norm(p?.brand);
  const n = norm(`${p?.brand} ${p?.name}`);
  return b === "samsung" || n.includes("galaxy");
}

const score = (p: P) => {
  const price = Number(p?.price || 0);
  const len = String(p?.name || "").length;
  return price * 0.9 + len * 10;
};
const sortByScore = (arr: P[]) => [...arr].sort((a, b) => score(a) - score(b));

function interleaveUnique(a: P[], b: P[], want: number, picked: Set<string>) {
  const out: P[] = [];
  let i = 0, j = 0;
  while (out.length < want && (i < a.length || j < b.length)) {
    if (i < a.length) {
      const pa = a[i++];
      const id = String(pa?.id);
      if (!picked.has(id)) { picked.add(id); out.push(pa); }
      if (out.length >= want) break;
    }
    if (j < b.length) {
      const pb = b[j++];
      const id = String(pb?.id);
      if (!picked.has(id)) { picked.add(id); out.push(pb); }
    }
  }
  return out;
}

function roundRobinMix(source: P[], want: number, picked: Set<string>) {
  const A = source.filter(isApple);
  const S = source.filter(isSamsung);
  const O = source.filter((p) => !isApple(p) && !isSamsung(p));
  const buckets = [A, S, O];
  const idxs = [0, 0, 0];
  const out: P[] = [];
  let turn = 0;
  while (out.length < want) {
    let advanced = false;
    for (let k = 0; k < buckets.length && out.length < want; k++) {
      const b = buckets[(turn + k) % buckets.length];
      let i = idxs[(turn + k) % buckets.length];
      while (i < b.length && picked.has(String(b[i]?.id))) i++;
      idxs[(turn + k) % buckets.length] = i;
      if (i < b.length) {
        const p = b[i];
        const id = String(p?.id);
        if (!picked.has(id)) {
          picked.add(id);
          out.push(p);
          advanced = true;
        }
        idxs[(turn + k) % buckets.length] = i + 1;
      }
    }
    if (!advanced) break;
    turn = (turn + 1) % buckets.length;
  }
  return out;
}

function takeUnique(source: P[], want: number, picked: Set<string>) {
  const out: P[] = [];
  for (const p of source) {
    if (out.length >= want) break;
    const id = String(p?.id);
    if (picked.has(id)) continue;
    picked.add(id);
    out.push(p);
  }
  return out;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRandomIdsStable(list: P[], n: number, seed = 202409) {
  const rnd = mulberry32(seed);
  const arr = [...list];
  const chosen = new Set<string>();
  while (arr.length && chosen.size < n) {
    const idx = Math.floor(rnd() * arr.length);
    const item = arr.splice(idx, 1)[0];
    chosen.add(String(item?.id));
  }
  return chosen;
}

/* ======================= Página ======================= */
export default function Page() {
  const raw: P[] = (productsData as any[]) ?? [];

  // ~20 com frete grátis (estável)
  const FREE_COUNT = 20;
  const freeIds = useMemo(() => pickRandomIdsStable(raw, FREE_COUNT, 202409), [raw]);
  const all: P[] = useMemo(
    () =>
      raw.map((p) => ({
        ...p,
        freeShipping: freeIds.has(String(p?.id)),
      })),
    [raw, freeIds]
  );

  // Listas ordenadas
  const byScore = useMemo(() => sortByScore(all), [all]);
  const samsungs = useMemo(() => sortByScore(all.filter(isSamsung)), [all]);
  const apples = useMemo(() => sortByScore(all.filter(isApple)), [all]);

  // Garantir que NÃO haja repetição entre seções
  const picked = new Set<string>();

  // 1) Celulares em Oferta (8): intercalar Samsung + Apple (agora com detecção robusta)
  const emOferta = interleaveUnique(samsungs, apples, 8, picked);

  // 2) Ofertas do dia | BBB (8): mistura Apple/Samsung/Outros por round‑robin
  const poolBBB = byScore.filter((p) => !picked.has(String(p?.id)));
  const ofertasDia = roundRobinMix(poolBBB, 8, picked);

  // 3) Ofertas em Destaque (12): mesma mistura, agora com o restante
  const poolDest = byScore.filter((p) => !picked.has(String(p?.id)));
  const destaque = roundRobinMix(poolDest, 12, picked);

  // Fallbacks se faltar produto
  const restante = byScore.filter((p) => !picked.has(String(p?.id)));
  while (ofertasDia.length < 8 && restante.length) ofertasDia.push(restante.shift()!);
  while (destaque.length < 12 && restante.length) destaque.push(restante.shift()!);

  // Newsletter state
  const [nlName, setNlName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlMsg, setNlMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    try {
      const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
      const isAdminParam =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).has("admin");
      setShowExport(Boolean(isLocal || isAdminParam));
    } catch {
      setShowExport(false);
    }
  }, []);

  function saveNewsletterLocal(name: string, email: string) {
    const key = "prostore:newsletter";
    const raw = localStorage.getItem(key);
    let arr: Array<{ name: string; email: string; createdAt: string }> = [];
    try {
      arr = raw ? JSON.parse(raw) : [];
    } catch {
      arr = [];
    }
    arr.push({ name, email, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function onNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = nlName.trim();
    const email = nlEmail.trim();
    if (!email || !email.includes("@")) {
      setNlMsg({ type: "err", text: "Informe um e-mail válido." });
      return;
    }
    try {
      saveNewsletterLocal(name, email);
      setNlMsg({ type: "ok", text: "Cadastro realizado com sucesso!" });
      setNlName("");
      setNlEmail("");
    } catch {
      setNlMsg({ type: "err", text: "Não foi possível cadastrar agora." });
    }
  }

  function exportCsv() {
    try {
      const key = "prostore:newsletter";
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr) || arr.length === 0) {
        setNlMsg({ type: "err", text: "Nenhum cadastro para exportar." });
        return;
      }
      const header = ["name", "email", "createdAt"];
      const rows = arr.map((o: any) => [o.name || "", o.email || "", o.createdAt || ""]);
      const csv = [header, ...rows]
        .map((r: any[]) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setNlMsg({ type: "err", text: "Falha ao exportar." });
    }
  }

  return (
    <main className="relative">
      <HomeSEO />

      {/* 1) Carrossel full‑bleed */}
      <HeroCarousel />

      {/* 2) Celulares em oferta */}
      <section id="mais-buscados" className="mt-10 mx-auto max-w-[1100px] px-4 scroll-mt-24">
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

      {/* 3) Depoimentos */}
      <section className="mt-10 mx-auto max-w-[1100px] px-4">
        <Testimonials />
      </section>

      {/* 4) Ofertas do dia | BBB */}
      <section id="bbb" className="mt-10 mx-auto max-w-[1100px] px-4 scroll-mt-24">
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

      {/* 5) Newsletter */}
      <section className="mt-10">
        <div className="mx-auto max-w-[1100px] rounded-2xl bg-brand-black/95 px-4 py-5 sm:px-6 sm:py-6 text-white shadow-md ring-1 ring-white/10">
          <div className="grid gap-4 md:grid-cols-[1.1fr,1fr] md:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-accent">Novidades</p>
              <h3 className="text-xl font-semibold">Receba ofertas da <span className="text-accent">pro</span><span className="text-white">Store</span></h3>
              <p className="mt-1 text-[13px] text-white/80">Descontos exclusivos e lançamentos direto no seu e‑mail.</p>
            </div>
            <form onSubmit={onNewsletterSubmit} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr,1fr,auto] sm:items-center" noValidate>
              <label className="sr-only" htmlFor="nl-name">Nome</label>
              <input id="nl-name" value={nlName} onChange={(e) => setNlName(e.target.value)} type="text" placeholder="Seu nome" autoComplete="name" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/40" />
              <label className="sr-only" htmlFor="nl-email">E-mail</label>
              <input id="nl-email" value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} type="email" inputMode="email" placeholder="Seu e‑mail" autoComplete="email" required className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/40" />
              <button type="submit" className="h-[42px] rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-sm transition active:scale-[.99] hover:opacity-90">Cadastrar</button>
            </form>
            {nlMsg && (
              <div className={"md:col-span-2 mt-1 text-[12px] " + (nlMsg.type === "ok" ? "text-white/90" : "text-rose-200")} role="status">
                {nlMsg.text}
              </div>
            )}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-white/70">Ao cadastrar você concorda com nossa <a href="/politica-de-privacidade" className="underline underline-offset-2">Política de Privacidade</a>, <a href="/termos-de-uso" className="underline underline-offset-2">Termos de Uso</a> e <a href="/politica-de-cookies" className="underline underline-offset-2">Política de Cookies</a>.</p>
          {showExport && (
            <button type="button" onClick={exportCsv} className="mt-3 inline-flex items-center rounded-xl px-3 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/20 hover:ring-white/40">Baixar cadastros (CSV)</button>
          )}
        </div>
      </section>

      {/* 6) Ofertas em Destaque */}
      <section id="destaques" className="mt-10 mx-auto max-w-[1100px] px-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Ofertas em Destaque</h2>
        </div>
        <div className="mt-4">
          <ProductGrid products={destaque as any[]} />
        </div>
      </section>
    </main>
  );
}
