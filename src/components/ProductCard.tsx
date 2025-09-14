"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart"; // <<< import nomeado
import { br, withCoupon } from "@/lib/format";

type Product = {
  id: string | number;
  name: string;
  brand?: string;
  image?: string;
  price?: number;
};

function titleCaseBrand(b?: string) {
  if (!b) return "";
  if (b.toLowerCase() === "apple") return "Apple";
  if (b.toLowerCase() === "samsung") return "Samsung";
  return b.charAt(0).toUpperCase() + b.slice(1);
}

export default function ProductCard({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const hasPrice = typeof p.price === "number";
  const brand = titleCaseBrand(p.brand);

  const price10x = hasPrice ? (p.price as number) / 10 : 0;

  return (
    <article className="card flex flex-col">
      {/* Imagem */}
      <Link href={`/produto/${p.id}`} className="block">
        <img
          src={p.image || "/products/placeholder.jpg"}
          alt={p.name}
          className="rounded-2xl w-full object-cover aspect-[4/3]"
          loading="lazy"
        />
      </Link>

      {/* Texto */}
      <div className="mt-3 flex-1">
        {brand && (
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
            {brand}
          </div>
        )}

        <h3 className="font-semibold leading-snug line-clamp-2">{p.name}</h3>

        {hasPrice ? (
          <div className="mt-2 space-y-1">
            <div className="text-lg font-bold">{br(p.price as number)}</div>

            {/* 10x sem juros */}
            <div className="text-xs text-zinc-600">
              ou <b>10x</b> de <b>{br(price10x)}</b> <i>sem juros</i>
            </div>

            {/* preço com cupom/PIX */}
            <div className="text-xs text-emerald-600">
              no PIX: <b>{br(withCoupon(p.price as number))}</b> (desconto
              aplicado)
            </div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-zinc-500">Consulte</div>
        )}
      </div>

      {/* Ações */}
      <div className="mt-3 flex gap-2">
        <Link href={`/produto/${p.id}`} className="btn-outline flex-1 text-center">
          Ver produto
        </Link>

        {hasPrice && (
          <button
            className="btn-primary flex-1"
            onClick={() => {
              // NÃO enviar qty — o hook já inicia como 1
              add({
                id: String(p.id),
                name: p.name,
                price: p.price,
                image: p.image,
              });
            }}
          >
            Adicionar
          </button>
        )}
      </div>
    </article>
  );
}
