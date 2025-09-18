// src/components/auth/AuthShell.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";


export default function AuthShell({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
return (
<div className="min-h-dvh w-full bg-[radial-gradient(1200px_800px_at_-10%_-10%,rgba(16,185,129,0.35),transparent),radial-gradient(800px_600px_at_110%_10%,rgba(16,185,129,0.15),transparent)] bg-[#0a0f0d] text-gray-100 flex items-center justify-center p-4">
<div className="w-full max-w-[420px]">
<div className="mb-6 flex items-center gap-3">
<div className="relative h-8 w-8 overflow-hidden rounded-xl ring-1 ring-white/20">
<Image src="/logo.png" alt="proStore" fill className="object-cover" />
</div>
<span className="text-xl font-semibold">pro<span className="text-emerald-400">Store</span></span>
</div>


<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
{subtitle && <p className="mt-1 text-gray-300">{subtitle}</p>}


<div className="mt-6">{children}</div>


<p className="mt-6 text-xs text-gray-400">
Ao continuar, você concorda com a nossa {" "}
<Link href="/termos-de-uso" className="underline decoration-white/20 hover:text-gray-200">Política de Uso</Link>
{" "}e {" "}
<Link href="/politica-de-privacidade" className="underline decoration-white/20 hover:text-gray-200">Privacidade</Link>.
</p>
</div>
</div>
);
}
