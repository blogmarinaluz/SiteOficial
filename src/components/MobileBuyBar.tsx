// src/components/MobileBuyBar.tsx
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { br, withCoupon } from '@/lib/format';

export type BuyBarProduct = {
  id: string;
  name: string;
  image?: string;
  price: number;
  freeShipping?: boolean;
};

export default function MobileBuyBar({ product }: { product: BuyBarProduct }) {
  const router = useRouter();
  const { add } = useCart();

  const original = Number(product?.price) || 0;
  const promo = useMemo(() => withCoupon(original), [original]);
  const parcela = useMemo(() => promo / 10, [promo]);

  const onBuyNow = () => {
    add(product as any, 1);
    router.push('/carrinho');
  };

  return (
    <div
      className="lg:hidden fixed inset-x-0 z-[49] bg-white/95 backdrop-blur border-t border-zinc-200"
      style={{ bottom: '88px', paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' } as any}
      aria-label="Barra de compra rápida"
    >
      <div className="mx-auto max-w-[1100px] px-4 py-2 flex items-center gap-3">
        <div className="min-w-0">
          <div className="text-xs text-zinc-500 line-through">{br(original)}</div>
          <div className="text-lg font-bold leading-tight">{br(promo)}</div>
          <div className="text-[11px] text-zinc-500">em 10x de <strong>{br(parcela)}</strong> sem juros</div>
        </div>
        <button
          onClick={onBuyNow}
          className="ml-auto h-11 px-5 rounded-xl bg-emerald-600 text-white font-medium shadow-sm active:scale-[0.99]"
        >
          Comprar agora
        </button>
      </div>
    </div>
  );
}
