// src/app/entrar/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

// Centraliza e adiciona respiro do topo e laterais (sem alterar o estilo do Clerk)
export default function Page() {
  return (
    <div className="min-h-dvh w-full flex justify-center pt-8 sm:pt-12 px-4">
      <SignIn />
    </div>
  );
}
