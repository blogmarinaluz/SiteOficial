"use client";

import { SignUp } from "@clerk/nextjs";

export default function EntrarPage() {
  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-emerald-950 via-emerald-900 to-zinc-950">
      {/* Faixa de topo para dar respiro abaixo do header */}
      <div className="h-6 md:h-10" />

      <section className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Bloco de branding (lado esquerdo em desktop) */}
          <div className="text-white/95 hidden lg:block">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo-auth.svg"
                alt="proStore"
                className="h-9 w-auto drop-shadow-[0_6px_20px_rgba(16,185,129,0.5)]"
              />
              <span className="sr-only">proStore</span>
            </div>

            <h1 className="text-4xl/[1.1] font-semibold tracking-tight">
              Entre na sua conta
            </h1>
            <p className="mt-3 text-zinc-300/90 max-w-xl">
              Acesse seu histórico de pedidos, dados e preferências.
              Segurança de nível bancário em um clique.
            </p>

            {/* Selo de confiança */}
            <div className="mt-8 flex items-center gap-6 text-sm text-zinc-300/80">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-400" />
                <span>Conexão segura</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-400" />
                <span>Privacidade protegida</span>
              </div>
            </div>
          </div>

          {/* Card Clerk (lado direito) */}
          <div className="flex justify-center lg:justify-end">
            <SignUp
              appearance={{
                layout: {
                  logoImageUrl: "/logo-auth.svg",
                  logoPlacement: "inside",
                  socialButtonsPlacement: "bottom",
                  helpPageUrl: "/contato",
                  privacyPageUrl: "/privacidade",
                  termsPageUrl: "/termos",
                },
                variables: {
                  // Tokens visuais (coerentes com seu tema)
                  colorPrimary: "#10b981",
                  colorText: "#0b1220",
                  colorBackground: "#ffffff",
                  colorInputBackground: "#ffffff",
                  colorShimmer: "rgba(16,185,129,0.15)",
                  fontFamily:
                    "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
                  borderRadius: "16px",
                },
                elements: {
                  // container do card
                  card:
                    "shadow-2xl/50 shadow-black/30 border border-white/10 rounded-3xl backdrop-blur bg-white/95",
                  headerTitle:
                    "text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900",
                  headerSubtitle: "text-zinc-500 mt-1",
                  // inputs & labels
                  formFieldLabel: "text-zinc-700",
                  formFieldInput:
                    "h-12 rounded-xl border border-black/10 focus:!ring-2 focus:!ring-emerald-500 focus:!border-emerald-500",
                  // botão principal
                  formButtonPrimary:
                    "h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-base",
                  // botões sociais
                  socialButtonsBlockButton:
                    "rounded-xl border border-black/10 hover:bg-zinc-50",
                  // links do rodapé ("Esqueceu a senha?", "Criar conta")
                  footerActionLink:
                    "text-emerald-600 hover:text-emerald-500 transition-colors",
                  // avisos/erros
                  alert: "rounded-xl",
                  // “Secured by Clerk” — não dá pra remover no plano free; deixo discreto
                  footer:
                    "text-zinc-400/80",
                },
              }}
              // URLs já estão setadas no Provider pelo seu layout; deixar sem duplicar.
            />
          </div>
        </div>
      </section>

      <div className="h-14" />
    </main>
  );
}
