// src/components/auth/AuthShell.tsx
"use client";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AuthShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="min-h-dvh w-full bg-[#0a0f0d] bg-[radial-gradient(900px_600px_at_0%_0%,rgba(16,185,129,0.18),transparent),radial-gradient(800px_520px_at_100%_0%,rgba(16,185,129,0.10),transparent)] text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-5">
          <span className="text-2xl font-semibold tracking-tight">pro<span className="text-emerald-400">Store</span></span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-gray-300">{subtitle}</p>}

        <div className="mt-5">{children}</div>

        <p className="mt-5 text-xs text-gray-400">
          Ao continuar, você concorda com a nossa{" "}
          <Link href="/termos-de-uso" className="underline decoration-white/20 hover:text-gray-200">Política de Uso</Link>
          {" "}e{" "}
          <Link href="/politica-de-privacidade" className="underline decoration-white/20 hover:text-gray-200">Privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
