"use client";

import Link from "next/link";
import { useMemo } from "react";
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

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function candidatesFromParam(raw: string) {
  const dec = decodeURIComponent(raw);
  const noExt = dec.replace(/\.[a-z0-9]+$/i, "");
  return Array.from(
    new Set([
      dec,
      noExt,
      dec.replace(/-/g, "_"),
      dec.replace(/_/g, "-"),
      noExt.replace(/-/g, "_"),
      noExt.replace(/_/g, "-"),
    ])
  );
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { add } = useCart();

  const p = useMemo<Product | undefined>(() => {
    const list = products as Product[];
    const cands = candidatesFromParam(params.id);

    // 1) tenta por id direto (várias variações)
    for (const cand of cands) {
      const hit = list.find((i) => i.id === cand);
      if (hit) return hit;
    }

    // 2) tenta sem extensão e por slug do nome
    const bySlug = list.find((i) => {
      const idNoExt = i.id.replace(/\.[a-z0-9]+$/i, "");
      return (
        cands.includes(idNoExt) ||
        cands.includes(normalize(i.name)) ||
        cands.includes(normalize(idNoExt))
      );
    });
    return bySlug;
  }, [params.id]);

  if (!p) {
    return (
      <div className="container py-8">
        <div className="rounded-2xl border p-6">
          <h1 className="text-xl font-bold mb-2">Produto não encontrado</h1>
          <Link href="/" className="btn-primary inline-block">Voltar para a Home</Link>
        </div>
      </div>
    );
  }

  const parcela = p.price / 10;

  const handleAdd = () => {
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
            {(p.brand && p.brand[0].toUpperCase() + p.brand.slice(1)) || ""}
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
            <div className="text-3xl font-extrabold">
              {br(withCoupon(p.price))} no PIX
            </div>
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
            <p>* Desconto de 30% aplicado no carrinho automaticamente.</p>
            <p>* Pagamento finalizado no WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
