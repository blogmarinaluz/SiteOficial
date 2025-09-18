// src/components/auth/AuthShell.tsx
"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";

// Shell enxuto com menos espaço vertical
export default function AuthShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="min-h-dvh w-full bg-[#0a0f0d] text-gray-100 flex items-start justify-center">
      <div className="w-full max-w-[400px] px-4 pt-4 pb-8">
        <div className="mb-4">
          <span className="text-xl font-semibold tracking-tight">pro<span className="text-emerald-400">Store</span></span>
        </div>

        <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-gray-300 text-[15px]">{subtitle}</p>}

        <div className="mt-4">{children}</div>

        <p className="mt-4 text-xs text-gray-400">
          Ao continuar, você concorda com a nossa{" "}
          <Link href="/termos-de-uso" className="underline decoration-white/20 hover:text-gray-200">Política de Uso</Link>
          {" "}e{" "}
          <Link href="/politica-de-privacidade" className="underline decoration-white/20 hover:text-gray-200">Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
