"use client";

import Link from "next/link";
import useCart from "@/hooks/useCart";

type Product = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  freeShipping?: boolean;
};

function installment10(price: number) {
  // 10x sem juros
  const v = price / 0.7; // considera 30% OFF já aplicado no site -> mostra parcelado sobre o preço cheio
  const parcela = Math.round((v / 10) * 100) / 100;
  return parcela;
}

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const brand = p.brand?.toLowerCase() === "apple" ? "Apple" :
                p.brand?.toLowerCase() === "samsung" ? "Samsung" :
                p.brand?.charAt(0).toUpperCase() + p.brand?.slice(1);

  const parcela = installment10(p.price);

  return (
    <article className="w-[260px] snap-start">
      <div className="border rounded-2xl overflow-hidden hover:shadow transition bg-white">
        <Link href={`/produto/${encodeURIComponent(p.id)}`} className="block p-4">
          <div className="aspect-[4/3] w-full bg-white border rounded-xl flex items-center justify-center overflow-hidden">
            <img src={p.image} alt={p.name} className="object-contain w-full h-full" />
          </div>
        </Link>

        <div className="px-4 pb-4">
          <div className="text-xs text-zinc-500 mt-2">{brand}</div>
          <Link href={`/produto/${encodeURIComponent(p.id)}`} className="font-semibold leading-tight hover:underline">
            {p.name}
          </Link>

          <div className="mt-2 text-zinc-500 text-xs">
            {p.freeShipping && <span className="text-emerald-600 font-semibold">Frete Grátis · </span>}
            no pix
          </div>

          <div className="text-[#ff3d00] font-extrabold text-lg leading-tight">
            R$ {p.price.toFixed(2).replace(".", ",")}
          </div>

          <div className="text-xs text-zinc-600">
            Ou R$ {(p.price / 0.7).toFixed(2).replace(".", ",")} em até <b>10x de R$ {parcela.toFixed(2).replace(".", ",")} sem juros</b>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href={`/produto/${encodeURIComponent(p.id)}`}
              className="flex-1 border rounded-xl py-2 text-center text-sm"
            >
              Ver produto
            </Link>
            <button
              onClick={() =>
                add({
                  id: String(p.id),
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  freeShipping: p.freeShipping,
                })
              }
              className="flex-1 bg-[#ff8c00] text-white rounded-xl py-2 text-sm"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
