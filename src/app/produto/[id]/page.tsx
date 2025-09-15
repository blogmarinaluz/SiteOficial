"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";
import { CheckCircle, Truck, Shield, FileText, Award, X } from "lucide-react";

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

function idNoExt(id: string) {
  return id.replace(/\.[a-z0-9]+$/i, "");
}

/* ------------------------------ Toast local ------------------------------ */
function useToast(timeout = 2800) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string>("");

  function show(message: string) {
    setMsg(message);
    setOpen(true);
    // auto close
    window.clearTimeout((show as any)._t);
    (show as any)._t = window.setTimeout(() => setOpen(false), timeout);
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
/* ------------------------------------------------------------------------ */

export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();
  const toast = useToast();

  // ---------- Produto base ----------
  const base = useMemo(() => {
    const list = products as Product[];
    return (
      list.find((p) => idNoExt(p.id) === params.id) ||
      list.find((p) => p.id === params.id)
    );
  }, [params.id]);

  // ---------- Variantes (mesmo model_key) ----------
  const variantes = useMemo<Product[]>(() => {
    if (!base?.model_key) return base ? [base] : [];
    return (products as Product[]).filter(
      (p) => p.model_key === base.model_key
    );
  }, [base]);

  const cores = useMemo(
    () =>
      Array.from(
        new Set(variantes.map((v) => v.color).filter(Boolean) as string[])
      ),
    [variantes]
  );
  const storages = useMemo(
    () =>
      Array.from(
        new Set(variantes.map((v) => String(v.storage || "")))
      ).sort((a, b) => Number(a) - Number(b)),
    [variantes]
  );

  const [cor, setCor] = useState<string | undefined>(base?.color);
  const [gb, setGb] = useState<string | undefined>(
    base?.storage ? String(base.storage) : undefined
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

  if (!base) {
    return (
      <div className="container py-12">
        <h1 className="text-xl font-bold">Produto não encontrado</h1>
      </div>
    );
  }

  function handleAdd() {
    if (!selected) return;
    // ❗️não enviar quantity/qty (o hook controla)
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

  // ---------- Relacionados (4 cards) ----------
  type ModelSummary = {
    model_key: string;
    brand: string;
    name: string;
    minPrice: number;
    image?: string;
    firstId: string; // id de uma variante para link
  };

  const relacionados: ModelSummary[] = useMemo(() => {
    const list = products as Product[];

    // agrupa por model_key para pegar o menor preço e 1 id/imagem representativos
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

    // candidatos preferindo mesma marca e excluindo o modelo atual
    const currentKey = base.model_key || base.id;
    const sameBrand = Array.from(groups.values())
      .filter((g) => g.brand === base.brand && g.model_key !== currentKey)
      .slice(0, 4);

    const need = 4 - sameBrand.length;
    if (need <= 0) return sameBrand.slice(0, 4);

    const others = Array.from(groups.values()).filter(
      (g) =>
        g.model_key !== currentKey &&
        !sameBrand.find((s) => s.model_key === g.model_key)
    );

    // ordena por preço crescente para ficar atrativo
    others.sort((a, b) => a.minPrice - b.minPrice);

    return [...sameBrand, ...others.slice(0, need)].slice(0, 4);
  }, [base]);

  return (
    <>
      {/* Toast global desta página */}
      <Toast open={toast.open} msg={toast.msg} onClose={toast.hide} />

      <div className="container grid lg:grid-cols-12 gap-8 py-8">
        {/* Galeria + Conteúdo */}
        <div className="lg:col-span-7">
          {/* Galeria */}
          <div className="rounded-2xl border flex items-center justify-center p-6 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected?.image || base.image || "/placeholder.svg"}
              alt={base.name}
              className="max-h-[480px] object-contain"
            />
          </div>

          {/* Descrição / Características */}
          <div className="mt-8 space-y-6">
            <details className="rounded-lg border p-4" open>
              <summary className="font-semibold cursor-pointer">
                Descrição do produto
              </summary>
              <p className="text-sm text-zinc-700 mt-2">
                {base.name} novo, homologado pela Anatel e com Nota Fiscal.
                Texto descritivo detalhado pode ser inserido aqui conforme o
                fabricante (processador, tela, câmeras, bateria, conectividade,
                etc.).
              </p>
            </details>

            <details className="rounded-lg border p-4">
              <summary className="font-semibold cursor-pointer">
                Características técnicas
              </summary>
              <ul className="text-sm text-zinc-700 mt-2 space-y-1">
                <li>Memória interna disponível: {storages.join(" / ")} GB</li>
                <li>Câmeras: conforme especificação do fabricante</li>
                <li>Processador: conforme especificação do fabricante</li>
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
                      <div className="text-emerald-700 font-extrabold">
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

        {/* Lateral com preço e ações */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border p-6 bg-white shadow-sm sticky top-20">
            <h1 className="text-2xl font-bold">{base.name}</h1>

            {/* Cor */}
            {cores.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-zinc-600 mb-1">
                  Cor: <span className="font-medium">{cor}</span>
                </div>
                <div className="flex gap-2">
                  {cores.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCor(c)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        cor === c ? "border-emerald-600" : "border-zinc-300"
                      }`}
                      style={{ backgroundColor: c?.toLowerCase() }}
                      aria-label={`Cor ${c}`}
                      aria-pressed={cor === c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Capacidade */}
            {storages.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-zinc-600 mb-1">Capacidade</div>
                <div className="flex flex-wrap gap-2">
                  {storages.map((s) => (
                    <button
                      key={s}
                      onClick={() => setGb(s)}
                      className={`px-3 py-1 text-sm rounded-md border ${
                        gb === s
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-zinc-300 hover:bg-zinc-50"
                      }`}
                      aria-pressed={gb === s}
                    >
                      {s} GB
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preço */}
            <div className="mt-6 space-y-1">
              <div className="text-3xl font-extrabold text-emerald-700">
                {br(withCoupon(price))} no PIX
              </div>
              <div className="text-sm text-zinc-500">
                Ou {br(price)} em até 10x de {br(parcela)}{" "}
                <span className="text-emerald-600 font-medium">sem juros</span>
              </div>
              <div className="text-[12px] text-orange-600">
                Economize {br(Math.round(price * 0.15))} no PIX
              </div>
            </div>

            {/* Ações */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleAdd}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700"
              >
                Adicionar ao carrinho
              </button>
              <Link
                href="/checkout"
                className="w-full text-center bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600"
              >
                Comprar
              </Link>
            </div>

            {/* Infos rápidas */}
            <div className="mt-6 space-y-3 text-sm text-zinc-700">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600" />
                Receba em seu endereço —{" "}
                <button className="text-emerald-600 underline">
                  Consultar entrega
                </button>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Vendido e entregue por proStore
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                180 dias de garantia
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" />
                Homologado pela Anatel
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Produto novo e original com Nota Fiscal
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
