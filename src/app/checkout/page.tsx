
'use client';
import { useEffect, useMemo, useState } from 'react';
import data from '@/data/products.json';

function br(n:number){ return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

export default function Checkout({ searchParams }:{ searchParams?:{ item?:string }}){
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  // Recupera carrinho e item direto
  const cart = useMemo(()=>{
    if (typeof window === 'undefined') return [];
    const fromParam = searchParams?.item ? (data as any[]).find(p=>p.id===searchParams.item) : null;
    let cart = JSON.parse(localStorage.getItem('cart')||'[]');
    if(fromParam){
      cart = [{ id: fromParam.id, name: fromParam.name, storage: fromParam.storage, color: fromParam.color, price: fromParam.price, qty: 1, image: fromParam.image }];
    }
    return cart;
  }, [searchParams?.item]);

  const total = cart.reduce((s:any, it:any)=> s + (it.price||0) * it.qty, 0);

  function finalizar(){
    const items = cart.map((it:any)=>`• ${it.name} ${it.storage}GB - ${it.color} x${it.qty} = ${br((it.price||0)*it.qty)}`).join('%0A');
    const dados = [
      `Nome: ${nome}`,
      `CPF: ${cpf}`,
      `Telefone: ${telefone}`,
      `Endereço: ${endereco}, ${numero}`,
      `CEP: ${cep}`,
      `Cidade/UF: ${cidade}-${uf}`
    ].join('%0A');
    const msg = `Olá! Quero finalizar minha compra:%0A${items}%0A%0ATotal: ${br(total)}%0A%0A${dados}`;
    const whatsapp = '55' + (telefone.replace(/\D/g,'')); // fallback para o próprio número do cliente
    const sellerNumber = '5599999999999'; // TODO: troque para o número oficial
    const url = `https://wa.me/${sellerNumber}?text=${msg}`;
    window.location.href = url;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-[2fr,1fr] gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Pagamento</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <input placeholder="Nome completo" value={nome} onChange={e=>setNome(e.target.value)} className="input"/>
          <input placeholder="CPF" value={cpf} onChange={e=>setCpf(e.target.value)} className="input"/>
          <input placeholder="Telefone (WhatsApp)" value={telefone} onChange={e=>setTelefone(e.target.value)} className="input sm:col-span-2"/>
          <input placeholder="Endereço" value={endereco} onChange={e=>setEndereco(e.target.value)} className="input sm:col-span-2"/>
          <input placeholder="Número" value={numero} onChange={e=>setNumero(e.target.value)} className="input"/>
          <input placeholder="CEP" value={cep} onChange={e=>setCep(e.target.value)} className="input"/>
          <input placeholder="Cidade" value={cidade} onChange={e=>setCidade(e.target.value)} className="input"/>
          <input placeholder="UF" value={uf} onChange={e=>setUf(e.target.value)} className="input"/>
        </div>
        <button onClick={finalizar} className="btn mt-6 w-full">Finalizar e ir para WhatsApp</button>
        <p className="text-xs text-zinc-500 mt-2">Sem cobrança online. Você será redirecionado para o nosso WhatsApp para concluir com segurança.</p>
      </div>
      <div>
        <div className="sticky top-6 border rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Resumo</h2>
          <div className="space-y-2">
            {cart.map((it:any)=>(
              <div key={it.id} className="flex gap-3">
                <img src={it.image} className="w-16 h-16 rounded-lg object-cover" alt={it.name}/>
                <div className="text-sm">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-zinc-500">{it.storage}GB • {it.color}</div>
                  <div className="font-semibold">{br(it.price||0)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between font-semibold">
            <span>Total</span><span>{br(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
