// src/components/auth/AuthShell.tsx
"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";

// Shell limpo: tudo branco, sem caixas, com margens compactas
export default function AuthShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="w-full bg-white text-gray-900 flex justify-center">
      <div className="w-full max-w-[460px] px-4 pt-6 pb-8">
        <div className="mb-4">
          <span className="text-2xl font-semibold tracking-tight">pro<span className="text-emerald-600">Store</span></span>
        </div>

        <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-gray-600 text-[15px]">{subtitle}</p>}

        <div className="mt-4">{children}</div>

        <p className="mt-4 text-xs text-gray-500">
          Ao continuar, você concorda com a nossa{" "}
          <Link href="/termos-de-uso" className="underline decoration-gray-300 hover:text-gray-700">Política de Uso</Link>
          {" "}e{" "}
          <Link href="/politica-de-privacidade" className="underline decoration-gray-300 hover:text-gray-700">Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
