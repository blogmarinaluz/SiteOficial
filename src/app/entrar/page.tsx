// src/app/entrar/page.tsx
import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  return (
    <main className="container-safe py-10 min-h-[70vh]">
      <div className="mx-auto max-w-md">
        {/* O componente do Clerk já traz um cartão próprio.
            Mantemos a paleta preto/branco/verde com o colorPrimary.
            Não forçamos fundos pretos para não inverter áreas que devem ser brancas. */}
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#10b981",        // verde
              colorText: "#0a0a0a",           // texto preto dentro do cartão
              colorBackground: "#ffffff",     // cartão branco (não escurecer)
              colorInputBackground: "#ffffff",
              colorInputText: "#0a0a0a",
            },
            elements: {
              card: "rounded-2xl border border-white/10 shadow-xl",
              formButtonPrimary: "btn btn-primary rounded-2xl",
              formFieldInput: "input !bg-white !text-black !border-black/10",
              footerAction: "text-sm",
            },
          }}
          afterSignInUrl="/minha-conta"
          redirectUrl="/minha-conta"
        />
      </div>
    </main>
  );
}
