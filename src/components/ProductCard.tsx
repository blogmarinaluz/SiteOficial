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
  [k: string]: any;
};

/** Compat: aceita 'product' (novo) OU 'p' (antigo) */
type Props = { product?: Product; p?: Product };

/* Ícones (SVGs leves, sem libs) */
const IconCreditCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm16 2H4v3h16V7Zm-9 7H5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" fill="currentColor"/>
  </svg>
);

const IconTruck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M3 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3h2.59A2 2 0 0 1 19 10l2 3v4a2 2 0 0 1-2 2h-1a2.5 2.5 0 1 1-5 0H9a2.5 2.5 0 1 1-5 0H3a2 2 0 0 1-2-2V6Zm2 0v11h.17A2.5 2.5 0 0 1 7 18.5a2.5 2.5 0 0 1 4.83.5h2.34a2.5 2.5 0 0 1 4.83-.5H20v-2h-3a1 1 0 0 1-1-1V8H5ZM20 12.76 18.92 11H16v2h4Z" fill="currentColor"/>
  </svg>
);

export default function ProductCard({ product: productProp, p: pProp }: Props) {
  const product = (productProp ?? pProp) as Product | undefined;
  const { add } = useCart();
  if (!product) return null;

  const cash = withCoupon(product.price);   // 30% OFF (pix/boleto)
  const installment = cash / 10;            // 10x sem juros

  const brandLabel =
    product.brand?.toLowerCase() === "apple"
      ? "Apple"
      : product.brand?.toLowerCase() === "samsung"
      ? "Samsung"
      : product.brand;

  const imgSrc = product.image
    ? (product.image.startsWith("/") ? product.image : `/import_imgs/${product.image}`)
    : "/import_imgs/placeholder.png";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Badge Frete Grátis (bonita, com ícone) */}
      {product.freeShipping && (
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <IconTruck className="h-3.5 w-3.5" />
            Frete Grátis
          </span>
        </div>
      )}

      {/* Imagem */}
      <Link
        href={`/produto/${product.id}`}
        className="relative flex items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50/60"
      >
        <div className="relative h-44 w-full">
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
          <Link
            href={`/produto/${product.id}`}
            className="line-clamp-2 text-[15px] font-medium text-neutral-900"
          >
            {product.name}
          </Link>
        </div>

        {/* Preços (paleta verde da marca) */}
        <div className="mt-3 space-y-1.5">
          <p className="text-xs text-neutral-600">A partir de</p>
          <div className="text-[22px] font-extrabold leading-none tracking-tight text-emerald-700">
            {br(cash)}{" "}
            <span className="align-middle text-[12px] font-semibold text-neutral-700">
              no pix ou boleto
            </span>
          </div>

          {/* Linha de parcelamento — alinhada/bem proporcionada */}
          <div className="mt-1 flex items-center gap-2 text-sm leading-5 text-neutral-700">
            <IconCreditCard className="h-4 w-4 shrink-0 text-neutral-700" />
            <span className="whitespace-normal">
              ou <span className="font-semibold">{br(cash)}</span> em até{" "}
              <span className="font-semibold">10x</span> de{" "}
              <span className="font-semibold">{br(installment)}</span>{" "}
              <span className="font-semibold">sem juros</span>
            </span>
          </div>
        </div>

        {/* Ações (botão na cor da marca) */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/produto/${product.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Ver produto
          </Link>
          <button
            onClick={() => add(product as any, 1)}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
