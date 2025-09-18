// src/app/entrar/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Entrar — proStore",
};

export default function EntrarPage() {
  return (
    <main className="container-safe py-12 min-h-[70vh]">
      {/* Cabeçalho compacto da página de login */}
      <div className="mx-auto mb-8 max-w-md text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          proStore
          <span className="h-1 w-1 rounded-full bg-emerald-500" />
          Área segura
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Entre na sua conta
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Acesse pedidos, favoritos e dados de suporte.
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <SignIn
          appearance={{
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
              logoPlacement: "inside",
            },
            elements: {
              // Cartão
              card:
                "rounded-2xl border border-white/10 shadow-xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/75",
              headerTitle: "sr-only", // oculto — usamos nosso título acima
              headerSubtitle: "sr-only",

              // Botão principal
              formButtonPrimary:
                "btn btn-primary rounded-2xl bg-emerald-600 hover:bg-emerald-500 border-0",

              // Campos de formulário
              formFieldInput:
                "input !bg-white !text-black !border-black/10 focus:!ring-emerald-500",
              formFieldLabel: "text-zinc-700",

              // Social (Google/Apple se estiver habilitado no Clerk)
              socialButtons:
                "grid grid-cols-2 gap-2 [&>button]:rounded-xl [&>button]:border-black/10",

              // Links “Esqueceu a senha? Cadastre-se”
              footerActionLink:
                "text-emerald-600 hover:text-emerald-500 transition-colors",

              // Outros detalhes
              alert: "rounded-2xl",
              formFieldHintText: "text-zinc-500",
            },
          }}
          // Redirecionamentos (mantive os que você já usava)
          fallbackRedirectUrl="/minha-conta"
          forceRedirectUrl="/minha-conta"
        />
      </div>
    </main>
  );
}
