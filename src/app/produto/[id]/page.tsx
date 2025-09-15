"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

/* ========================= Utils ========================= */
const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");

/** Mapa de cores PT/EN → hex. Aceita '#xxxxxx' direto também. */
const COLOR_MAP: Record<string, string> = {
  // português
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
  // inglês
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
  if (!input) return "#E5E7EB"; // neutral
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
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed top-4 right-4 z-[60]"
    >
      <div
        className={`transition-all duration-300 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div className="pointer-events-auto flex items-start gap-3 rounded-xl border bg-white shadow-lg p-4 min-w-[280px]">
          <div className="mt-0.5 rounded-full bg-emerald-100 p-1">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-sm text-zinc-800">
            <div className="font-semibold">Tudo certo!</div>
            <div>{msg}</div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-zinc-500 hover:bg-zinc-100"
            aria-label="Fechar notificação"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================= Page ========================= */
export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();
  const toast = useToast();

  /* ---------- Produto base ---------- */
  const base = useMemo(() => {
    const list = products as Product[];
    return (
      list.find((p) => idNoExt(p.id) === params.id) ||
      list.find((p) => p.id === params.id)
    );
  }, [params.id]);

  if (!base) {
    return (
      <div className="container py-12">
        <h1 className="text-xl font-bold">Produto não encontrado</h1>
      </div>
    );
  }

  /* ---------- Variantes do mesmo modelo ---------- */
  const variantes = useMemo<Product[]>(() => {
    if (!base?.model_key) return base ? [base] : [];
    return (products as Product[]).filter(
      (p) => p.model_key === base.model_key
    );
  }, [base]);

  const cores = useMemo(
    () =>
      Array.from(
        new Set(variantes.map((v) => (v.color || "").trim()).filter(Boolean))
      ),
    [variantes]
  );

  const storages = useMemo(
    () =>
      Array.from(
        new Set(variantes.map((v) => String(v.storage || "")).filter(Boolean))
      ).sort((a, b) => Number(a) - Number(b)),
    [variantes]
  );

  /* ---------- Estado da seleção ---------- */
  const [cor, setCor] = useState<string | undefined>(base.color);
  const [gb, setGb] = useState<string | undefined>(
    base.storage ? String(base.storage) : undefined
  );

  const selected = useMemo(() => {
    return (
      variantes.find(
        (v) => (!cor || v.color === cor) && (!gb || String(v.storage) === gb)
      ) || variantes[0]
    );
  }, [variantes, cor, gb]);

  const price = selected?.price || 0;
  const parcela = Math.ceil(price / 10);

  /* ---------- Galeria / miniaturas por cor ---------- */
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
        groups.set(k, {
          model_key: k,
          brand: p.brand,
          name: p.name,
          minPrice: p.price,
          image: p.image,
          firstId: p.id,
        });
      } else {
        if (p.price < g.minPrice) g.minPrice = p.price;
      }
    }
    const currentKey = base.model_key || base.id;
    const sameBrand = Array.from(groups.values())
      .filter((g) => g.brand === base.brand && g.model_key !== currentKey)
      .slice(0, 4);
    const need = 4 - sameBrand.length;
    if (need <= 0) return sameBrand;
    const others = Array.from(groups.values()).filter(
      (g) =>
        g.model_key !== currentKey &&
        !sameBrand.find((s) => s.model_key === g.model_key)
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
  return (
    <>
      <Toast open={toast.open} msg={toast.msg} onClose={toast.hide} />

      <div className="container grid lg:grid-cols-12 gap-8 py-8">
        {/* Coluna esquerda: Galeria + conteúdo */}
        <div className="lg:col-span-7">
          {/* Galeria */}
          <div className="rounded-2xl border bg-white p-4 md:p-6">
            <div className="flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImg}
                alt={base.name}
                className="h-[320px] md:h-[400px] w-auto object-contain"
              />
            </div>

            {/* Miniaturas */}
            {gallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {gallery.map((g) => {
                  const active =
                    g.src === currentImg ||
                    g.label === (cor || "").toLowerCase();
                  return (
                    <button
                      key={g.src}
                      onClick={() => {
                        const found = variantes.find(
                          (v) => v.image === g.src && v.color
                        )?.color;
                        if (found) setCor(found);
                      }}
                      className={`rounded-xl border ${
                        active ? "border-emerald-600" : "border-zinc-300"
                      } bg-white p-1 hover:shadow-sm`}
                      aria-pressed={active}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.src}
                        alt={g.label}
                        className="h-16 w-16 object-contain rounded-lg"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Descrição / Características */}
          <div className="mt-8 grid gap-6">
            <details className="rounded-2xl border p-5 bg-white" open>
              <summary className="font-semibold cursor-pointer">
                Descrição do produto
              </summary>
              <div className="text-sm text-zinc-700 mt-2 leading-relaxed">
                {base.name} novo, homologado pela Anatel e com Nota Fiscal.
                Texto descritivo detalhado pode ser inserido aqui conforme o
                fabricante (processador, tela, câmeras, bateria, conectividade,
                etc.).
              </div>
            </details>

            <details className="rounded-2xl border p-5 bg-white">
              <summary className="font-semibold cursor-pointer">
                Características técnicas
              </summary>
              <ul className="text-sm text-zinc-700 mt-2 space-y-2">
                <li>Memória interna disponível: {storages.join(" / ")} GB</li>
                <li>Processador: conforme especificação do fabricante</li>
                <li>Câmeras: conforme especificação do fabricante</li>
                <li>Tela: conforme especificação do fabricante</li>
              </ul>
            </details>
          </div>

          {/* Quem viu, viu também */}
          {relacionados.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold mb-4">Quem viu, viu também</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relacionados.map((r) => {
                  const href = `/produto/${idNoExt(r.firstId)}`;
                  return (
                    <Link
                      key={r.model_key}
                      href={href}
                      className="rounded-xl border p-3 bg-white hover:shadow-sm transition"
                    >
                      <div className="flex items-center justify-center h-40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.image || "/placeholder.svg"}
                          alt={r.name}
                          className="max-h-36 object-contain"
                        />
                      </div>
                      <div className="mt-2 text-sm text-zinc-500">{r.brand}</div>
                      <div className="font-semibold line-clamp-2 min-h-[3.25rem]">
                        {r.name}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">A partir de</div>
                      <div className="text-emerald-700 font-semibold text-xl tracking-tight">
                        {br(withCoupon(r.minPrice))}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        10x sem juros de {br(Math.ceil(r.minPrice / 10))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Coluna direita: Card de compra */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border p-6 bg-white shadow-sm sticky top-20">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {base.name}
            </h1>

            {/* Cor (swatches visíveis) */}
            {cores.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-zinc-600 mb-1">
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
                        className={`relative h-8 w-8 rounded-full border-2 transition ${
                          selectedState
                            ? "border-emerald-600 ring-2 ring-emerald-100"
                            : "border-zinc-300 hover:border-zinc-400"
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

            {/* Capacidade (chips elegantes) */}
            {storages.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-zinc-600 mb-1">Capacidade</div>
                <div className="flex flex-wrap gap-2">
                  {storages.map((s) => {
                    const selectedState = gb === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setGb(s)}
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          selectedState
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-zinc-300 hover:bg-zinc-50"
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

            {/* Preço (tipografia refinada) */}
            <div className="mt-6 space-y-1">
              <div className="text-[28px] md:text-[32px] font-semibold tracking-tight text-emerald-700">
                {br(withCoupon(price))} <span className="text-zinc-600 text-[18px] font-medium">no PIX</span>
              </div>
              <div className="text-sm text-zinc-500">
                Ou {br(price)} em até 10x de {br(parcela)}{" "}
                <span className="text-emerald-700 font-medium">sem juros</span>
              </div>
            </div>

            {/* Ações — paleta preto & verde */}
            <div className="mt-6 flex flex-col gap-3">
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
              <div className="py-3 flex items-start gap-3 text-sm">
                <Truck className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <div className="font-medium">Receba em seu endereço</div>
                  <div className="text-zinc-600">
                    <button className="text-emerald-700 underline">
                      Consultar entrega
                    </button>
                  </div>
                </div>
              </div>
              <div className="py-3 flex items-start gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">
                  Vendido e entregue por proStore
                </div>
              </div>
              <div className="py-3 flex items-start gap-3 text-sm">
                <Shield className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">180 dias de garantia</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-sm">
                <Award className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Homologado pela Anatel</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-sm">
                <FileText className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">
                  Produto novo e original com Nota Fiscal
                </div>
              </div>

              {/* Extras opcionais */}
              <div className="py-3 flex items-start gap-3 text-sm">
                <Package className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Em estoque e pronto para envio</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-sm">
                <Battery className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Bateria em padrão de fábrica</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-sm">
                <CreditCard className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">10x sem juros no cartão</div>
              </div>
              <div className="py-3 flex items-start gap-3 text-sm">
                <Recycle className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div className="font-medium">Embalagem segura e sustentável</div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 pt-3">
              * Desconto aplicado automaticamente no carrinho. Pagamento
              finalizado no WhatsApp.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
