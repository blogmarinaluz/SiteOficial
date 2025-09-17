// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "proStore — Apple & Samsung",
    template: "%s — proStore",
  },
  description: "Catálogo Apple e Samsung com 30% OFF. Boleto para negativados.",
  applicationName: "proStore",
  metadataBase: new URL("https://prostore.example"), // ajuste se tiver domínio
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-zinc-900">
        {/* Header sticky com suspense para evitar layout shift */}
        <Suspense fallback={<div className="h-16" />}>
          <Header />
        </Suspense>

        {/* Conteúdo principal: espaço extra no bottom para não ficar sob a dock mobile */}
        <Suspense fallback={<main className="container py-8" />}>
          <main className="container py-8 pb-24 lg:pb-8">{children}</main>
        </Suspense>

        <Footer />

        {/* Barra fixa inferior — mobile only */}
        <MobileDock />
      </body>
    </html>
  );
}
