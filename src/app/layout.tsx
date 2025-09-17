// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/hooks/useCart"; // ADD

export const metadata: Metadata = {
  title: "proStore — Apple & Samsung",
  description: "Loja mobile-first de Apple & Samsung",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
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
