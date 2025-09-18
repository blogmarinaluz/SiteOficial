// src/components/auth/AuthShell.tsx
"use client";
import { PropsWithChildren } from "react";

// Shell clean branco; sem caixas; tipografia preta; espaçamentos equilibrados.
export default function AuthShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="w-full bg-white text-gray-900 flex justify-center">
      <div className="w-full max-w-[480px] px-4 pt-24 pb-12 sm:pt-28">
        <div className="mb-5">
          <span className="text-2xl font-semibold tracking-tight">pro<span className="text-emerald-600">Store</span></span>
        </div>

        <h1 className="text-[24px] font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-gray-600 text-[15px]">{subtitle}</p>}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
