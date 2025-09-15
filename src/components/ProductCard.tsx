import Link from "next/link";
import { br, withCoupon } from "@/lib/format";
import { useCart } from "@/hooks/useCart";

type Product = {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  freeShipping?: boolean;
  storage?: string;
  color?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const original = Number(product?.price || 0);
  const promo = withCoupon(original); // 30% OFF (função já existe no seu projeto)
  const per = promo / 10;

  const brandCap =
    product?.brand ? product.brand.charAt(0).toUpperCase() + product.brand.slice(1).toLowerCase() : "";

  return (
    <div className="card h-full">
      {/* imagem + badge frete */}
      <div className="relative">
        {product.freeShipping && (
          <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-green-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            Frete Grátis
          </span>
        )}

        <Link href={`/produto/${product.id}`} className="block">
          <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-50">
            {/* Usar <img> evita precisar configurar domains do next/image */}
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        </Link>
      </div>

      {/* título */}
      <div className="mt-3">
        <p className="text-xs text-zinc-500">{brandCap}</p>
        <Link
          href={`/produto/${product.id}`}
          className="line-clamp-2 text-sm font-semibold text-zinc-900"
          title={product.name}
        >
          {product.name}
        </Link>
      </div>

      {/* preços */}
      <div className="mt-2">
        {/* linha riscado + promocional */}
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-zinc-500 line-through">{br(original)}</span>
          <span
            className="text-lg font-extrabold"
            style={{ color: "var(--brand-700)" }}
            aria-label="Preço com 30% de desconto"
          >
            {br(promo)}
          </span>
        </div>

        {/* a partir de / pix-boleto */}
        <p className="mt-1 text-xs text-zinc-600">A partir de</p>
        <p className="text-sm font-semibold text-zinc-800">
          {br(promo)} <span className="font-normal text-zinc-600">no pix ou boleto</span>
        </p>

        {/* linha do cartão */}
        <p className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
          <CardIcon className="h-4 w-4" />
          <span>
            ou <strong>{br(promo)}</strong> em até{" "}
            <strong>10x de {br(per)}</strong> sem juros
          </span>
        </p>
      </div>

      {/* ações */}
      <div className="mt-3 flex gap-2">
        <Link
          href={`/produto/${product.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Ver produto
        </Link>

        <button
          onClick={() => add(product, 1)}
          className="inline-flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow"
          style={{ backgroundColor: "var(--brand-700)" }}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

/* ícone simples de cartão */
function CardIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <rect x="4" y="9" width="16" height="2" fill="#fff" />
    </svg>
  );
}
