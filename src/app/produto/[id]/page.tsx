// src/app/produto/[id]/page.tsx — COMPLETO
"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import products from "@/data/products.json";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

type Product = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  color?: string;
  storage?: string | number;
};

export default function ProdutoPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : String(params?.id || "");
  const { add } = useCart();

  const p = useMemo(() => {
    return (products as Product[]).find((x) => x.id === id);
  }, [id]);

  if (!p) {
    return (
      <div className="container py-10">
        <div className="rounded-2xl border p-6">
          <h1 className="text-xl font-bold mb-2">Produto não encontrado</h1>
          <Link href="/" className="btn-primary">Voltar para a Home</Link>
        </div>
      </div>
    );
  }

  function handleAdd() {
    // ✅ passa o item SEM qty + a quantidade como 2º argumento
    add(
      {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        color: p.color,
        storage: p.storage,
      },
      1
    );
    alert("Adicionado ao carrinho!");
  }

  const precoPix = withCoupon(p.price); // 30% OFF aplicado
  const parcela10 = p.price / 10;

  return (
    <div className="container p-6 grid md:grid-cols-[1fr,1fr] gap-8">
      {/* Imagem */}
      <div className="rounded-2xl border bg-white p-6 flex items-center justify-center">
        <img
          src={p.image}
          alt={p.name}
          className="w-full max-w-md h-auto object-contain"
        />
      </div>

      {/* Detalhes */}
      <div className="space-y-4">
        <div className="text-xs uppercase tracking-wide text-zinc-500">
          {p.brand?.toLowerCase() === "apple" ? "Apple" :
           p.brand?.toLowerCase() === "samsung" ? "Samsung" : p.brand}
        </div>
        <h1 className="text-2xl font-extrabold leading-tight">{p.name}</h1>

        <div className="space-y-1">
          <div className="text-2xl font-black text-accent">{br(precoPix)} no PIX</div>
          <div className="text-sm text-zinc-500 line-through">{br(p.price)} sem desconto</div>
          <div className="text-sm text-zinc-700">
            ou 10x de <b>{br(parcela10)}</b> <span className="text-emerald-600 font-medium">sem juros</span>
          </div>
          <div className="text-xs text-zinc-500">
            Cupom de <b>30% OFF</b> aplicado automaticamente.
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-2">
          <button className="btn-primary" onClick={handleAdd}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Adicionar ao carrinho
          </button>
          <Link href="/carrinho" className="btn-outline">
            Ver carrinho
          </Link>
        </div>

        {/* Informações extras */}
        <ul className="text-sm text-zinc-700 space-y-1 pt-3">
          <li>Produto novo, lacrado e com garantia.</li>
          <li>Emissão de nota fiscal.</li>
          <li>Envio para todo o Brasil.</li>
        </ul>
      </div>
    </div>
  );
}
