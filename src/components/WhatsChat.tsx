"use client";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const SELLER_NUMBER =
  process.env.NEXT_PUBLIC_SELLER_NUMBER || "55999984905715";

export default function WhatsChat() {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");

  useEffect(() => {
    const n = localStorage.getItem("lead_name");
    if (n) setNome(n);
  }, []);

  function toWhats() {
    localStorage.setItem("lead_name", nome || "");
    const msg = encodeURIComponent(
      `Olá, sou ${nome || "cliente"} e quero falar sobre as ofertas no boleto.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${SELLER_NUMBER}&text=${msg}`, "_blank");
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[1000] rounded-full p-4 bg-green-500 text-white shadow-xl"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-[1000] w-80 rounded-2xl border bg-white shadow-xl">
          <div className="p-4 border-b">
            <div className="font-semibold">Fale com a proStore</div>
            <div className="text-xs text-zinc-600">Atendimento via WhatsApp</div>
          </div>
          <div className="p-4 space-y-2">
            <input
              className="input w-full"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <button className="btn-primary w-full" onClick={toWhats}>
              Abrir WhatsApp
            </button>
            <button className="btn-outline w-full" onClick={() => setOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
