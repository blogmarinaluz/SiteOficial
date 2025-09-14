"use client";
import Link from "next/link";
import { br, withCoupon } from "@/lib/format";
import { useCart } from "@/hooks/useCart";

export default function ProductCard({ p }: { p: any }) {
  const { add } = useCart();
  const has = typeof p.price === "number";

  return (
    <div className="card flex flex-col">
      <Link href={`/produto/${p.id}`} className="block">
        <img
          src={p.image || "/products/placeholder.jpg"}
          alt={p.name}
          className="rounded-xl object-cover w-full h-[220px]"
        />
      </Link>

      <div className="mt-3">
        <div className="text-sm text-zinc-500">{p.brand}</div>
        <div className="font-semibold leading-snug">{p.name}</div>
      </div>

      {has && (
        <>
          <div className="mt-1 text-xs line-through text-zinc-500">{br(p.price)}</div>
          <div className="text-lg font-bold text-accent">{br(withCoupon(p.price))}</div>
        </>
      )}

      <button
        disabled={!has}
        onClick={() =>
          has &&
          add(
            {
              id: p.id,
              name: p.name,
              image: p.image,
              storage: p.storage,
              color: p.color,
              price: p.price,
            },
            1
          )
        }
        className={
          "mt-3 w-full " +
          (has ? "btn-primary" : "btn-outline opacity-60 cursor-not-allowed")
        }
      >
        {has ? "Adicionar ao carrinho" : "Indisponível"}
      </button>
    </div>
  );
}
