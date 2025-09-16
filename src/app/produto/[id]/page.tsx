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
  ShoppingCart,
  CreditCard,
  Loader2,
} from "lucide-react";
import MobileCarousel from "@/components/MobileCarousel";

/* ========================= UTILS & TIPOS ========================= */

function norm(v: unknown) {
  return String(v ?? "").trim().toLowerCase();
}

function idNoExt(v: string) {
  return (v || "").replace(/\.(jpg|jpeg|jfif|png|webp)$/i, "");
}

function parseStorage(p: any): number {
  const n = Number(p?.storage ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

/** 30% OFF no PIX */
const withCoupon = (price: number, off = 0.3) => Math.max(0, Math.round(price * (1 - off)));

const COLORS: Record<string, string> = {
  "preto": "#111827",
  "black": "#111827",
  "branco": "#f9fafb",
  "white": "#f9fafb",
  "cinza": "#6b7280",
  "gray": "#6b7280",
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

/* ========================= SEO LITE (LOCAL) ========================= */

function setMeta(prop: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
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
  selectedStorage: number;
  selectedColor?: string | null;
}) {
  useEffect(() => {
    if (!product) return;
    setMeta("og:title", `${product.name} ${selectedStorage} GB | proStore`);
    setMeta(
      "og:description",
      `Compre ${product.name} ${selectedStorage}GB com até 30% OFF no boleto. Várias cores.`
    );
    if (selectedImage) {
      const href = selectedImage.startsWith("/") ? selectedImage : `/${selectedImage}`;
      setMeta("og:image", href);
    }
  }, [product, selectedImage, selectedStorage]);

  // JSON-LD
  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product?.name} ${selectedStorage} GB`,
    image: selectedImage ? (selectedImage.startsWith("/") ? selectedImage : `/${selectedImage}`) : undefined,
    brand: product?.brand ? String(product.brand).toUpperCase() : "GENERIC",
    offers: {
      "@type": "Offer",
      price: String(selectedPrice),
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `/produto/${paramsId}`,
    },
  };

  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: String(product?.brand || "").toUpperCase(),
        item: `/categoria/${norm(product?.brand)}`,
      },
      { "@type": "ListItem", position: 3, name: `${product?.name} ${selectedStorage} GB` },
    ],
  };

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
  const { add } = useCart();

  /* ---------- Resolve produto base e variações ---------- */
  const all = (productsData as any[]) || [];
  const product = useMemo(() => {
    const byId = all.find((p) => idNoExt(p.id) === idNoExt(params.id));
    return byId || null;
  }, [all, params.id]);

  const siblings = useMemo(() => {
    if (!product) return [];
    const key = (product as any).model_key || (product as any).model || "";
    return all.filter((p) => (p.model_key || p.model) === key);
  }, [all, product]);

  const storages = useMemo(
    () =>
      Array.from(new Set(siblings.map(parseStorage).filter(Boolean))).sort((a, b) => a - b),
    [siblings]
  );

  const colors = useMemo(() => {
    const list = Array.from(new Set(siblings.map((s) => norm(s.color)).filter(Boolean)));
    return list.map((c) => ({ label: c, hex: COLORS[c] || "#e5e7eb" }));
  }, [siblings]);

  /* ---------- Estado selecionado ---------- */
  const [selectedStorage, setSelectedStorage] = useState<number>(() => parseStorage(product));
  const [selectedColor, setSelectedColor] = useState<string | null>(() =>
    norm(product?.color || "")
  );

  useEffect(() => {
    if (!product) return;
    setSelectedStorage(parseStorage(product));
    setSelectedColor(norm(product.color || ""));
  }, [product]);

  /* ---------- Imagem & preço atuais ---------- */
  const selectedImage = useMemo(() => {
    const byColor = siblings.find(
      (s) =>
        norm(s.color) === norm(selectedColor) && parseStorage(s) === selectedStorage && s.image
    );
    const byColorOnly = siblings.find((s) => norm(s.color) === norm(selectedColor) && s.image);
    return byColor?.image || byColorOnly?.image || product.images?.[0] || product.image || "/placeholder.svg";
  }, [siblings, selectedColor, selectedStorage, product]);
  const mobileImages = useMemo(() => {
    if (!product) return selectedImage ? [selectedImage] : [];
    const base = (productsData as any[])
      .filter((p) => (p as any).model_key === (product as any).model_key)
      .map((p) => (p.image?.startsWith("/") ? p.image : `/${p.image}`))
      .filter(Boolean);
    const sel = selectedImage
      ? (selectedImage.startsWith("/") ? selectedImage : `/${selectedImage}`)
      : null;
    const unique = new Set<string>([...(sel ? [sel] : []), ...base]);
    return Array.from(unique);
  }, [product, selectedImage]);

  const selectedPrice = useMemo(() => {
    const sameStorage = siblings.filter((s) => parseStorage(s) === selectedStorage);
    if (sameStorage.length) {
      return Math.min(...sameStorage.map((s) => s.price || product.price));
    }
    return product.price;
  }, [siblings, selectedStorage, product]);

  /* ---------- CEP / Frete (modal fake local) ---------- */
  type EnderecoViaCep = {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  };

  const [cepModal, setCepModal] = useState(false);
  const [frete, setFrete] = useState<{ titulo: string; prazo: string; preco: number } | null>(
    null
  );

  function onFrete(e: EnderecoViaCep) {
    // simulação de frete (padrão)
    setFrete({ titulo: "Econômico", prazo: "5 a 9 dias úteis", preco: 0 });
  }

  /* ---------- Ações ---------- */
  function addToCart() {
    if (!product) return;
    add(
      {
        id: product.id,
        name: `${product.name} ${selectedStorage} GB${selectedColor ? " " + selectedColor : ""}`,
        image: selectedImage,
        price: selectedPrice,
      },
      1
    );
  }

  if (!product) {
    return (
      <main className="container py-8">
        <p className="text-zinc-600">Produto não encontrado.</p>
      </main>
    );
  }

  const promo = withCoupon(selectedPrice, 0.3);
  const parcela = Math.ceil(promo / 10);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-600">
        <ol className="flex items-center gap-1">
          <li>
            <Link href="/" className="hover:underline">
              Início
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href={`/categoria/${norm(product.brand)}`} className="hover:underline">
              {String(product.brand).toUpperCase()}
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-zinc-900">
            {product.name} {selectedStorage} GB
          </li>
        </ol>
      </nav>

      {/* SEO local */}
      <ProductSEO
        product={product}
        paramsId={params.id}
        selectedImage={selectedImage}
        selectedPrice={selectedPrice}
        selectedStorage={selectedStorage}
        selectedColor={selectedColor || undefined}
      />

      {/* GRID PRINCIPAL */}
      <section className="mt-4 lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Imagem principal */}
        {/* MOBILE: carrossel (apenas em telas < sm) */}
        <div className="sm:hidden">
          <MobileCarousel images={mobileImages} />
        </div>

        {/* DESKTOP: imagem estática (como você já tinha) */}
        <div className="hidden sm:block">
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
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-1">
          <h1 className="text-xl md:text-2xl font-semibold text-zinc-900">
            {product.name} {selectedStorage} GB
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Escolha a capacidade e a cor disponíveis para o melhor preço.
          </p>

          {/* Preço */}
          <div className="mt-4 rounded-2xl border bg-white p-4">
            <div className="text-sm text-zinc-600">à vista no boleto/PIX</div>
            <div className="text-2xl font-semibold text-emerald-700">{fmt(promo)}</div>
            <div className="mt-1 text-sm text-zinc-700">
              ou em até <b>10x de {fmt(parcela)}</b> sem juros
            </div>
          </div>

          {/* Armazenamento */}
          <div className="mt-4">
            <div className="text-sm font-medium">Armazenamento</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {storages.map((s) => {
                const active = s === selectedStorage;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedStorage(s)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-medium ${
                      active ? "border-zinc-900 bg-zinc-900 text-white" : "bg-white hover:bg-zinc-50"
                    }`}
                  >
                    {s} GB
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cores */}
          {colors.length ? (
            <div className="mt-4">
              <div className="text-sm font-medium">Cor</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map(({ label, hex }) => {
                  const active = norm(label) === norm(selectedColor);
                  return (
                    <button
                      key={label}
                      onClick={() => setSelectedColor(label)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "bg-white hover:bg-zinc-50"
                      }`}
                      title={label}
                    >
                      <span
                        className="inline-block h-4 w-4 rounded-full ring-1 ring-black/10"
                        style={{ background: hex }}
                        aria-hidden
                      />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Ações */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={addToCart}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold shadow-sm"
            >
              <ShoppingCart className="h-5 w-5" />
              Adicionar ao carrinho
            </button>
            <button
              onClick={() => {
                addToCart();
                router.push("/checkout");
              }}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-zinc-900 hover:bg-black text-white px-5 py-3 font-semibold shadow-sm"
            >
              <CreditCard className="h-5 w-5" />
              Comprar
            </button>
          </div>

          {/* Entrega / CEP */}
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <div className="flex items-center gap-2 text-zinc-800">
              <Truck className="h-5 w-5" />
              <b>Entrega</b>
            </div>

            {frete ? (
              <div className="mt-2 text-sm text-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div>{frete.titulo}</div>
                    <div className="text-zinc-500">{frete.prazo}</div>
                  </div>
                  <div className="font-semibold">{fmt(frete.preco)}</div>
                </div>
                <button onClick={() => setCepModal(true)} className="mt-2 underline text-emerald-700">
                  Alterar CEP
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <button onClick={() => setCepModal(true)} className="btn-secondary">
                  Calcular frete
                </button>
              </div>
            )}
          </div>

          {/* Garantias/benefícios */}
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <li className="rounded-xl border bg-white p-3 text-sm text-zinc-700 flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              Produto revisado e testado
            </li>
            <li className="rounded-xl border bg-white p-3 text-sm text-zinc-700 flex items-start gap-2">
              <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              Garantia de 90 dias
            </li>
            <li className="rounded-xl border bg-white p-3 text-sm text-zinc-700 flex items-start gap-2">
              <FileText className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              Nota fiscal
            </li>
          </ul>
        </div>
      </section>

      {/* DESCRIÇÃO / ESPECIFICAÇÕES */}
      <section className="mt-8">
        <DescriptionAndSpecs modelKey={product.model_key || product.model} />
      </section>

      {/* ===== estilos locais (apenas ajustes de altura no mobile) ===== */}
      <style jsx global>{`
        :root {
          --prod-stage-h: 420px;
          --prod-img-h: 380px;
        }
        @media (max-width: 640px) {
          :root {
            --prod-stage-h: 300px;
            --prod-img-h: 260px;
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

/* ================= CEP MODAL (SIMPLIFICADO) ================= */
function CepModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (e: any) => void;
}) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function normalizeCep(v: string) {
    return (v || "").replace(/\D/g, "");
  }

  async function safeDelay(ms = 400) {
    await new Promise((r) => setTimeout(r, ms));
  }

  async function consultar() {
    setErro("");
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
        localidade: "Cidade Exemplo",
        uf: "MA",
      };
      onSelect(fake);
      onClose();
    } catch (e) {
      setErro("Não foi possível consultar o CEP agora.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2 text-zinc-800">
            <Truck className="h-5 w-5" />
            <b>Calcular frete</b>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-zinc-100" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="flex gap-2">
            <input
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="Digite seu CEP"
              className="input w-full"
              maxLength={9}
            />
            <button onClick={consultar} className="btn-secondary whitespace-nowrap">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
            </button>
          </div>
          {erro ? <div className="mt-2 text-sm text-red-600">{erro}</div> : null}
        </div>
      </div>
    </div>
  );
}
