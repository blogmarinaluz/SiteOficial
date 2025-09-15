"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";
import { CheckCircle, Truck, Shield, FileText, Award } from "lucide-react";

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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();

  // busca produto base
  const base = useMemo(() => {
    const list = products as Product[];
    return list.find((p) => p.id.replace(/\.[a-z0-9]+$/i, "") === params.id) || list.find((p) => p.id === params.id);
  }, [params.id]);

  // variantes por model_key
  const variantes = useMemo<Product[]>(() => {
    if (!base?.model_key) return base ? [base] : [];
    return (products as Product[]).filter((p) => p.model_key === base.model_key);
  }, [base]);

  const cores = useMemo(() => Array.from(new Set(variantes.map((v) => v.color).filter(Boolean))), [variantes]);
  const storages = useMemo(() => Array.from(new Set(variantes.map((v) => String(v.storage || "")))).sort((a, b) => Number(a) - Number(b)), [variantes]);

  const [cor, setCor] = useState(base?.color);
  const [gb, setGb] = useState(base?.storage ? String(base.storage) : undefined);

  const selected = useMemo(() => {
    return variantes.find((v) => (!cor || v.color === cor) && (!gb || String(v.storage) === gb)) || base;
  }, [variantes, cor, gb, base]);

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
    add({
      id: selected.id,
      name: selected.name,
      image: selected.image,
      price: selected.price,
      color: selected.color,
      storage: selected.storage,
      freeShipping: selected.freeShipping,
    });
    alert("Produto adicionado ao carrinho!");
  }

  return (
    <div className="container grid lg:grid-cols-12 gap-8 py-8">
      {/* Galeria */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border flex items-center justify-center p-6 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected?.image || base.image || "/placeholder.svg"} alt={base.name} className="max-h-[480px] object-contain" />
        </div>

        {/* descrição e características */}
        <div className="mt-8 space-y-6">
          <details className="rounded-lg border p-4" open>
            <summary className="font-semibold cursor-pointer">Descrição do produto</summary>
            <p className="text-sm text-zinc-700 mt-2">
              Produto {base.name}, totalmente novo, homologado pela Anatel e com nota fiscal. Descrição detalhada pode ser inserida aqui conforme fabricante.
            </p>
          </details>

          <details className="rounded-lg border p-4">
            <summary className="font-semibold cursor-pointer">Características técnicas</summary>
            <ul className="text-sm text-zinc-700 mt-2 space-y-1">
              <li>Memória interna: {storages.join(" / ")} GB</li>
              <li>Processador: Exemplo</li>
              <li>Câmera: Exemplo</li>
              <li>Tela: Exemplo</li>
            </ul>
          </details>
        </div>
      </div>

      {/* Lateral com preço e ações */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-2xl border p-6 bg-white shadow-sm sticky top-20">
          <h1 className="text-2xl font-bold">{base.name}</h1>

          {/* seleção cor */}
          {cores.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-zinc-600 mb-1">Cor:</div>
              <div className="flex gap-2">
                {cores.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCor(c)}
                    className={`h-8 w-8 rounded-full border-2 ${cor === c ? "border-emerald-600" : "border-zinc-300"}`}
                    style={{ backgroundColor: c?.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* seleção armazenamento */}
          {storages.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-zinc-600 mb-1">Capacidade:</div>
              <div className="flex gap-2">
                {storages.map((s) => (
                  <button
                    key={s}
                    onClick={() => setGb(s)}
                    className={`px-3 py-1 text-sm rounded-md border ${gb === s ? "border-emerald-600 bg-emerald-50" : "border-zinc-300 hover:bg-zinc-50"}`}
                  >
                    {s} GB
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* preço */}
          <div className="mt-6 space-y-1">
            <div className="text-3xl font-extrabold text-emerald-700">{br(withCoupon(price))} no PIX</div>
            <div className="text-sm text-zinc-500">Ou {br(price)} em até 10x de {br(parcela)} sem juros</div>
            <div className="text-xs text-red-600">Economize {br(price * 0.15)} no PIX</div>
          </div>

          {/* ações */}
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleAdd} className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700">
              Adicionar ao carrinho
            </button>
            <Link href="/checkout" className="w-full text-center bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600">
              Comprar
            </Link>
          </div>

          {/* infos rápidas */}
          <div className="mt-6 space-y-3 text-sm text-zinc-700">
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-emerald-600" /> Receba em seu endereço – <button className="text-emerald-600 underline">Consultar entrega</button></div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-600" /> 180 dias de garantia</div>
            <div className="flex items-center gap-2"><Award className="h-4 w-4 text-emerald-600" /> Homologado pela Anatel</div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-emerald-600" /> Produto novo e original com Nota Fiscal</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> Vendido e entregue por proStore</div>
          </div>
        </div>
      </div>
    </div>
  );
}
