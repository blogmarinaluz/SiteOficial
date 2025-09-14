"use client";
import Link from "next/link";
import { br, withCoupon } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";

export default function ProductCard({ p }: { p: any }) {
  const { add } = useCart();
  const has = typeof p.price === "number";
  const [toast, setToast] = useState(false);

  function addAndToast() {
    if (!has) return;
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
    );
    setToast(true);
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="card flex flex-col">
      <Link href={`/produto/${p.id}`} className="block">
        {/* BOX 3:4 COM IMAGEM PROPORCIONAL */}
        <div className="relative w-full overflow-hidden rounded-xl bg-white">
          <div className="aspect-[3/4] w-full bg-zinc-50 grid place-items-center">
            <img
              src={p.image || "/products/placeholder.jpg"}
              alt={p.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </Link>

      <div className="mt-3">
        <div className="text-sm text-zinc-500">{p.brand}</div>
        <div className="font-semibold leading-snug">{p.name}</div>
      </div>

      {has && (
        <>
          <div className="mt-1 text-xs line-through text-zinc-500">{br(p.price)}</div>
          <div className="text-lg font-bold text-accent">{br(withCoupon(p.price))}</div>
          <div className="text-[11px] text-green-700">*Cupom 30% OFF aplicado no carrinho</div>
        </>
      )}

      <button
        disabled={!has}
        onClick={addAndToast}
        className={
          "mt-3 w-full " +
          (has ? "btn-primary" : "btn-outline opacity-60 cursor-not-allowed")
        }
      >
        {has ? "Adicionar ao carrinho" : "Indisponível"}
      </button>

      {/* TOAST CONFIRMAÇÃO */}
      {toast && (
        <div className="fixed right-4 bottom-4 z-[999] max-w-[90vw] sm:max-w-sm border shadow-lg rounded-2xl bg-white p-4">
          <div className="font-medium">Adicionado ao carrinho</div>
          <div className="text-xs text-zinc-600 truncate">{p.name}</div>
          <div className="mt-2 flex gap-2">
            <Link href="/carrinho" className="btn-outline">Ver carrinho</Link>
            <Link href="/checkout" className="btn-primary">Finalizar</Link>
          </div>
        </div>
      )}
    </div>
  );
}
