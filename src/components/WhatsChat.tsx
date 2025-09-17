// src/components/WhatsChat.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const SELLER_NUMBER = process.env.NEXT_PUBLIC_SELLER_NUMBER || "55999984905715";

function waLink(msg: string) {
  const text = encodeURIComponent(msg);
  const num = SELLER_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${num}?text=${text}`;
}

export default function WhatsChat() {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");

  useEffect(() => {
    const n = typeof window !== "undefined" ? localStorage.getItem("lead_name") : null;
    if (n) setNome(n);
  }, []);

  const defaultMsg = nome
    ? `Olá, sou ${nome}. Quero atendimento pelo WhatsApp.`
    : "Olá, quero atendimento pelo WhatsApp.";

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 z-[1000] rounded-full p-4 bg-green-500 text-white shadow-xl
                     bottom-[88px] lg:bottom-4"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" } as any}
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div
          className="fixed right-4 z-[1000] w-80 rounded-2xl border bg-white shadow-xl
                     bottom-[88px] lg:bottom-4"
          style={{ marginBottom: "env(safe-area-inset-bottom)" } as any}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="font-semibold">Atendimento</div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
              aria-label="Fechar chat"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-3">
            <label className="block text-sm text-zinc-600">
              Seu nome
              <input
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Como devemos te chamar?"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  try { localStorage.setItem("lead_name", e.target.value); } catch {}
                }}
              />
            </label>

            <a
              href={waLink(defaultMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center rounded-xl bg-green-600 text-white py-2.5 font-medium hover:bg-green-700"
            >
              Abrir conversa no WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
