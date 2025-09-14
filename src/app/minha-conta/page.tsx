'use client';import { useState,useEffect } from 'react';
export default function MinhaConta(){
  const [email,setEmail]=useState(''); const [senha,setSenha]=useState(''); const [ok,setOk]=useState(false);
  useEffect(()=>{const e=localStorage.getItem('prostore-email'); if(e){setEmail(e); setOk(true)}},[]);
  const login=()=>{ if(!email) return; localStorage.setItem('prostore-email',email); setOk(true); };
  const logout=()=>{ localStorage.removeItem('prostore-email'); setOk(false); setEmail(''); setSenha(''); };
  return (<div className="max-w-md"><h1 className="text-2xl font-bold mb-3">Minha Conta</h1> {!ok?(
    <div className="card space-y-2">
      <div><label className="text-sm">E-mail</label><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-2xl px-3 py-2 mt-1"/></div>
      <div><label className="text-sm">Senha</label><input type="password" value={senha} onChange={e=>setSenha(e.target.value)} className="w-full border rounded-2xl px-3 py-2 mt-1"/></div>
      <button onClick={login} className="btn-primary w-full mt-2">Criar conta / Entrar</button>
    </div>):(<div className="card"><p className="text-sm">Logado como <b>{email}</b></p><button onClick={logout} className="btn-outline mt-3">Sair</button></div>)}
  </div>)
}
