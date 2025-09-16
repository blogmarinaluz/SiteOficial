// src/app/produto/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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

/* =================== CORES =================== */
const COLOR_HEX: Record<string, string> = {
  "preto": "#0f172a",
  "black": "#0f172a",
  "grafite": "#2f3133",
  "graphite": "#2f3133",
  "meia-noite": "#0b1220",
  "meia noite": "#0b1220",
  "midnight": "#0b1220",
  "branco": "#f9fafb",
  "estelar": "#f2f2ea",
  "starlight": "#f2f2ea",
  "prata": "#e5e7eb",
  "silver": "#e5e7eb",
  "azul": "#1e3a8a",
  "blue": "#1e3a8a",
  "verde": "#065f46",
  "green": "#065f46",
  "vermelho": "#991b1b",
  "red": "#991b1b",
  "rosa": "#db2777",
  "pink": "#db2777",
  "dourado": "#f59e0b",
  "gold": "#f59e0b",
  "roxo": "#6d28d9",
  "purple": "#6d28d9",
};

function colorToHex(input?: string) {
  if (!input) return "#e5e7eb";
  const k = norm(input).normalize("NFD").replace(/\p{Diacritic}/gu, "");
  for (const [name, hex] of Object.entries(COLOR_HEX)) {
    const nk = name.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    if (k.includes(nk)) return hex;
  }
  return "#e5e7eb";
}

/* =================== CEP / Frete (fake) =================== */
type EnderecoViaCep = {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd?: string;
};

type Frete = {
  tipo: "expresso" | "economico" | "retira";
  prazo: string;
  valor: number;
};

const normalizeCep = (v: string) => (v || "").replace(/\D/g, "");
const safeDelay = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

    try {
      setLoading(true);
      await safeDelay(350);

      const fake: EnderecoViaCep = {
        cep: raw.replace(/(\d{5})(\d{3})/, "$1-$2"),
        logradouro: "Rua Exemplo",
        bairro: "Centro",
        localidade: "Cidade",
        uf: "SP",
      };
      setEndereco(fake);

      const opts: Frete[] = [
        { tipo: "economico", prazo: "5 a 8 dias úteis", valor: 29.9 },
        { tipo: "expresso", prazo: "2 a 4 dias úteis", valor: 49.9 },
        { tipo: "retira", prazo: "Retire amanhã", valor: 0 },
      ];
      setOpcoes(opts);

      localStorage.setItem("prostore:cep", raw);
    } catch {
      setErro("Não foi possível calcular o frete agora.");
    } finally {
      setLoading(false);
    }
  }

  function escolher(o: Frete) {
    const raw = normalizeCep(cep);
    if (!endereco) return;
    onSelect({ cep: raw, endereco, frete: o });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-zinc-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Calcular frete</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-zinc-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <input
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Digite seu CEP"
              className="input w-40"
              maxLength={9}
            />
            <button onClick={consultar} className="btn-secondary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
            </button>
          </div>

          {erro && <div className="note text-rose-700">{erro}</div>}

          {endereco && (
            <div className="note text-sm">
              <div>
                <strong>Endereço:</strong> {endereco.logradouro}, {endereco.bairro} – {endereco.localidade}/{endereco.uf}
              </div>
            </div>
          )}

          {opcoes && (
            <ul className="space-y-2">
              {opcoes.map((o) => (
                <li key={o.tipo} className="trust">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium capitalize">{o.tipo}</span>
                  <span className="text-zinc-500">•</span>
                  <span>{o.prazo}</span>
                  <span className="ml-auto font-semibold">{br(o.valor)}</span>
                  <button onClick={() => escolher(o)} className="ml-3 btn-primary">
                    Escolher
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <style jsx global>{`
          .input { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; outline: none; }
          .input:focus { box-shadow: 0 0 0 2px rgba(16, 185, 129, .25); border-color: #10b981; }
          .btn-primary { background:#10b981; color:#fff; padding:8px 12px; border-radius:10px; font-weight:600; }
          .btn-primary:hover { background:#0e9f6e; }
          .btn-secondary { background:#111827; color:#fff; padding:8px 12px; border-radius:10px; font-weight:500; }
          .btn-secondary:hover { background:#000; }
          .note { background:#f8fafc; border:1px solid #e5e7eb; border-radius:10px; padding:10px; font-size:13px; color:#374151; }
          .trust { display:flex; align-items:center; gap:8px; font-weight:500; color:#111827; border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; background:#fff; }
        `}</style>
      </div>
    </div>
  );
}

/* =================== SEO helpers =================== */
function absUrl(path: string): string {
  if (!path) return "";
  try {
    if (path.startsWith("http")) return path;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return origin + (path.startsWith("/") ? path : `/${path}`);
  } catch {
    return path;
  }
}
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

function ProductSEO({
  product,
  paramsId,
  selectedImage,
  selectedPrice,
  selectedStorage,
  selectedColor,
}: {
  product: any;
  paramsId: string;
  selectedImage: string;
  selectedPrice: number;
  selectedStorage?: number;
  selectedColor?: string;
}) {
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/produto/${paramsId}` : `/produto/${paramsId}`;
  const title = `${product?.name}${selectedStorage ? ` ${selectedStorage} GB` : ""} | proStore`;
  const description = `${product?.brand || ""} ${product?.name || ""}${
    selectedStorage ? ` ${selectedStorage}GB` : ""
  } com 30% OFF no PIX. Frete grátis em itens selecionados.`.trim();

  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product?.name}${selectedStorage ? ` ${selectedStorage} GB` : ""}`,
    brand: { "@type": "Brand", name: product?.brand || "proStore" },
    sku: String(product?.id || paramsId),
    image: [absUrl(selectedImage || product?.image || "")],
    description,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: Number(selectedPrice || product?.price || 0),
      availability: "https://schema.org/InStock",
      url,
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
    },
  };

  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: typeof window !== "undefined" ? window.location.origin : "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produto",
        item: url,
      },
    ],
  };

  useEffect(() => {
    try {
      document.title = title;
      setMetaTag("description", description);
      setCanonical(url);

      setMetaProperty("og:title", title);
      setMetaProperty("og:description", description);
      setMetaProperty("og:type", "product");
      setMetaProperty("og:url", url);
      setMetaProperty("og:image", absUrl(selectedImage || product?.image || ""));
      setMetaTag("twitter:card", "summary_large_image");
      setMetaTag("twitter:title", title);
      setMetaTag("twitter:description", description);
    } catch {}
  }, [title, description, url, selectedImage]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
    </>
  );
}

