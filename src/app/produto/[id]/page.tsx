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

function stripQuery(s: string) {
  const i = s.indexOf("?");
  return i >= 0 ? s.slice(0, i) : s;
}
function stripExt(s: string) {
  return s.replace(/\.(jpg|jpeg|png|webp)$/i, "");
}
function norm(s: string) {
  return stripExt(stripQuery(String(s || ""))).toLowerCase();
}
function filename(path: string) {
  const p = String(path || "");
  return p.split("/").pop() || p;
}

export default function ProdutoPage() {
  const params = useParams();
  const raw = Array.isArray(params?.id) ? params.id[0] : String(params?.id || "");
  const slug = norm(raw);
  const { add } = useCart();

  const p: Product | undefined = useMemo(() => {
    const list = products as Product[];

    const byId =
      list.find((x) => norm(x.id) === slug) ||
      list.find((x) => norm(x.id) === `${slug}`) ||
      list.find((x) => norm(x.id) === `${slug}.jpg`) ||
      list.find((x) => norm(x.id) === `${slug}.jpeg`) ||
      list.find((x) => norm(x.id) === `${slug}.png`) ||
      list.find((x) => norm(x.id) === `${slug}.webp`);

    if (byId) return byId;

    const byImage = list.find((x) => norm(filename(x.image)) === slug);
    if (byImage) return byImage;

    return list.find(
      (x) => norm(x.id).startsWith(slug) || norm(x.id).endsWith(slug)
    );
  }, [slug]);

  function handleAdd() {
    const prod = p;
    if (!prod) return;

    add(
      {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        color: prod.color,
        storage: prod.storage,
      },
      1
    );
    alert("Adicionado ao carrinho!");
  }

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

  const precoPix = withCoupon(p.price);
  const parcela10 = p.price / 10;

  return (
    <div className="container p-6 grid md:grid-cols-[1fr,1fr] gap-8">
      <div className="rounded-2xl border bg-white p-6 flex items-center justify-center">
        <img
          src={p.image}
          alt={p.name}
          className="w-full max-w-md h-auto object-contain"
        />
      </div>

      <div className="space-y-4">
        <div className="text-xs uppercase tracking-wide text-zinc-500">
          {p.brand?.toLowerCase() === "apple"
            ? "Apple"
            : p.brand?.toLowerCase() === "samsung"
            ? "Samsung"
            : p.brand}
        </div>
        <h1 className="text-2xl font-extrabold leading-tight">{p.name}</h1>

        <div className="space-y-1">
          <div className="text-2xl font-black text-accent">{br(precoPix)} no PIX</div>
          <div className="text-sm text-zinc-500 line-through">{br(p.price)}</div>
          <div className="text-sm text-zinc-700">
            ou 10x de <b>{br(parcela10)}</b>{" "}
            <span className="text-emerald-600 font-medium">sem juros</span>
          </div>
          <div className="text-xs text-zinc-500">
            Cupom de <b>30% OFF</b> aplicado automaticamente.
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button className="btn-primary" onClick={handleAdd}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Adicionar ao carrinho
          </button>
          <Link href="/carrinho" className="btn-outline">
            Ver carrinho
          </Link>
        </div>

        <ul className="text-sm text-zinc-700 space-y-1 pt-3">
          <li>Produto novo, lacrado e com garantia.</li>
          <li>Emissão de nota fiscal.</li>
          <li>Envio para todo o Brasil.</li>
        </ul>
      </div>
    </div>
  );
}

      </div>
    </div>
  );
}
