// src/app/produto/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import productsData from "@/data/products.json";
import { useCart } from "@/hooks/useCart";
import DescriptionAndSpecs from "@/components/ProductDetails/DescriptionAndSpecs";
import {
  Truck,
  CheckCircle2,
  Shield,
  FileText,
  ChevronRight,
  X,
  Loader2,
  ShoppingCart,
  CreditCard,
  QrCode,
} from "lucide-react";

/* =================== Tipos =================== */
type P = {
  id: string;
  name: string;
  brand?: string;
  model_key?: string;
  image?: string;
  images?: string[];
  price: number;
  storage?: number | string;
  color?: string;
  tag?: string;
};

/* =================== Utils =================== */
const norm = (v?: string) => String(v ?? "").toLowerCase();
const br = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** 30% OFF no PIX */
const withPix = (v: number) => Math.round(v * 0.7);

/** remove “### GB” do nome para casar irmãos */
const stripStorageFromName = (name: string) =>
  name.replace(/\b(\d{2,4})\s?gb\b/gi, "").trim();

const parseStorage = (p: P): number | undefined => {
  if (p.storage != null) return Number(String(p.storage).replace(/\D/g, ""));
  const m = p.name.match(/(\d{2,4})\s?gb/i);
  return m ? Number(m[1]) : undefined;
};

const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");

/* paleta de “bolinhas” de cor quando não há hex disponível */
const COLOR_SWATCH = [
  { name: "Preto", css: "#111827" },
  { name: "Branco", css: "#f3f4f6" },
  { name: "Azul", css: "#1d4ed8" },
  { name: "Verde", css: "#16a34a" },
  { name: "Roxo", css: "#7c3aed" },
  { name: "Amarelo", css: "#facc15" },
  { name: "Vermelho", css: "#ef4444" },
];

/* =================== Modal de CEP/Frete =================== */
type Regiao = "N" | "NE" | "CO" | "SE" | "S";
const UF_REGION: Record<string, Regiao> = {
  AC: "N", AM: "N", AP: "N", PA: "N", RO: "N", RR: "N", TO: "N",
  AL: "NE", BA: "NE", CE: "NE", MA: "NE", PB: "NE", PE: "NE", PI: "NE", RN: "NE", SE: "NE",
  DF: "CO", GO: "CO", MT: "CO", MS: "CO",
  ES: "SE", MG: "SE", RJ: "SE", SP: "SE",
  PR: "S", RS: "S", SC: "S",
};
const FRETE_TABELA = {
  SEDEX: { SE: 24.9, S: 29.9, CO: 34.9, NE: 39.9, N: 49.9 },
  ECONOMICO: { SE: 14.9, S: 19.9, CO: 24.9, NE: 29.9, N: 39.9 },
};
const PRAZO_TABELA = {
  SEDEX: { SE: "2–4 dias úteis", S: "3–5 dias úteis", CO: "3–6 dias úteis", NE: "4–7 dias úteis", N: "5–9 dias úteis" },
  ECONOMICO: { SE: "4–7 dias úteis", S: "5–8 dias úteis", CO: "6–10 dias úteis", NE: "7–12 dias úteis", N: "10–15 dias úteis" },
};
type Frete = { tipo: "SEDEX" | "ECONOMICO"; valor: number; prazo: string };
type EnderecoViaCep = { logradouro?: string; bairro?: string; localidade?: string; uf?: string };

const normalizeCep = (v: string) => (v || "").replace(/\D/g, "").slice(0, 8);
const getRegiao = (uf?: string): Regiao => (uf && UF_REGION[uf]) || "SE";

