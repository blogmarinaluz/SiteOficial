// src/app/entrar/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/styles/clerkAppearance";
import Link from "next/link";

export default function Page() {
  return (
    <AuthShell title="Entre na sua conta" subtitle="Acesse seus pedidos e preferências">
      <SignIn appearance={clerkAppearance} signUpUrl="/cadastrar" />
      <p className="mt-4 text-sm text-gray-600">
        Não tem uma conta?{" "}
        <Link href="/cadastrar" className="font-medium text-emerald-700 hover:text-emerald-600 underline">
          Cadastre-se
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
