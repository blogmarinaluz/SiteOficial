"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

type Product = {
  id: string;
  brand: string;
  name: string;
  image?: string;
  price: number;
  freeShipping?: boolean;
  tag?: string;
};

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();

  const parcela = p.price / 10;

  const handleAdd = () => {
    add({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image,
    });
    // feedback simples (ajuste depois para toast)
    alert("Adicionado ao carrinho!");
  };

  return (
    <article className="group border rounded-2xl overflow-hidden bg-white">
      <Link
        href={`/produto/${encodeURIComponent(p.id)}`}
        className="block aspect-[4/3] bg-white flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image || "/placeholder.png"}
          alt={p.name}
          className="max-h-[180px] object-contain transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="p-3 space-y-2">
        <div className="text-xs text-zinc-500">
          {p.brand ? p.brand[0].toUpperCase() + p.brand.slice(1) : ""}
        </div>
        <Link
          href={`/produto/${encodeURIComponent(p.id)}`}
          className="block font-semibold leading-snug line-clamp-2"
        >
          {p.name}
        </Link>

        {p.tag || p.freeShipping ? (
          <div className="flex flex-wrap gap-2 text-[10px]">
            {p.tag ? (
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                {p.tag}
              </span>
            ) : null}
            {p.freeShipping ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                Frete grátis
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-0.5">
          <div className="text-lg font-extrabold">{br(withCoupon(p.price))} no PIX</div>
          <div className="text-xs text-zinc-600">
            Ou {br(p.price)} em até{" "}
            <b>
              10x de {br(parcela)} <span className="text-emerald-600">sem juros</span>
            </b>
          </div>
        </div>

        <button className="btn-primary w-full mt-2" onClick={handleAdd}>
          Adicionar
        </button>
      </div>
    </article>
  );
}
