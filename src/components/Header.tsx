// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import productsData from "@/data/products.json";
import {
  Menu, X, User, LogIn, ChevronRight, MessageCircle, ShoppingCart,
  ShieldCheck, Percent, Truck, Search, ChevronDown,
} from "lucide-react";

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();
const idNoExt = (id: string) => id.replace(/\.[a-z0-9]+$/i, "");
function fmt(n: number) { return Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n); }

type Product = { id: string; name: string; brand?: string; price?: number };
type Order = { code: string; items:{name:string;qty:number;price:number;total:number}[]; subtotal:number; discount:number; total:number; createdAt:string; };

function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState(""); const [result, setResult] = useState<Order|null>(null);
  const [waNumber, setWaNumber] = useState<string>(""); useEffect(()=>{ if(open){ setWaNumber(localStorage.getItem("prostore:wa")||""); }},[open]);
  function buscar(){ try{ const arr:Order[]=JSON.parse(localStorage.getItem("prostore:orders")||"[]"); setResult(arr.find(o=>o.code.toLowerCase()===code.trim().toLowerCase())||null);}catch{setResult(null);} }
  function whatsappUrl(){ const p=(waNumber||"").replace(/\D/g,""); const t=encodeURIComponent(`Olá! Preciso de ajuda com meu pedido${code?` (código ${code.trim()})`:""}.`); return p?`https://wa.me/${p}?text=${t}`:`https://wa.me/?text=${t}`; }
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2 text-zinc-800"><User className="h-5 w-5"/><b>Minha conta</b></div>
          <button onClick={onClose} className="rounded p-1 hover:bg-zinc-100" aria-label="Fechar"><X className="h-5 w-5"/></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="text-sm text-zinc-700">Acompanhar pedido</div>
            <div className="mt-2 flex gap-2">
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Digite seu código (ex.: PS-20250916-ABCD)" className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"/>
              <button onClick={buscar} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Consultar</button>
            </div>
            {result && (
              <div className="mt-3 text-sm rounded-xl border p-3">
                <div className="font-semibold">Código: {result.code}</div>
                <ul className="mt-2 space-y-1">
                  {result.items.map((it,i)=>(
                    <li key={i} className="flex items-center justify-between"><span className="truncate">{it.qty}x {it.name}</span><span className="font-medium">{fmt(it.total)}</span></li>
                  ))}
                </ul>
                <div className="mt-2 border-t pt-2 text-right text-sm">
                  <div className="text-zinc-600">Subtotal: {fmt(result.subtotal)}</div>
                  <div className="text-emerald-700">Cupom: − {fmt(result.discount)}</div>
                  <div className="font-semibold">Total: {fmt(result.total)}</div>
                </div>
              </div>
            )}
          </div>
          <div className="pt-2 border-t">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
              <MessageCircle className="h-4 w-4"/> Falar com atendente <ChevronRight className="h-4 w-4"/>
            </a>
            <p className="mt-1 text-xs text-zinc-500">Dica: salve seu WhatsApp em <b>/checkout?admin=1</b>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const { items } = useCart();
  const count = useMemo(()=> (items??[]).reduce((a,i)=>a+(i.qty||0),0),[items]);

  const [openMobile,setOpenMobile]=useState(false);
  const [showAccount,setShowAccount]=useState(false);

  const [q,setQ]=useState("");
  const productList=useMemo(()=>productsData as Product[],[]);
  function submitSearch(e?:React.FormEvent){ if(e) e.preventDefault(); const term=q.trim(); if(!term) return; const r=productList.filter(p=>norm(p.name).includes(norm(term))||norm(p.brand).includes(norm(term))); if(r[0]) router.push(`/produto/${idNoExt(r[0].id)}`); else router.push(`/ofertas`); }

  useEffect(()=>{ function onKey(e:KeyboardEvent){ if(e.key==="Escape") setOpenMobile(false);} window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey);},[]);

  return (
    <>
      <div className="w-full bg-zinc-50 border-b border-zinc-200 text-[12px] text-zinc-700">
        <div className="mx-auto max-w-[1100px] px-4 py-1 flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600"/> Nota Fiscal</span>
          <span className="inline-flex items-center gap-1.5"><Percent className="h-3.5 w-3.5 text-emerald-600"/> 30% OFF no PIX/Boleto</span>
          <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-emerald-600"/> Frete grátis em selecionados</span>
          <span className="ml-auto inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5 text-emerald-600"/> Suporte via WhatsApp</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center gap-3">
          <button onClick={()=>setOpenMobile(v=>!v)} className="lg:hidden rounded-lg p-2 hover:bg-zinc-100" aria-label="Abrir menu"><Menu className="h-5 w-5"/></button>
          <Link href="/" className="font-extrabold tracking-tight text-zinc-900">pro<span className="text-emerald-600">Store</span></Link>

          <form onSubmit={submitSearch} className="hidden md:flex flex-1 items-center pl-4">
            <div className="flex w-full items-center rounded-full border border-zinc-300 bg-white p-1.5">
              <Search className="mx-2 h-4 w-4 text-zinc-500"/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por modelo, cor, armazenamento..." className="flex-1 bg-transparent outline-none text-sm"/>
              <button type="submit" className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">Buscar</button>
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-2">
            <button onClick={()=>setShowAccount(true)} className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50" title="Minha conta">
              <LogIn className="h-4 w-4"/> Entrar
            </button>
            <Link href="/carrinho" className="relative inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50" title="Meu carrinho">
              <ShoppingCart className="h-4 w-4"/> Carrinho
              {count>0 && (<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white grid place-items-center">{count}</span>)}
            </Link>
            <Link href="/analise-boleto" className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700" title="Análise de Boleto">Análise de Boleto</Link>
          </nav>
        </div>

        {/* Segunda linha: agora usa ÂNCORAS na Home */}
        <div className="hidden md:block border-t border-zinc-200">
          <div className="mx-auto max-w-[1100px] px-4">
            <ul className="flex items-center gap-6 text-[14px] py-2 text-zinc-700">
              <li><Link href="/ofertas?brand=apple" className="inline-flex items-center gap-1 hover:text-zinc-900">iPhone <ChevronDown className="h-3.5 w-3.5"/></Link></li>
              <li><Link href="/ofertas?brand=samsung" className="inline-flex items-center gap-1 hover:text-zinc-900">Samsung <ChevronDown className="h-3.5 w-3.5"/></Link></li>
              <li><Link href="/#mais-buscados" className="hover:text-zinc-900">Mais buscados</Link></li>
              <li><Link href="/#bbb" className="hover:text-zinc-900">BBB do dia</Link></li>
              <li><Link href="/#destaques" className="hover:text-zinc-900">Ofertas em destaque</Link></li>
              <li className="ml-auto"><Link href="/checkout" className="hover:text-zinc-900">Checkout</Link></li>
            </ul>
          </div>
        </div>
      </header>

      {openMobile && (
        <div className="lg:hidden border-b border-zinc-200">
          <div className="mx-auto max-w-[1100px] px-4 py-3 flex flex-col gap-2">
            <form onSubmit={submitSearch} className="flex items-center rounded-xl border border-zinc-300 bg-white p-2">
              <Search className="h-4 w-4 text-zinc-500 mr-2"/>
              <input value={q} onChange={e=>setQ(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="Buscar produtos…"/>
              <button type="submit" className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white">Buscar</button>
            </form>
            <Link href="/ofertas?brand=apple" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">iPhone</Link>
            <Link href="/ofertas?brand=samsung" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">Samsung</Link>
            <Link href="/#mais-buscados" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">Mais buscados</Link>
            <Link href="/#bbb" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">BBB do dia</Link>
            <Link href="/#destaques" className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100">Ofertas em destaque</Link>
            <div className="mt-1 flex gap-2">
              <button onClick={()=>{setShowAccount(true); setOpenMobile(false);}} className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">Entrar</button>
              <Link href="/carrinho" className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 text-center">Carrinho</Link>
            </div>
            <Link href="/analise-boleto" className="mt-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white text-center hover:bg-emerald-700">Análise de Boleto</Link>
          </div>
        </div>
      )}

      <AccountModal open={showAccount} onClose={()=>setShowAccount(false)} />
    </>
  );
}
