"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";
import {
  CheckCircle,
  Truck,
  Shield,
  FileText,
  Award,
  Recycle,
  Battery,
  Package,
  CreditCard,
  X,
  MapPin,
  Loader2,
} from "lucide-react";

/* ========================= Types ========================= */
type Product = {
  id: string;
  brand: string;
  model?: string;
  model_key?: string;
  name: string;
  image?: string;
  price: number;
  color?: string;
  storage?: string | number;
  tag?: string;
  freeShipping?: boolean;
};

type ModelSummary = {
  model_key: string;
  brand: string;
  name: string;
  minPrice: number;
  image?: string;
  firstId: string;
};

type SpecSheet = {
  descricao: string;
  caracteristicas: Array<{ rotulo: string; valor: string }>;
};

/* ========================= Utils ========================= */
const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");

const COLOR_MAP: Record<string, string> = {
  preto: "#111111",
  branco: "#FFFFFF",
  azul: "#2563EB",
  vermelho: "#DC2626",
  verde: "#16A34A",
  amarelo: "#FACC15",
  roxo: "#7C3AED",
  lilas: "#A78BFA",
  rosa: "#EC4899",
  cinza: "#9CA3AF",
  prata: "#D1D5DB",
  grafite: "#374151",
  dourado: "#EAB308",
  laranja: "#F59E0B",
  bege: "#F5E6CC",
  marrom: "#8B5E3C",
  black: "#111111",
  white: "#FFFFFF",
  blue: "#2563EB",
  red: "#DC2626",
  green: "#16A34A",
  yellow: "#FACC15",
  purple: "#7C3AED",
  gray: "#9CA3AF",
  silver: "#D1D5DB",
  graphite: "#374151",
  gold: "#EAB308",
  orange: "#F59E0B",
};
function colorToHex(input?: string) {
  if (!input) return "#E5E7EB";
  const s = input.trim().toLowerCase();
  if (s.startsWith("#") && (s.length === 4 || s.length === 7)) return s;
  return COLOR_MAP[s] || "#E5E7EB";
}

