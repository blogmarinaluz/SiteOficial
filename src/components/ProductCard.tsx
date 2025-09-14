"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { br } from "@/lib/format";

// selecionei ~20 ids para frete grátis (pode ajustar depois se quiser)
const FREE_SHIP_IDS = new Set<string>([
  "apple_iphone-14_128_preto","apple_iphone-14_128_azul","apple_iphone-14_128_meia-noite",
  "apple_iphone-14_128_roxo","apple_iphone-14_256_preto","apple_iphone-14_256_azul",
  "apple_iphone-15_128_preto","apple_iphone-15_128_rosa","apple_iphone-15_256_preto",
  "apple_iphone-15-plus_128_amarelo","apple_iphone-15-plus_256_preto",
  "samsumg_galaxy-a36_128_preto","samsumg_galaxy-a36_256_verde",
  "samsumg_galaxy-a56_128_preto","samsumg_galaxy-a56_256_branco",
  "samsumg_galaxy-s24-fe_128_preto","samsumg_galaxy-s24-fe_256_azul",
  "samsumg_galaxy-a17_128_preto","samsumg_galaxy-a17_256_cinza",
  "samsumg_galaxy-s21+_128gb","samsumg_galaxy-s22_128gb"
]);

type Product = {
  id: string;
  brand: string;
  name: string;
  image?: string;
  price?: number;
};

function cap(s: string) {
  if (!s) return s;
  const lower = s.toLowerCase();
  return lower[0].toUpperCase() + lower.slice(1);
}

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();

  const hasPrice = typeof p.price === "number";
  const installment = useMemo(() => {
    const total = p.price || 0;
    return total > 0 ? total / 10 : 0;
  }, [p.price]);

  const freeShipping = FREE_SHIP_IDS.has(p.id);

  return (
    <article className="card flex flex-col bg-white border rounded-2xl overflow-hidden w-[280px] snap-start">
      <Link href={`/produto/${p.id}`} className="block">
        <img
          src={p.image || "/products/placeholder.jpg"}
          alt={p.name}
          className="w-full aspect-[3/4] object-cover"
        />
      </Link>

      <div className="p-3 flex-1 flex flex-col">
        <div className="text-xs text-zinc-500">{cap(p.brand)}</div>
        <Link href={`/produto/${p.id}`} className="font-semibold leading-tight line-clamp-2 min-h-[2.6em]">
          {p.name}
        </Link>

        <div className="mt-3">
          {hasPrice ? (
            <>
              <div className="text-2xl font-extrabold text-orange-600">{br(p.price!)}</div>
              <div className="text-xs text-zinc-500">
                ou 10x de <b>{br(installment)}</b> <span className="italic">sem juros</span>
              </div>
              {freeShipping && (
                <div className="mt-1 inline-block text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Frete: <b>Grátis</b>
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-zinc-500">Indisponível</div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`/produto/${p.id}`} className="btn-outline flex-1 text-center">
            Ver produto
          </Link>
          {hasPrice ? (
            <button
              className="btn-primary flex-1"
              onClick={() => {
                add(
                  {
                    id: String(p.id),
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    freeShipping,
                  },
                  1
                );
                // feedback simples
                // (pode trocar por toast se quiser)
                alert("Adicionado ao carrinho!");
              }}
            >
              Adicionar
            </button>
          ) : (
            <button className="btn-primary opacity-60 cursor-not-allowed flex-1">Indisponível</button>
          )}
        </div>
      </div>
    </article>
  );
}
