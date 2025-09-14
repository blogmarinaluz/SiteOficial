"use client";
import Link from "next/link";
import { br, withCoupon } from "@/lib/format";

export default function ProductCard({ p }: { p: any }) {
  const has = typeof p.price === "number";
  return (
    <div className="card flex flex-col">
      <Link href={`/produto/${p.id}`}>
        <img
          src={p.image || "/products/placeholder.jpg"}
          alt={p.name}
          className="rounded-xl object-cover aspect-[4/3]"
        />
      </Link>

      <div className="mt-3">
        <div className="text-sm text-zinc-500">{p.brand}</div>
        <div className="font-semibold">{p.name}</div>
        <div className="mt-1 flex gap-1 flex-wrap">
          {p.storage && <span className="pill">{p.storage}GB</span>}
          {p.color && <span className="pill">{p.color}</span>}
        </div>
      </div>

      {!has ? (
        <div className="mt-2">
          <span className="badge bg-zinc-200">Esgotado</span>
        </div>
      ) : (
        <>
          <div className="mt-1 text-xs line-through text-zinc-500">{br(p.price)}</div>
          <div className="text-lg font-bold text-accent">
            {br(withCoupon(p.price))} <span className="badge ml-2">-30%</span>
          </div>
        </>
      )}

      <button
        disabled={!has}
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
