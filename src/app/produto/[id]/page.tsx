
'use client';
import { useMemo, useState } from 'react';
import data from '@/data/products.json';
import Link from 'next/link';

function br(n:number){ return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function withPix(n:number){ return Math.round(n*0.85); } // 15% off no PIX

export default function Produto({ params }:{ params:{ id:string }}){
  const id = decodeURIComponent(params.id);
  const item = useMemo(()=> (data as any[]).find(p=>p.id===id),[id]);
  if(!item){ return <div className="p-6">Produto não encontrado.</div>; }

  // Agrupar variantes pelo mesmo model_key
  const variantes = (data as any[]).filter(p=>p.model_key===item.model_key);
  const storages = Array.from(new Set(variantes.map(v=>v.storage))).sort();
  const cores = Array.from(new Set(variantes.map(v=>v.color)));
  const [selStorage, setSelStorage] = useState(item.storage);
  const [selColor, setSelColor] = useState(item.color);

  const ativo = useMemo(()=> variantes.find(v=>v.storage===selStorage && v.color===selColor) ?? item,
    [selStorage, selColor, item]);

  const preco = ativo.price as number|undefined;

  function addToCart(){
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const exists = cart.find((c:any)=>c.id===ativo.id);
    if(exists){ exists.qty += 1; } else {
      cart.push({ id: ativo.id, name: ativo.name, image: ativo.image, storage: ativo.storage, color: ativo.color, price: ativo.price, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Adicionado ao carrinho!');
  }

  return (
    <div className="grid md:grid-cols-[1fr,1fr] gap-8 p-6">
      <div>
        {/* Imagem principal trocando com a cor/GB */}
        <img src={ativo.image} alt={ativo.name} className="rounded-2xl w-full object-cover"/>
        {/* Miniaturas por cor */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {cores.map(c=>(
            <button key={c} onClick={()=>setSelColor(c)} className={`h-8 px-3 rounded-full border ${selColor===c?'border-zinc-900':'border-zinc-300'}`}>{c}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm text-zinc-500">Desbloqueado com 90 dias de garantia</div>
        <h1 className="text-2xl font-bold">{item.name} {selColor}</h1>

        {/* Opções de cor */}
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Cor</div>
          <div className="flex gap-2 flex-wrap">
            {cores.map(c=>(
              <button key={c} onClick={()=>setSelColor(c)} className={`px-3 py-2 rounded-full border ${selColor===c?'border-zinc-900 bg-zinc-100':'border-zinc-300'}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Opções de capacidade */}
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Capacidade</div>
          <div className="flex gap-2 flex-wrap">
            {storages.map(s=>(
              <button key={s} onClick={()=>setSelStorage(s)} className={`px-3 py-2 rounded-lg border ${selStorage===s?'border-zinc-900 bg-zinc-100':'border-zinc-300'}`}>{s} GB</button>
            ))}
          </div>
        </div>

        {/* Preços */}
        <div className="mt-4">
          {preco ? (<>
            <div className="text-sm line-through text-zinc-500">{br(preco)}</div>
            <div className="text-3xl font-bold text-green-700">{br(withPix(preco))} <span className="text-sm align-top ml-2">15% OFF no PIX</span></div>
            <div className="text-sm mt-1">ou {br(preco)} em até 10x sem juros</div>
          </>):(<div className="text-sm text-zinc-500">Indisponível nesta combinação.</div>)}
        </div>

        {/* Ações */}
        <div className="mt-6 flex gap-3">
          <button onClick={addToCart} disabled={!preco} className={"btn "+(!preco?'opacity-50 cursor-not-allowed':'')}>Adicionar ao carrinho</button>
          <Link href={`/checkout?item=${encodeURIComponent(ativo.id)}`} className={"btn-secondary "+(!preco?'pointer-events-none opacity-50':'')}>Comprar</Link>
        </div>

        <div className="mt-6">
          <details>
            <summary className="cursor-pointer font-medium">Entender Condições</summary>
            <p className="text-sm text-zinc-600 mt-2">Condição: MUITO BOM — Smartphone 100% funcional, com leves sinais de uso. Bateria acima de 80%.</p>
          </details>
        
        /* ESPECS-SECTION-START */
        <div className="mt-10 space-y-6">
          <section className="border rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">Descrição do produto</h2>
            <p className="text-zinc-700">{(require('@/data/specs.json') as any)[ativo.model_key]?.descricao || 'Descrição breve do produto e condições (recondicionado, testado, com garantia).'} </p>
          </section>
          <section className="border rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">Características técnicas</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {Object.entries(((require('@/data/specs.json') as any)[ativo.model_key]?.caracteristicas) || {}).map(([k,v]:any)=>(
                <div key={k} className="flex justify-between gap-4 border-b pb-2">
                  <span className="text-zinc-500">{k}</span>
                  <span className="font-medium text-zinc-800">{v as string}</span>
                </div>
              ))}
              {Object.keys(((require('@/data/specs.json') as any)[ativo.model_key]?.caracteristicas) || {}).length===0 && (
                <div className="text-zinc-500">Detalhes técnicos disponíveis mediante a variante selecionada.</div>
              )}
            </div>
          </section>
        </div>
        /* ESPECS-SECTION-END */
    
      </div>
    </div>
  )
}