/* =================== Página Produto =================== */
export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const cart: any = useCart();

  const data = productsData as P[];
  const product = useMemo(() => {
    const pid = params.id;
    return (
      data.find((p) => idNoExt(p.id) === pid) ||
      data.find((p) => norm(p.name) === norm(pid)) ||
      data[0]
    );
  }, [data, params.id]);

  const siblings = useMemo(() => {
    const key = product.model_key || stripStorageFromName(product.name).toLowerCase();
    return data.filter(
      (p) =>
        (p.model_key && p.model_key === product.model_key) ||
        stripStorageFromName(p.name).toLowerCase() === key
    );
  }, [data, product]);

  const colorOptions = useMemo(() => {
    const cols = new Set<string>();
    siblings.forEach((s) => {
      const c = s.color || "";
      if (c) cols.add(c);
    });
    const arr = Array.from(cols);
    return arr.length ? arr.map((name) => ({ name })) : [{ name: "Preto" }];
  }, [siblings]);

  const storageOptions = useMemo(() => {
    const set = new Set<number>();
    siblings.forEach((s) => {
      const st = parseStorage(s);
      if (st) set.add(st);
    });
    const arr = Array.from(set).sort((a, b) => a - b);
    return arr.length ? arr : [128, 256, 512];
  }, [siblings]);

  const [selectedColor, setSelectedColor] = useState<string>(() => colorOptions[0]?.name || "Preto");
  const [selectedStorage, setSelectedStorage] = useState<number>(() => storageOptions[0] || 128);

  const selectedImage = useMemo(() => {
    const byColor = siblings.find(
      (s) =>
        norm(s.color) === norm(selectedColor) && parseStorage(s) === selectedStorage && s.image
    );
    const byColorOnly = siblings.find((s) => norm(s.color) === norm(selectedColor) && s.image);
    return byColor?.image || byColorOnly?.image || product.images?.[0] || product.image || "/placeholder.svg";
  }, [siblings, selectedColor, selectedStorage, product]);

  const selectedPrice = useMemo(() => {
    const sameStorage = siblings.filter((s) => parseStorage(s) === selectedStorage);
    if (sameStorage.length) {
      return Math.min(...sameStorage.map((s) => s.price || product.price));
    }
    return product.price;
  }, [siblings, selectedStorage, product]);

  const [cepModal, setCepModal] = useState(false);
  const [cep, setCep] = useState<string | undefined>(undefined);
  const [frete, setFrete] = useState<Frete | undefined>(undefined);
  function onFrete(payload: { cep: string; endereco: EnderecoViaCep; frete: Frete }) {
    setCep(payload.cep);
    setFrete(payload.frete);
  }

  function addToCart() {
    cart.add(
      {
        id: product.id,
        name: `${product.name} ${selectedStorage} GB`,
        image: selectedImage.startsWith("/") ? selectedImage : `/${selectedImage}`,
        price: selectedPrice,
        freeShipping: !!product.tag || product.tag === "frete-gratis",
        color: selectedColor,
        storage: selectedStorage,
      },
      1
    );
  }

  return (
    <>
      {/* SEO */}
      <ProductSEO
        product={product}
        paramsId={params.id}
        selectedImage={selectedImage}
        selectedPrice={selectedPrice}
        selectedStorage={selectedStorage}
        selectedColor={selectedColor}
      />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="my-4 text-sm text-zinc-500">
          <Link href="/" className="hover:underline">
            Início
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700 font-medium">{product.name}</span>
        </nav>

        {/* ====== LAYOUT AJUSTADO ======
             - Coluna da imagem com largura CONTROLADA no desktop
             - Some o "vazio" à direita pois a coluna não expande além de ~460px
        */}
        <div className="grid gap-6 lg:grid-cols-[minmax(320px,460px)_1fr]">
          {/* Imagem principal */}
          <div className="rounded-2xl border bg-white p-3 max-w-[460px] w-full mx-auto">
            <div className="flex items-center justify-center rounded-xl bg-white ring-1 ring-zinc-200 p-2">
              <div
                className="w-full flex items-center justify-center overflow-hidden"
                style={{ height: "var(--prod-stage-h, 420px)" }}
              >
                <img
                  src={selectedImage.startsWith("/") ? selectedImage : `/${selectedImage}`}
                  alt={`${product.name} ${selectedStorage}GB ${selectedColor || ""}`.trim()}
                  style={{
                    height: "var(--prod-img-h, 380px)",
                    width: "auto",
                    maxWidth: "none",
                    objectFit: "contain",
                  }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-1">
            <h1 className="text-xl md:text-2xl font-semibold text-zinc-900">
              {product.name} {selectedStorage} GB
            </h1>
            <div className="mt-1 text-sm text-zinc-500">{product.brand}</div>

            {/* Cor */}
            <div className="mt-4">
              <div className="text-sm text-zinc-700">
                Cor: <b>{selectedColor}</b>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {colorOptions.map((c) => {
                  const css = colorToHex(c.name);
                  const selected = norm(c.name) === norm(selectedColor);
                  const isVeryLight = ["#f9fafb", "#f2f2ea", "#e5e7eb"].includes(css.toLowerCase());
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`h-8 w-8 rounded-full border ${
                        selected ? "border-emerald-600 ring-2 ring-emerald-300" : isVeryLight ? "border-zinc-300" : "border-transparent"
                      }`}
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
              <div className="text-sm text-zinc-700">Armazenamento</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {storageOptions.map((s) => {
                  const selected = s === selectedStorage;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedStorage(s)}
                      className={`rounded-xl border px-3 py-1.5 text-sm ${
                        selected ? "border-emerald-600 ring-2 ring-emerald-300" : "border-zinc-300"
                      }`}
                    >
                      {s} GB
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preço */}
            <div className="mt-5 rounded-2xl border bg-white p-4">
              <div className="text-sm text-zinc-600 line-through">{br(selectedPrice)}</div>
              <div className="text-2xl font-extrabold tracking-tight text-emerald-700">
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
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold shadow-sm"
              >
                <ShoppingCart className="h-5 w-5" />
                Adicionar ao carrinho
              </button>
              <button
                onClick={() => {
                  addToCart();
                  router.push("/checkout");
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-zinc-900 hover:bg-black text-white px-5 py-3 font-semibold shadow-sm"
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
                  <span>calcular frete</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {cep && frete && (
                <div className="mt-2 text-sm text-zinc-700">
                  CEP: <b>{cep.replace(/(\d{5})(\d{3})/, "$1-$2")}</b> • {frete.tipo} — {frete.prazo} —{" "}
                  <b>{br(frete.valor)}</b>
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

        {/* Outras variações */}
        {siblings && siblings.length > 1 && (
          <section className="mt-10">
            <h3 className="text-lg font-semibold">Outras variações</h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {siblings
                .filter((s) => s.id !== product.id)
                .slice(0, 8)
                .map((s) => {
                  const sid = idNoExt(s.id);
                  const img = s.image || product.image || "/placeholder.svg";
                  const st = parseStorage(s);
                  return (
                    <Link
                      key={s.id}
                      href={`/produto/${sid}`}
                      className="rounded-xl border bg-white p-2 hover:shadow-sm transition"
                    >
                      <div className="w-full rounded-lg bg-white ring-1 ring-zinc-200 p-2">
                        <div className="w-full flex items-center justify-center overflow-hidden" style={{ height: 150 }}>
                          <img
                            src={img.startsWith("/") ? img : `/${img}`}
                            alt={s.name}
                            style={{ height: 130, width: "auto", objectFit: "contain" }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-zinc-900 line-clamp-2">
                        {s.name} {st ? `${st} GB` : ""}
                      </div>
                      <div className="text-[13px] text-zinc-500 line-through">{br(s.price)}</div>
                      <div className="text-[14px] font-extrabold text-emerald-700">{br(withPix(s.price))} no PIX</div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </div>

      {/* estilos locais só para esta página */}
      <style jsx global>{`
        .prose :where(p):not(:where([class~=not-prose] *)) { margin: .25rem 0; }
        @media (min-width: 1024px) {
          /* permite ajuste fácil do palco em desktop */
          :root {
            --prod-stage-h: 420px;
            --prod-img-h: 380px;
          }
        }
      `}</style>

      {/* Modal CEP */}
      <CepModal
        open={cepModal}
        onClose={() => setCepModal(false)}
        onSelect={onFrete}
      />
    </>
  );
}
