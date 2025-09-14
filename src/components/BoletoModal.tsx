"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BoletoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("boleto_popup_dismissed");
    if (!seen) setOpen(true);
  }, []);

  function close() {
    localStorage.setItem("boleto_popup_dismissed", "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] grid place-items-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="text-sm text-green-700 font-semibold">Condição Especial</div>
        <h3 className="text-2xl font-bold mt-1">Pague no BOLETO mesmo com score baixo</h3>
        <p className="text-sm text-zinc-600 mt-2">
          Análise de cadastro simples e liberação em até <b>24h</b>. Sem cartão de crédito. Fale com nosso time!
        </p>

        <ul className="mt-4 text-sm list-disc pl-5 space-y-1">
          <li>Sem consulta ao cartão</li>
          <li>Atendimento humano via WhatsApp</li>
          <li>Estoque próprio, envio rápido</li>
        </ul>

        <div className="mt-5 flex gap-2">
          <Link href="/checkout" className="btn-primary">Quero solicitar pelo boleto</Link>
          <button onClick={close} className="btn-outline">Depois</button>
        </div>
      </div>
    </div>
  );
}
