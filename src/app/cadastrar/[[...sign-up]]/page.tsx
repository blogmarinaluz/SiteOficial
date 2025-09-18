// src/app/cadastrar/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/styles/clerkAppearance";
import Link from "next/link";

export default function Page() {
  return (
    <AuthShell title="Crie sua conta" subtitle="Compra rápida, segura e com garantia">
      <SignUp appearance={clerkAppearance} signInUrl="/entrar" />
      <p className="mt-4 text-sm text-gray-600">
        Já tem uma conta?{" "}
        <Link href="/entrar" className="font-medium text-emerald-700 hover:text-emerald-600 underline">
          Entrar
        </Link>
      </p>
      <p className="mt-4 text-xs text-gray-500">
        Ao continuar, você concorda com a nossa{" "}
        <Link href="/termos-de-uso" className="underline decoration-gray-300 hover:text-gray-700">Política de Uso</Link>
        {" "}e{" "}
        <Link href="/politica-de-privacidade" className="underline decoration-gray-300 hover:text-gray-700">Privacidade</Link>.
      </p>
    </AuthShell>
  );
}
