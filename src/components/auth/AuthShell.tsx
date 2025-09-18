// src/components/auth/AuthShell.tsx
"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AuthShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="w-full bg-[#ffffff] text-gray-900 flex justify-center">
      {/* Wrapper mais curto para reduzir espaço até o rodapé */}
      <div className="w-full max-w-[460px] px-4 pt-6 pb-6">
        {/* Card com borda suave e gradiente interno verde->preto */}
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[radial-gradient(900px_520px_at_0%_0%,rgba(16,185,129,0.35),transparent),linear-gradient(180deg,#0f1b18,#0b100e)] px-5 py-6">
            <div className="mb-4">
              <span className="text-2xl font-semibold tracking-tight text-white">pro<span className="text-emerald-400">Store</span></span>
            </div>
            <h1 className="text-white text-[22px] font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-0.5 text-white/90 text-[15px]">{subtitle}</p>}

            <div className="mt-5">{children}</div>

            <p className="mt-5 text-xs text-white/85">
              Ao continuar, você concorda com a nossa{" "}
              <Link href="/termos-de-uso" className="underline decoration-white/30 hover:text-white">Política de Uso</Link>
              {" "}e{" "}
              <Link href="/politica-de-privacidade" className="underline decoration-white/30 hover:text-white">Privacidade</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