/* Modal isolado dentro do arquivo — não depende de nada externo */
function CepModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (payload: { cep: string; endereco: EnderecoViaCep; frete: Frete }) => void;
}) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<EnderecoViaCep | null>(null);
  const [opcoes, setOpcoes] = useState<Frete[] | null>(null);

  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("prostore:cep");
    if (saved) setCep(saved);
  }, [open]);

  async function consultar() {
    setErro(null);
    setEndereco(null);
    setOpcoes(null);
    const raw = normalizeCep(cep);
    if (raw.length !== 8) {
      setErro("Digite um CEP válido (8 dígitos).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (data?.erro) {
        setErro("CEP não encontrado.");
        setLoading(false);
        return;
      }
      const uf = data.uf as string | undefined;
      const reg = getRegiao(uf);
      const op: Frete[] = [
        { tipo: "SEDEX", valor: FRETE_TABELA.SEDEX[reg], prazo: PRAZO_TABELA.SEDEX[reg] },
        { tipo: "ECONOMICO", valor: FRETE_TABELA.ECONOMICO[reg], prazo: PRAZO_TABELA.ECONOMICO[reg] },
      ];
      const end: EnderecoViaCep = {
        logradouro: data.logradouro,
        bairro: data.bairro,
        localidade: data.localidade,
        uf,
      };
      setEndereco(end);
      setOpcoes(op);
      localStorage.setItem("prostore:cep", raw);
      localStorage.setItem("prostore:endereco", JSON.stringify(end));
    } catch {
      setErro("Falha ao consultar CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-100 p-2">
              <Truck className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="text-lg font-semibold">Calcular entrega</h3>
            <button onClick={onClose} className="ml-auto rounded-md p-1 text-zinc-500 hover:bg-zinc-100" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && consultar()}
                placeholder="Digite seu CEP"
                inputMode="numeric"
                maxLength={9}
                className="w-full pl-3 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <button
              onClick={consultar}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-4 py-2 font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
            </button>
          </div>

          {erro && <div className="mt-3 text-sm text-red-600">{erro}</div>}

          {endereco && (
            <div className="mt-4 rounded-lg border bg-zinc-50 p-3 text-sm text-zinc-700">
              Entrega para: <b>{[endereco.logradouro, endereco.bairro].filter(Boolean).join(" - ")}</b> — {endereco.localidade}/{endereco.uf}
            </div>
          )}

          {opcoes && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opcoes.map((o) => (
                <button
                  key={o.tipo}
                  onClick={() => {
                    const raw = normalizeCep(cep);
                    localStorage.setItem("prostore:frete_selected", JSON.stringify(o));
                    onSelect({ cep: raw, endereco: endereco || {}, frete: o });
                    onClose();
                  }}
                  className="text-left rounded-xl border p-4 hover:shadow-sm transition"
                >
                  <div className="font-semibold">{o.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"}</div>
                  <div className="text-sm text-zinc-600">{o.prazo}</div>
                  <div className="text-lg font-semibold text-emerald-700 mt-1">{br(o.valor)}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =================== Página Produto =================== */
export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const cart: any = useCart();

  // Local data
  const data = productsData as P[];
  // Resolve produto pelo id (com/sem extensão)
  const product = useMemo(() => {
    const pid = params.id;
    return (
      data.find((p) => idNoExt(p.id) === pid) ||
      data.find((p) => norm(p.name) === norm(pid)) ||
      data[0]
    );
  }, [data, params.id]);

  // Irmãos por model_key (ou nome sem "GB")
  const siblings = useMemo(() => {
    const key = product.model_key || stripStorageFromName(product.name).toLowerCase();
    return data.filter(
      (p) =>
        (p.model_key && p.model_key === product.model_key) ||
        stripStorageFromName(p.name).toLowerCase() === key
    );
  }, [data, product]);

  // Opções de cor e armazenamento
  const colorOptions = useMemo(() => {
    const set = new Map<string, { name: string; image?: string }>();
    siblings.forEach((s) => {
      const c = s.color?.trim();
      if (c && !set.has(c.toLowerCase())) set.set(c.toLowerCase(), { name: c, image: s.image || s.images?.[0] });
    });
    // fallback caso catálogo não tenha campo "color"
    if (set.size === 0) {
      COLOR_SWATCH.forEach((c) => set.set(c.name.toLowerCase(), { name: c.name }));
    }
    return Array.from(set.values());
  }, [siblings]);

  const storageOptions = useMemo(() => {
    const set = new Set<number>();
    siblings.forEach((s) => {
      const st = parseStorage(s);
      if (st) set.add(st);
    });
    const arr = Array.from(set).sort((a, b) => a - b);
    // fallback
    return arr.length ? arr : [128, 256, 512];
  }, [siblings]);

  // Seleção atual
  const [selectedColor, setSelectedColor] = useState<string>(() => colorOptions[0]?.name || "Preto");
  const [selectedStorage, setSelectedStorage] = useState<number>(() => storageOptions[0] || 128);

  // imagem principal
  const selectedImage = useMemo(() => {
    const byColor = siblings.find(
      (s) => s.color && norm(s.color) === norm(selectedColor) && parseStorage(s) === selectedStorage
    );
    const byColorOnly = siblings.find((s) => s.color && norm(s.color) === norm(selectedColor));
    return byColor?.image || byColorOnly?.image || product.images?.[0] || product.image || "/placeholder.svg";
  }, [siblings, selectedColor, selectedStorage, product]);

  // preço por GB (pega o menor entre os “irmãos” com aquele storage)
  const selectedPrice = useMemo(() => {
    const sameStorage = siblings.filter((s) => parseStorage(s) === selectedStorage);
    if (sameStorage.length) {
      return Math.min(...sameStorage.map((s) => s.price || product.price));
    }
    return product.price;
  }, [siblings, selectedStorage, product]);

  // CEP / frete visual
  const [cepModal, setCepModal] = useState(false);
  const [cep, setCep] = useState<string | undefined>(undefined);
  const [frete, setFrete] = useState<Frete | undefined>(undefined);
  useEffect(() => {
    const c = localStorage.getItem("prostore:cep") || undefined;
    const f = localStorage.getItem("prostore:frete_selected");
    if (c) setCep(c);
    if (f) try { setFrete(JSON.parse(f) as Frete); } catch {}
  }, []);

  function onFreteSelect(payload: { cep: string; frete: Frete; endereco: EnderecoViaCep }) {
    setCep(payload.cep);
    setFrete(payload.frete);
  }

  // Carrinho
  function addToCart() {
    cart?.add?.({
      id: product.id,
      name: `${product.name} ${selectedStorage} GB`,
      price: selectedPrice,
      image: selectedImage,
      color: selectedColor,
      storage: selectedStorage,
      qty: 1, // <- importante: evita o erro de 'quantity'
    });
  }
  function comprarAgora() {
    addToCart();
    router.push("/checkout");
  }

  // “Quem viu, viu também”
  const recommendations = useMemo(() => {
    const sameBrand = data.filter((p) => p.brand && p.brand === product.brand);
    return sameBrand
      .filter((p) => idNoExt(p.id) !== idNoExt(product.id))
      .slice(0, 4);
  }, [data, product]);

  return (
    <>
      <CepModal open={cepModal} onClose={() => setCepModal(false)} onSelect={onFreteSelect} />

      <div className="py-6 md:py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Galeria */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border bg-white p-4">
              <div className="relative mx-auto aspect-[1/1] max-h-[520px] w-full overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-7">
            <h1 className="text-xl md:text-2xl font-semibold text-zinc-900">
              {product.name} {selectedStorage} GB
            </h1>
            <div className="mt-1 text-sm text-zinc-500">{product.brand}</div>

            {/* Cor */}
            <div className="mt-4">
              <div className="text-sm text-zinc-700">Cor: <b>{selectedColor}</b></div>
              <div className="mt-2 flex flex-wrap gap-2">
                {colorOptions.map((c) => {
                  const colorMeta = COLOR_SWATCH.find((s) => norm(s.name) === norm(c.name));
                  const css = colorMeta?.css || "#e5e7eb";
                  const selected = norm(c.name) === norm(selectedColor);
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`h-8 w-8 rounded-full border ${selected ? "border-emerald-600 ring-2 ring-emerald-300" : "border-zinc-300"}`}
                      style={{ backgroundColor: css }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Armazenamento */}
            <div className="mt-4">
              <div className="text-sm text-zinc-700">Capacidade</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {storageOptions.map((st) => {
                  const selected = st === selectedStorage;
                  return (
                    <button
                      key={st}
                      onClick={() => setSelectedStorage(st)}
                      className={`rounded-lg px-3 py-2 text-sm border ${selected ? "border-emerald-600 ring-2 ring-emerald-200 bg-emerald-50" : "border-zinc-300 hover:bg-zinc-50"}`}
                    >
                      {st} GB
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preço */}
            <div className="mt-5 flex flex-col gap-1">
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-700">
                {br(withPix(selectedPrice))} <span className="text-base font-semibold">no PIX</span>
              </div>
              <div className="text-sm text-zinc-600">
                ou {br(selectedPrice)} em até <b>10x sem juros</b>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={addToCart}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold shadow-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                Adicionar ao carrinho
              </button>
              <button
                onClick={compro nagora}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-black text-white px-5 py-3 font-semibold shadow-sm"
              >
                <CreditCard className="h-5 w-5" />
                Comprar
              </button>
            </div>

            {/* Entrega / CEP */}
            <div className="mt-5 rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-emerald-700" />
                <span className="font-medium">Receba em seu endereço</span>
                <button
                  onClick={() => setCepModal(true)}
                  className="ml-2 text-emerald-700 underline inline-flex items-center gap-1"
                >
                  Consultar entrega <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {cep && (
                <div className="mt-2 text-sm text-zinc-700">
                  CEP <b>{cep}</b>{" "}
                  {frete ? (
                    <>
                      • {frete.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"} • {frete.prazo} •{" "}
                      <b className="text-emerald-700">{br(frete.valor)}</b>
                    </>
                  ) : (
                    <span className="text-amber-700">— selecione a opção de frete.</span>
                  )}
                </div>
              )}
            </div>

            {/* Selos */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-[12px]">
              <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Novo e lacrado
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
                <FileText className="h-4 w-4 text-emerald-700" /> Nota Fiscal
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
                <Shield className="h-4 w-4 text-emerald-700" /> 180 dias de garantia
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
                <QrCode className="h-4 w-4 text-emerald-700" /> 30% OFF no PIX
              </div>
            </div>
          </div>
        </div>

        {/* Descrição + Especificações */}
        <DescriptionAndSpecs
          product={{
            name: product.name,
            brand: product.brand,
            storage: selectedStorage,
            color: selectedColor,
          }}
        />

        {/* Quem viu, viu também */}
        {recommendations.length > 0 && (
          <section className="mt-8">
            <h3 className="text-base md:text-lg font-semibold">Quem viu, viu também</h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.map((p) => (
                <Link
                  key={p.id}
                  href={`/produto/${idNoExt(p.id)}`}
                  className="rounded-2xl border bg-white p-3 hover:shadow-sm transition"
                >
                  <div className="h-44 grid place-items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image || p.images?.[0] || "/placeholder.svg"}
                      alt={p.name}
                      className="max-h-40 object-contain"
                    />
                  </div>
                  <div className="text-[12px] md:text-sm text-zinc-500 mt-1">{p.brand}</div>
                  <div className="font-medium text-[13px] md:text-sm line-clamp-2 min-h-[2.8rem]">
                    {p.name}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500">A partir de</div>
                  <div className="text-emerald-700 font-semibold text-lg tracking-tight">
                    {br(withPix(p.price))}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    10x sem juros de {br(Math.ceil(p.price / 10))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* estilos locais só para esta página */}
      <style jsx global>{`
        .prose :where(p):not(:where([class~=not-prose] *)) { margin: .25rem 0; }
      `}</style>
    </>
  );
}
