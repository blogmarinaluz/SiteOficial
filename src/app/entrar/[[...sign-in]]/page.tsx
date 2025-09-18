// src/app/entrar/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  return (
    <main className="container-safe py-10 min-h-[70vh]">
      <div className="mx-auto max-w-md">
        <SignIn
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
