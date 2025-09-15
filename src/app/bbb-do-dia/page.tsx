import Link from "next/link";
import products from "@/data/products.json";
import { br, withCoupon } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  brand: string;
  image?: string;
  price: number;
  model_key?: string;
  tag?: string;
};

const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");

export default function BbbDoDiaPage() {
  const list = (products as Product[]);

  const filtered = list.filter((p) => {
    const t = (p.tag || "").toLowerCase();
    const n = p.name.toLowerCase();
    return t.includes("bbb") || t.includes("bbb do dia") || n.includes("bbb do dia");
  });

  // Fallback: garante conteúdo mesmo sem tag
  const items = (filtered.length ? filtered : [...list].sort((a, b) => a.price - b.price).slice(0, 12));

  return (
    <div className="container py-6 md:py-8">
      <h1 className="text-xl md:text-2xl font-semibold">BBB do dia</h1>
      <p className="text-sm text-zinc-600 mt-1">Seleção com os melhores preços do dia.</p>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link key={p.id} href={`/produto/${idNoExt(p.id)}`} className="rounded-2xl border bg-white p-3 hover:shadow-sm transition">
            <div className="h-44 grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image || "/placeholder.svg"} alt={p.name} className="max-h-40 object-contain" />
            </div>
            <div className="text-[12px] md:text-sm text-zinc-500 mt-1">{p.brand}</div>
            <div className="font-medium text-[13px] md:text-sm line-clamp-2 min-h-[2.8rem]">{p.name}</div>
            <div className="mt-1 text-[11px] text-zinc-500">A partir de</div>
            <div className="text-emerald-700 font-semibold text-lg tracking-tight">{br(withCoupon(p.price))}</div>
            <div className="text-[11px] text-zinc-500">10x sem juros de {br(Math.ceil(p.price / 10))}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
