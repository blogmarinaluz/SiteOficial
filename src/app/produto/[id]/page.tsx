"use client";

import { useMemo } from "react";
import Link from "next/link";
import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

type Product = {
  id: string;
  brand: string;
  name: string;
  image?: string;
  price: number;
  color?: string;
  storage?: string | number;
  freeShipping?: boolean;
  tag?: string;
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();

  const p = useMemo<Product | undefined>(() => {
    return (products as Product[]).find((i) => i.id === params.id);
  }, [params.id]);

  if (!p) {
    return (
      <div className="container py-8">
        <div className="rounded-2xl border p-6">
          <h1 className="text-xl font-bold mb-2">Produto não encontrado</h1>
          <Link href="/" className="btn-primary inline-block">
            Voltar para a Home
          </Link>
        </div>
      </div>
    );
  }

  const parcela = p.price / 10;

  const handleAdd = () => {
    // o hook já inicia qty = 1, então não passamos qty aqui
    add({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
    });
    alert("Adicionado ao carrinho!");
  };

  return (
    <div className="container py-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* FOTO */}
        <div className="border rounded-2xl p-4 flex items-center justify-center bg-white">
          {/* fallback de imagem para evitar layout quebrado */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image || "/placeholder.png"}
            alt={p.name}
            className="max-h-[420px] object-contain"
          />
        </div>

        {/* INFOS */}
        <div className="space-y-4">
          <div className="text-sm text-zinc-500">
            {p.brand ? p.brand.charAt(0).toUpperCase() + p.brand.slice(1) : ""}
            {p.color ? ` • ${p.color}` : ""}
            {p.storage ? ` • ${p.storage}GB` : ""}
          </div>

          <h1 className="text-2xl font-extrabold leading-tight">{p.name}</h1>

          {p.tag ? (
            <div className="inline-flex items-center gap-2 text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {p.tag}
            </div>
          ) : null}

          <div className="space-y-1 pt-2">
            <div className="text-3xl font-extrabold">{br(withCoupon(p.price))} no PIX</div>
            <div className="text-zinc-500">
              Ou <b>{br(p.price)}</b> em até{" "}
              <b>
                10x de {br(parcela)} <span className="text-emerald-600">sem juros</span>
              </b>
            </div>
            {p.freeShipping ? (
              <div className="text-emerald-600 text-sm font-medium">Frete: Grátis</div>
            ) : null}
          </div>

          <div className="flex gap-3 pt-2">
            <button className="btn-primary" onClick={handleAdd}>
              Adicionar ao carrinho
            </button>
            <Link href="/carrinho" className="btn-outline">
              Ver carrinho
            </Link>
          </div>

          <div className="text-sm text-zinc-600 pt-4">
            <p>
              * Desconto de 30% aplicado no carrinho automaticamente (SEMANA DE PREÇOS BAIXOS).
            </p>
            <p>* Pagamento via WhatsApp após finalizar o pedido.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
