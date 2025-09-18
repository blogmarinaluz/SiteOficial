// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/hooks/useCart";

export const metadata: Metadata = {
  title: "proStore — Apple & Samsung",
  description: "Loja mobile-first de Apple & Samsung",
};

// URLs de auth (podem ser sobrescritas via env se quiser)
const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/entrar";
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/cadastrar";
const afterSignInUrl =
  process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/minha-conta";
const afterSignUpUrl =
  process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/minha-conta";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      // IMPORTANTE: PT-BR será aplicado via painel da Clerk, sem pacote extra.
      // No painel: Customize → Localization → Português (Brasil) → Save.
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
      appearance={{
        variables: {
          colorPrimary: "#10b981", // emerald-500
          colorText: "#0a0a0a",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system",
          borderRadius: "1rem", // 16px = rounded-2xl
        },
        elements: {
          footerActionLink:
            "text-emerald-600 hover:text-emerald-500 transition-colors",
          formFieldLabel: "text-zinc-700",
          formFieldInput:
            "input !bg-white !text-black !border-black/10 focus:!ring-emerald-500",
          button:
            "rounded-2xl border border-black/10 hover:bg-zinc-50 transition",
          alert: "rounded-2xl",
        },
      }}
    >
      <html lang="pt-BR">
        <body className="min-h-screen bg-zinc-50 text-zinc-900">
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
