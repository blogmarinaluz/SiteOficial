// src/app/cadastrar/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export const metadata = {
  title: "Criar conta — proStore",
};

export default function CadastrarPage() {
  return (
    <main className="container-safe py-10 min-h-[70vh]">
      <div className="mx-auto max-w-md">
        {/* Cabeçalho customizado com logo */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2">
            <Image
              src="/logo-prostore.svg" // troque para .png se preferir
              alt="proStore"
              width={28}
              height={28}
              className="h-7 w-7"
              priority
            />
            <span className="font-semibold text-emerald-400">proStore</span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Crie sua conta
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Cadastre-se para acompanhar pedidos e receber ofertas.
          </p>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#10b981", // emerald-500
            },
            elements: {
              // Esconde título/subtítulo internos do Clerk
              headerTitle: "sr-only",
              headerSubtitle: "sr-only",

              // Cartão + campos + botões
              card: "rounded-2xl border border-white/10 shadow-xl",
              formFieldInput:
                "input !bg-white !text-black !border-black/10 focus:!ring-emerald-500",
              formButtonPrimary: "btn btn-primary rounded-2xl",
              socialButtonsBlockButton:
                "btn rounded-xl !bg-white !text-black hover:!bg-zinc-100",
              footerAction: "text-sm",
              dividerRow: "my-4",
              formHeader: "hidden",
            },
          }}
          fallbackRedirectUrl="/minha-conta"
          forceRedirectUrl="/minha-conta"
        />
      </div>
    </main>
  );
}
