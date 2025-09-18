// src/components/auth/AuthShell.tsx
"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AuthShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="w-full bg-white text-gray-900 flex justify-center">
      {/* Wrapper compacto para reduzir o espaço até o rodapé */}
      <div className="w-full max-w-[440px] px-4 pt-6 pb-8">
        {/* Card com borda suave e raio; conteúdo interno tem gradiente */}
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[radial-gradient(800px_500px_at_-10%_-10%,rgba(16,185,129,0.35),transparent),linear-gradient(180deg,#0e1917,#0a0f0d)] px-5 py-6">
            <div className="mb-4">
              <span className="text-2xl font-semibold tracking-tight text-white">pro<span className="text-emerald-400">Store</span></span>
            </div>
            <h1 className="text-white text-[22px] font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-0.5 text-white/85 text-[15px]">{subtitle}</p>}

            {/* Clerk form entra aqui com card transparente */}
            <div className="mt-5">{children}</div>

            <p className="mt-5 text-xs text-white/80">
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
