// src/app/(auth)/entrar/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import AuthShell from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/styles/clerkAppearance";

export default function Page() {
  return (
    <AuthShell title="Entre na sua conta" subtitle="Acesse seus pedidos e preferências">
      <SignIn appearance={clerkAppearance} localization={ptBR} signUpUrl="/cadastrar" />
    </AuthShell>
  );
}
