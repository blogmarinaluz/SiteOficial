// src/app/cadastrar/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/styles/clerkAppearance";

export default function Page() {
  return (
    <AuthShell title="Crie sua conta" subtitle="Compra rápida, segura e com garantia">
      <SignUp appearance={clerkAppearance} localization={ptBR} signInUrl="/entrar" />
    </AuthShell>
  );
}
