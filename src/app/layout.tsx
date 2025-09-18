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

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/entrar";
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/cadastrar";
const afterSignInUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/minha-conta";
const afterSignUpUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/minha-conta";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
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