/* ---------- Toast (sem dependências) ---------- */
function useToast(timeout = 2600) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  function show(m: string) {
    setMsg(m);
    setOpen(true);
    clearTimeout((show as any)._t);
    (show as any)._t = setTimeout(() => setOpen(false), timeout);
  }
  function hide() {
    setOpen(false);
  }
  return { open, msg, show, hide };
}
function Toast({
  open,
  msg,
  onClose,
}: {
  open: boolean;
  msg: string;
  onClose: () => void;
}) {
  return (
    <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed top-4 right-4 z-[60]">
      <div className={`transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
        <div className="pointer-events-auto flex items-start gap-3 rounded-xl border bg-white shadow-lg p-4 min-w-[280px]">
          <div className="mt-0.5 rounded-full bg-emerald-100 p-1">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-sm text-zinc-800">
            <div className="font-semibold">Tudo certo!</div>
            <div>{msg}</div>
          </div>
          <button onClick={onClose} className="ml-auto rounded-md p-1 text-zinc-500 hover:bg-zinc-100" aria-label="Fechar notificação">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================= Frete por CEP ========================= */
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

function getRegiao(uf: string | undefined): Regiao {
  return (uf && UF_REGION[uf as keyof typeof UF_REGION]) || "SE";
}

function normalizeCep(v: string) {
  return (v || "").replace(/\D/g, "").slice(0, 8);
}

/* ---------------------- Modal de CEP ---------------------- */
function CepModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect?: (frete: { tipo: "SEDEX" | "ECONOMICO"; valor: number; prazo: string }) => void;
}) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<{ logradouro?: string; bairro?: string; localidade?: string; uf?: string } | null>(null);
  const [opcoes, setOpcoes] = useState<{ tipo: "SEDEX" | "ECONOMICO"; valor: number; prazo: string }[] | null>(null);

  // carrega do localStorage quando abre
  useEffect(() => {
    if (!open) return;
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("prostore:cep") : null;
    if (saved) setCep(saved);
  }, [open]);

  async function consultar() {
    setErr(null);
    setEndereco(null);
    setOpcoes(null);
    const raw = normalizeCep(cep);
    if (raw.length !== 8) {
      setErr("Digite um CEP válido com 8 dígitos.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (data?.erro) {
        setErr("CEP não encontrado.");
        setLoading(false);
        return;
      }
      const uf = data.uf as string | undefined;
      const reg = getRegiao(uf);
      const tabela = [
        { tipo: "SEDEX" as const, valor: FRETE_TABELA.SEDEX[reg], prazo: PRAZO_TABELA.SEDEX[reg] },
        { tipo: "ECONOMICO" as const, valor: FRETE_TABELA.ECONOMICO[reg], prazo: PRAZO_TABELA.ECONOMICO[reg] },
      ];
      setEndereco({ logradouro: data.logradouro, bairro: data.bairro, localidade: data.localidade, uf });
      setOpcoes(tabela);
      if (typeof window !== "undefined") window.localStorage.setItem("prostore:cep", raw);
    } catch {
      setErr("Não foi possível consultar o CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // fecha com ESC
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
        <div className="w-full max-w-lg rounded-2xl bg-white p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-100 p-2">
              <Truck className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="text-base md:text-lg font-semibold">Calcular entrega</h3>
            <button onClick={onClose} className="ml-auto rounded-md p-1 text-zinc-500 hover:bg-zinc-100" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && consultar()}
                placeholder="Digite seu CEP"
                inputMode="numeric"
                maxLength={9}
                className="w-full pl-9 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <button
              onClick={consultar}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-emerald-600 text-white px-4 py-2 font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
            </button>
          </div>

          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

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
                    onSelect?.(o);
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

/* ========================= SPEC DB (exemplo – substitua por src/data/specs.json depois) ========================= */
const SPEC_DB: Record<string, SpecSheet> = {
  "iphone 14": {
    descricao:
      "O iPhone 14 combina desempenho e eficiência com o chip A15 Bionic (GPU de 5 núcleos). A tela Super Retina XDR de 6,1\" entrega brilho alto e contraste profundo. O sistema de câmeras com estabilização por deslocamento de sensor registra fotos nítidas mesmo em baixa luz, e o modo Cinema grava vídeos em 4K. Tem 5G, Face ID, IP68 e compatibilidade MagSafe.",
    caracteristicas: [
      { rotulo: "Tela", valor: 'Super Retina XDR OLED 6,1" (2532×1170), HDR' },
      { rotulo: "Processador", valor: "Apple A15 Bionic (GPU 5 núcleos)" },
      { rotulo: "Câmeras traseiras", valor: "12 MP principal (OIS sensor-shift) + 12 MP ultra-angular" },
      { rotulo: "Câmera frontal", valor: "12 MP TrueDepth com modo Noturno" },
      { rotulo: "Vídeo", valor: "4K até 60 fps; Modo Cinema 4K 30 fps" },
      { rotulo: "Conectividade", valor: "5G, Wi-Fi 6, Bluetooth 5.3, NFC" },
      { rotulo: "Resistência", valor: "IP68; Ceramic Shield" },
      { rotulo: "Recarga", valor: "Lightning; MagSafe até 15 W" },
    ],
  },
};

/* ========================= Página ========================= */
export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();
  const toast = useToast();
  const [cepOpen, setCepOpen] = useState(false);
  const [freteSelecionado, setFreteSelecionado] = useState<{ tipo: "SEDEX" | "ECONOMICO"; valor: number; prazo: string } | null>(null);

  /* ---------- Produto base ---------- */
  const base = useMemo(() => {
    const list = products as Product[];
    return list.find((p) => idNoExt(p.id) === params.id) || list.find((p) => p.id === params.id);
  }, [params.id]);

  if (!base) {
    return (
      <div className="container py-10">
        <h1 className="text-base md:text-lg font-semibold">Produto não encontrado</h1>
      </div>
    );
  }

  /* ---------- Variantes do mesmo modelo ---------- */
  const variantes = useMemo<Product[]>(() => {
    if (!base?.model_key) return base ? [base] : [];
    return (products as Product[]).filter((p) => p.model_key === base.model_key);
  }, [base]);

  const cores = useMemo(
    () => Array.from(new Set(variantes.map((v) => (v.color || "").trim()).filter(Boolean))),
    [variantes]
  );

  const storages = useMemo(
    () => Array.from(new Set(variantes.map((v) => String(v.storage || "")).filter(Boolean))).sort((a, b) => Number(a) - Number(b)),
    [variantes]
  );

  /* ---------- Estado da seleção ---------- */
  const [cor, setCor] = useState<string | undefined>(base.color);
  const [gb, setGb] = useState<string | undefined>(base.storage ? String(base.storage) : undefined);

  const selected = useMemo(
    () => variantes.find((v) => (!cor || v.color === cor) && (!gb || String(v.storage) === gb)) || variantes[0],
    [variantes, cor, gb]
  );

  const price = selected?.price || 0;
  const parcela = Math.ceil(price / 10);

  /* ---------- Galeria / miniaturas ---------- */
  const gallery = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of variantes) {
      const key = (v.color || "Imagem").toLowerCase();
      if (!map.has(key) && v.image) map.set(key, v.image);
    }
    if (!map.size && base.image) map.set("imagem", base.image);
    return Array.from(map.entries()).map(([key, src]) => ({ label: key, src }));
  }, [variantes, base]);

  const currentImg =
    gallery.find((g) => g.label === (cor || "").toLowerCase())?.src ||
    selected?.image ||
    base.image ||
    "/placeholder.svg";

  /* ---------- Relacionados (4) ---------- */
  const relacionados: ModelSummary[] = useMemo(() => {
    const list = products as Product[];
    const groups = new Map<string, ModelSummary>();
    for (const p of list) {
      const k = p.model_key || p.id;
      const g = groups.get(k);
      if (!g) {
        groups.set(k, { model_key: k, brand: p.brand, name: p.name, minPrice: p.price, image: p.image, firstId: p.id });
      } else {
        if (p.price < g.minPrice) g.minPrice = p.price;
      }
    }
    const currentKey = base.model_key || base.id;
    const sameBrand = Array.from(groups.values()).filter((g) => g.brand === base.brand && g.model_key !== currentKey).slice(0, 4);
    const need = 4 - sameBrand.length;
    if (need <= 0) return sameBrand;
    const others = Array.from(groups.values()).filter(
      (g) => g.model_key !== currentKey && !sameBrand.find((s) => s.model_key === g.model_key)
    );
    others.sort((a, b) => a.minPrice - b.minPrice);
    return [...sameBrand, ...others.slice(0, need)].slice(0, 4);
  }, [base]);

  /* ---------- Ações ---------- */
  function handleAdd() {
    if (!selected) return;
    add({
      id: selected.id,
      name: selected.name,
      image: selected.image,
      price: selected.price,
      color: selected.color,
      storage: selected.storage,
      freeShipping: selected.freeShipping,
    });
    toast.show("Produto adicionado ao carrinho.");
  }

  /* ========================= RENDER ========================= */
  const specKey = (base.model_key || base.name || "").toLowerCase();
  const sheet = SPEC_DB[specKey] || SPEC_DB[(base.name || "").toLowerCase()] || null;

  return (
    <>
      <Toast open={toast.open} msg={toast.msg} onClose={toast.hide} />
      <CepModal
        open={cepOpen}
        onClose={() => setCepOpen(false)}
        onSelect={(f) => setFreteSelecionado(f)}
      />

      <div className="container grid lg:grid-cols-12 gap-8 py-8">
        {/* Coluna esquerda: Galeria + conteúdo */}
        <div className="lg:col-span-7">
          {/* Galeria */}
          <div className="rounded-2xl border bg-white p-4 md:p-6">
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentImg} alt={base.name} className="h-[360px] md:h-[440px] lg:h-[480px] w-auto object-contain" />
            </div>

            {/* Miniaturas */}
            {gallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {gallery.map((g) => {
                  const active = g.src === currentImg || g.label === (cor || "").toLowerCase();
                  return (
                    <button
                      key={g.src}
                      onClick={() => {
                        const found = variantes.find((v) => v.image === g.src && v.color)?.color;
                        if (found) setCor(found);
                      }}
                      className={`rounded-xl border ${active ? "border-emerald-600" : "border-zinc-300"} bg-white p-1 hover:shadow-sm`}
                      aria-pressed={active}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.src} alt={g.label} className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-lg" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Descrição / Características */}
          <div className="mt-8 grid gap-6">
            <details className="rounded-2xl border p-5 bg-white" open>
              <summary className="text-sm md:text-base font-semibold cursor-pointer">Descrição do produto</summary>
              <div className="text-[13px] md:text-sm text-zinc-700 mt-2 leading-relaxed">
                {sheet
                  ? sheet.descricao
                  : `${base.name} novo, homologado pela Anatel e com Nota Fiscal. Desempenho, câmera e bateria equilibrados para uso diário.`}
              </div>
            </details>

            <details className="rounded-2xl border p-5 bg-white" open>
              <summary className="text-sm md:text-base font-semibold cursor-pointer">Características técnicas</summary>
              <div className="mt-2">
                {sheet ? (
                  <ul className="text-[13px] md:text-sm text-zinc-700 space-y-2">
                    {sheet.caracteristicas.map((c) => (
                      <li key={c.rotulo}>
                        <span className="text-zinc-600">{c.rotulo}:</span>{" "}
                        <span className="font-medium">{c.valor}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="text-[13px] md:text-sm text-zinc-700 space-y-2">
                    <li>
                      <span className="text-zinc-600">Armazenamento:</span>{" "}
                      <span className="font-medium">{storages.join(" / ")} GB</span>
                    </li>
                    <li><span className="text-zinc-600">Conectividade:</span> <span className="font-medium">4G/5G, Wi-Fi, Bluetooth, NFC</span></li>
                    <li><span className="text-zinc-600">Segurança:</span> <span className="font-medium">Biometria/Face ID</span></li>
                  </ul>
                )}
              </div>
            </details>
          </div>

          {/* Quem viu, viu também */}
          {relacionados.length > 0 && (
            <section className="mt-10">
              <h2 className="text-base md:text-lg font-semibold mb-4">Quem viu, viu também</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relacionados.map((r) => {
                  const href = `/produto/${idNoExt(r.firstId)}`;
                  return (
                    <Link key={r.model_key} href={href} className="rounded-xl border p-3 bg-white hover:shadow-sm transition">
                      <div className="flex items-center justify-center h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.image || "/placeholder.svg"} alt={r.name} className="max-h-44 object-contain" />
                      </div>
                      <div className="mt-2 text-[12px] md:text-sm text-zinc-500">{r.brand}</div>
                      <div className="font-medium text-[13px] md:text-sm line-clamp-2 min-h-[2.8rem]">{r.name}</div>
                      <div className="mt-1 text-[11px] text-zinc-500">A partir de</div>
                      <div className="text-emerald-700 font-semibold text-lg tracking-tight">{br(withCoupon(r.minPrice))}</div>
                      <div className="text-[11px] text-zinc-500">10x sem juros de {br(Math.ceil(r.minPrice / 10))}</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Coluna direita: Card de compra */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border p-5 md:p-6 bg-white shadow-sm sticky top-20">
            <h1 className="text-xl md:text-2xl font-semibold leading-tight">{base.name}</h1>

            {/* Cor (swatches) */}
            {cores.length > 0 && (
              <div className="mt-4">
                <div className="text-xs md:text-sm text-zinc-600 mb-1">
                  Cor: <span className="font-medium">{cor}</span>
                </div>
                <div className="flex gap-3">
                  {cores.map((c) => {
                    const hex = colorToHex(c);
                    const selectedState = cor === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setCor(c)}
                        className={`h-7 w-7 md:h-8 md:w-8 rounded-full border-2 transition ${
                          selectedState ? "border-emerald-600 ring-2 ring-emerald-100" : "border-zinc-300 hover:border-zinc-400"
                        }`}
                        aria-label={`Cor ${c}`}
                        aria-pressed={selectedState}
                        title={c}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Capacidade (chips) */}
            {storages.length > 0 && (
              <div className="mt-4">
                <div className="text-xs md:text-sm text-zinc-600 mb-1">Capacidade</div>
                <div className="flex flex-wrap gap-2">
                  {storages.map((s) => {
                    const selectedState = gb === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setGb(s)}
                        className={`px-3 py-1 text-xs md:text-sm rounded-full border transition ${
                          selectedState ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-zinc-300 hover:bg-zinc-50"
                        }`}
                        aria-pressed={selectedState}
                      >
                        {s} GB
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Preço */}
            <div className="mt-5 space-y-1">
              <div className="text-[24px] md:text-[28px] font-semibold tracking-tight text-emerald-700">
                {br(withCoupon(price))}{" "}
                <span className="text-zinc-600 text-[15px] md:text-[16px] font-medium">no PIX</span>
              </div>
              <div className="text-xs md:text-sm text-zinc-500">
                Ou {br(price)} em até 10x de {br(parcela)}{" "}
                <span className="text-emerald-700 font-medium">sem juros</span>
              </div>
              {freteSelecionado && (
                <div className="text-xs mt-1 text-zinc-600">
                  Frete selecionado: <b>{freteSelecionado.tipo === "ECONOMICO" ? "Econômico" : "SEDEX"}</b>{" "}
                  — {br(freteSelecionado.valor)} • {freteSelecionado.prazo}
                </div>
              )}
            </div>

            {/* Ações — paleta preto & verde */}
            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={handleAdd}
                className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm transition"
              >
                Adicionar ao carrinho
              </button>
              <Link
                href="/checkout"
                className="w-full text-center bg-zinc-900 text-white font-medium py-3 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-zinc-300 shadow-sm transition"
              >
                Comprar
              </Link>
            </div>

            {/* Informações com ícones */}
            <div className="mt-6 divide-y">
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <Truck className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <div className="font-medium">Receba em seu endereço</div>
                  <div className="text-zinc-600">
                    <button onClick={() => setCepOpen(true)} className="text-emerald-700 underline">
                      Consultar entrega
                    </button>
                  </div>
                </div>
              </div>
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Vendido e entregue por proStore</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <Shield className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">180 dias de garantia</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <Award className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Homologado pela Anatel</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <FileText className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Produto novo e original com Nota Fiscal</div>
              </div>

              {/* Extras opcionais */}
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <Package className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Em estoque e pronto para envio</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <Battery className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Bateria em padrão de fábrica</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <CreditCard className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">10x sem juros no cartão</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-xs md:text-sm">
                <Recycle className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Embalagem segura e sustentável</div>
              </div>
            </div>

            <div className="text-[10px] md:text-[11px] text-zinc-500 pt-3">
              * Desconto aplicado automaticamente no carrinho. Pagamento finalizado no WhatsApp.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
