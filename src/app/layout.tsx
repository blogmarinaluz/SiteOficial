// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "proStore — Apple & Samsung",
  description: "Catálogo Apple e Samsung com 30% OFF. Boleto para negativados.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Header usa useSearchParams -> precisa de Suspense no app router */}
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>

        {/* Algumas páginas/slots podem usar hooks de navigation também */}
        <Suspense fallback={<main className="container py-8" />}>
          <main className="container py-8">{children}</main>
        </Suspense>

        <Footer />
      </body>
    </html>
  );
}
