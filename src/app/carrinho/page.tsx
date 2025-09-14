'use client';
import { useCart } from '@/hooks/useCart';
import { br, withCoupon } from '@/lib/format';
import { useRouter } from 'next/navigation';
export default function Carrinho(){
  const { items, remove, total, totalWithCoupon, clear } = useCart();
  const router = useRouter();
  const finalizar = (m:string)=>{ clear(); router.push(m==='boleto'?'/analise-de-cadastro?from=checkout':'/pedido-confirmado'); };
  return (<div><h1 className="text-2xl font-bold mb-4">Carrinho</h1>{items.length===0?<p>Seu carrinho está vazio.</p>:(
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">{items.map(i=>(
        <div key={i.id} className="card flex items-center gap-4">
          <img src={i.image} className="w-28 h-20 object-cover rounded-xl"/>
          <div className="flex-1">
            <div className="font-medium">{i.name} {i.storage} — {i.color}</div>
            <div className="text-xs text-zinc-500 line-through">{br(i.price||0)}</div>
            <div className="text-sm font-semibold text-accent">Com cupom: {i.price? br(withCoupon(i.price)) : '—'}</div>
          </div>
          <button className="btn-outline" onClick={()=>remove(i.id)}>Remover</button>
        </div>
      ))}</div>
      <aside className="card">
        <div className="font-semibold">Resumo</div>
        <div className="mt-2 text-sm flex justify-between"><span>Subtotal</span><span>{br(total())}</span></div>
        <div className="text-sm flex justify-between"><span>Desconto (30%)</span><span>- {br(total()-totalWithCoupon())}</span></div>
        <div className="text-lg font-bold flex justify-between mt-1 text-accent"><span>Total</span><span>{br(totalWithCoupon())}</span></div>
        <div className="mt-4 space-y-2">
          <button onClick={()=>finalizar('pix')} className="btn-primary w-full">Pagar com Pix</button>
          <button onClick={()=>finalizar('cartao')} className="btn-outline w-full">Cartão em até 12x</button>
          <button onClick={()=>finalizar('boleto')} className="btn-outline w-full">Boleto (inclui negativados)</button>
        </div>
      </aside>
    </div>
  )}</div>)
}
