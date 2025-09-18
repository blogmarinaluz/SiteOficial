// src/app/cadastrar/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Cadastrar",
};

export default function CadastrarPage() {
  return (
    <main className="container-safe py-10 min-h-[70vh]">
      <div className="mx-auto max-w-md">
        <SignUp
          appearance={{
            elements: {
              card: "rounded-2xl border border-white/10 shadow-xl",
              formButtonPrimary: "btn btn-primary rounded-2xl",
              formFieldInput: "input !bg-white !text-black !border-black/10",
              footerAction: "text-sm",
            },
          }}
          fallbackRedirectUrl="/minha-conta"
          forceRedirectUrl="/minha-conta"
        />
      </div>
    </main>
  );
}
