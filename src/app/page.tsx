"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import productsData from "@/data/products.json";

// ===== tipos util =====
type P = any;

// ---------- utils ----------
const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const isBrand = (p: P, target: "apple" | "samsung") => {
  const b = norm(p?.brand);
  const n = norm(`${p?.brand} ${p?.name}`);
  return b === target || n.includes(target);
};

// Escore básico: preço menor + nome mais curto
const score = (p: P) => {
  const price = Number(p?.price || 0);
  const len = String(p?.name || "").length;
  return price * 0.9 + len * 10;
};

const pickTop = (arr: P[], n: number) =>
  [...arr].sort((a, b) => score(a) - score(b)).slice(0, n);

// Embaralhar intercalando
function interleave<A>(a: A[], b: A[]) {
  const res: A[] = [];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i]) res.push(a[i]);
    if (b[i]) res.push(b[i]);
  }
  return res;
}

// Sorteio estável (seed simples) para “frete grátis”
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRandomIdsStable(list: P[], n: number, seed = 12345) {
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

export default function Page() {
  // ==================== CATÁLOGO (inalterado) ====================
  const raw: P[] = productsData as any[];

  // Frete grátis em 20 produtos (estável)
  const FREE_COUNT = 20;
  const freeIds = pickRandomIdsStable(raw, FREE_COUNT, 202409);
  const all: P[] = raw.map((p) => ({
    ...p,
    freeShipping: freeIds.has(String(p?.id)),
  }));

  // 1) CELULARES EM OFERTA: 4 Samsung + 4 Apple (intercalados)
  const samsungs = pickTop(all.filter((p) => isBrand(p, "samsung")), 4);
  const apples = pickTop(all.filter((p) => isBrand(p, "apple")), 4);
  const emOferta = interleave(samsungs, apples).slice(0, 8);

  // 2) OFERTAS DO DIA | BBB — 8 melhores pontuados
  const ofertasDia = pickTop(all, 8);

  // 3) OFERTAS EM DESTAQUE — 12 itens (fallback se necessário)
  const destaque = pickTop(all, 12);
  const destaqueSafe = destaque.length >= 8 ? destaque : all.slice(0, 12);

  // ==================== NEWSLETTER (refinada) ====================
  const [nlName, setNlName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlMsg, setNlMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    // Só mostra o botão de exportar no localhost ou com ?admin=1
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
        .map((r) => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(","))
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
    <main className="space-y-10">
      {/* 1) Hero simples (inalterado) */}
      <section className="mx-auto max-w-[1100px] px-4">
        <div className="rounded-2xl bg-gradient-to-r from-black to-zinc-900 px-6 py-8 text-white shadow-md ring-1 ring-zinc-800">
          <div className="grid gap-5 md:grid-cols-[1.4fr,1fr] md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Apple & Samsung com 30% OFF
              </h1>
              <p className="mt-1 text-sm text-white/80">
                Pague no PIX ou Boleto (30% OFF). Até 10x sem juros no cartão.
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  href="/ofertas"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Ver ofertas
                </Link>
                <Link
                  href="/mais-buscados"
                  className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white/10"
                >
                  Mais buscados
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/90">
              <p className="mb-1 font-semibold">Condição exclusiva</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>30% OFF no PIX/Boleto</li>
                <li>Em até 10x sem juros</li>
                <li>Frete grátis em produtos selecionados</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2) Celulares em oferta */}
      <section className="mx-auto max-w-[1100px] px-4">
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

      {/* 3) Ofertas do dia | BBB */}
      <section className="mx-auto max-w-[1100px] px-4">
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

      {/* 5) Ofertas em destaque */}
      <section className="mx-auto max-w-[1100px] px-4">
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

      {/* 6) Newsletter — refinada, funcional e sem botão público de export */}
      <section className="mt-12">
        <div className="mx-auto max-w-[1100px] rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-650 to-emerald-700 px-6 py-8 shadow-md ring-1 ring-emerald-900/20">
          <div className="grid gap-6 md:grid-cols-[1.2fr,1fr] md:items-center">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Inscreva-se na nossa Newsletter</h3>
              <p className="mt-1 text-sm text-white/90">
                Promoções exclusivas e novidades da <span className="font-semibold">proStore</span> direto no seu e-mail.
              </p>
            </div>

            {/* Campos + botão (UI mais elegante e compacta) */}
            <form
              onSubmit={onNewsletterSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
              noValidate
            >
              <label className="sr-only" htmlFor="nl-name">Nome</label>
              <input
                id="nl-name"
                value={nlName}
                onChange={(e) => setNlName(e.target.value)}
                type="text"
                placeholder="Seu nome"
                className="w-full rounded-xl bg-white/95 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none ring-1 ring-white/40 focus:ring-2 focus:ring-white"
              />

              <label className="sr-only" htmlFor="nl-email">E-mail</label>
              <input
                id="nl-email"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                type="email"
                placeholder="Seu e-mail"
                className="w-full rounded-xl bg-white/95 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none ring-1 ring-white/40 focus:ring-2 focus:ring-white"
                required
              />

              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Cadastrar
              </button>
            </form>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <p className="text-[11px] leading-relaxed text-white/90">
                *Ao clicar em cadastrar você autoriza a coleta e o tratamento dos dados conforme nossa
                <a href="/politica-de-privacidade" className="underline underline-offset-2"> Política de Privacidade</a>,
                <a href="/termos-de-uso" className="underline underline-offset-2"> Termos de Uso</a> e
                <a href="/politica-de-cookies" className="underline underline-offset-2"> Política de Cookies</a>.
              </p>

              {/* Botão de exportação só para admin/local */}
              {showExport && (
                <button
                  type="button"
                  onClick={exportCsv}
                  className="mt-2 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/30 hover:bg-white/20"
                  title="Exportar e-mails cadastrados (CSV)"
                >
                  Baixar cadastros (CSV)
                </button>
              )}
            </div>

            {/* Mensagem discreta */}
            {nlMsg && (
              <div
                className={
                  "md:col-span-2 mt-1 text-sm " +
                  (nlMsg.type === "ok" ? "text-white/95" : "text-rose-100")
                }
                role="status"
              >
                {nlMsg.text}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
