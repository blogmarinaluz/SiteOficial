"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { br, withCoupon } from "@/lib/format";

export type Product = {
  id: string;
  brand: "apple" | "samsung" | string;
  name: string;
  image?: string;
  price: number;
  freeShipping?: boolean;
};

const IconCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm2 0h14v3H5V6Zm0 5h5a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Zm9 4h5a1 1 0 1 1 0 2h-5a1 1 0 0 1 0-2Z" fill="currentColor"/>
  </svg>
);

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const cash = withCoupon(product.price);               // 30% OFF (pix/boleto)
  const installment = cash / 10;                        // 10x sem juros
  const brandLabel =
    product.brand?.toLowerCase() === "apple"
      ? "Apple"
      : product.brand?.toLowerCase() === "samsung"
      ? "Samsung"
      : product.brand;

  const imgSrc =
    product.image
      ? (product.image.startsWith("/") ? product.image : `/import_imgs/${product.image}`)
      : "/import_imgs/placeholder.png";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Badge Frete Grátis */}
      {product.freeShipping && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
          Frete Grátis
        </div>
      )}

      {/* Imagem */}
      <Link href={`/produto/${product.id}`} className="relative flex items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50/60">
        <div className="relative h-40 w-full md:h-44">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(min-width:1024px) 260px, (min-width:768px) 33vw, 50vw"
          />
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="mt-3 flex flex-1 flex-col">
        <div className="min-h-[54px]">
          <p className="text-xs text-neutral-500">{brandLabel}</p>
          <Link href={`/produto/${product.id}`} className="line-clamp-2 text-[15px] font-medium text-neutral-900">
            {product.name}
          </Link>
        </div>

        {/* Preços */}
        <div className="mt-3">
          <p className="text-xs text-neutral-600">A partir de</p>
          <div className="mt-0.5 text-xl font-extrabold text-orange-600">
            {br(cash)} <span className="text-[13px] font-semibold text-neutral-700">no pix ou boleto</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <IconCard className="h-4 w-4 text-neutral-700" />
            <span className="text-neutral-700">
              ou {br(cash)} em até <span className="font-semibold">10x</span> de {br(installment)} <span className="font-semibold">sem juros</span>
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/produto/${product.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Ver produto
          </Link>
          <button
            onClick={() => add({ ...product, qty: 1 })}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
