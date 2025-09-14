"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { withCoupon, br } from "@/lib/format";

function capBrand(b?: string) {
  const m = String(b || "").toLowerCase();
  if (m === "apple") return "Apple";
  if (m === "samsung") return "Samsung";
  return m.replace(/^\w/, (c) => c.toUpperCase());
}

export default function ProductCard({ p }: { p: any }) {
  const { add } = useCart();
  const hasPrice = typeof p.price === "number";
  const price = hasPrice ? p.price : 0;
  const price10x = hasPrice ? price / 10 : 0;

  return (
    <article className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Imagem padronizada (quadrada, contain) */}
      <Link href={`/produto/${p.id}`} className="block bg-white">
        <div className="w-full aspect-square grid place-items-center p-4">
          <img
            src={p.image}
            alt={p.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4">
        {/* Marca capitalizada */}
        <div className="text-xs uppercase tracking-wide text-zinc-500">
          {capBrand(p.brand)}
        </div>

        {/* Nome do produto (sem cor/GB extras aqui) */}
        <Link href={`/produto/${p.id}`} className="block mt-1 font-semibold leading-snug">
          {p.name}
        </Link>

        {/* Preços */}
        {hasPrice ? (
          <div className="mt-2">
            <div className="text-lg font-bold">{br(price)}</div>
            <div className="text-xs text-zinc-600">
              ou <b>10x de {br(price10x)}</b> <span className="text-emerald-600">sem juros</span>
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Cupom <b>30% OFF</b> aplicado no carrinho
            </div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-zinc-500">Consulte condições</div>
        )}

        {/* Ações claras */}
        <div className="mt-3 flex gap-2">
          <Link href={`/produto/${p.id}`} className="btn-outline flex-1 text-center">
            Ver produto
          </Link>
          {hasPrice && (
            <button
              className="btn-primary flex-1"
              onClick={() =>
                add({
                  id: String(p.id),
                  name: p.name,
                  price: p.price,
                  qty: 1,
                  image: p.image,
                })
              }
            >
              Adicionar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
