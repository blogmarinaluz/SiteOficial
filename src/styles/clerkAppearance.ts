// src/styles/clerkAppearance.ts
import type { Appearance } from "@clerk/types";

// Aparência focada no contraste dentro de um card com gradiente de fundo
export const clerkAppearance: Appearance = {
  layout: {
    shimmer: false,
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
    logoPlacement: "none",
    helpPageUrl: "/central-de-ajuda",
    privacyPageUrl: "/politica-de-privacidade",
    termsPageUrl: "/termos-de-uso",
  },
  variables: {
    colorPrimary: "#10b981",
    colorText: "#e5e7eb",
    colorBackground: "transparent",
    borderRadius: "12px",
    fontSize: "16px",
  },
  elements: {
    // Deixa o cartão interno do Clerk transparente para usar o gradiente do shell
    card: "bg-transparent border-0 shadow-none p-0",
    header: "hidden",
    form: "space-y-3",
    formField: "space-y-1.5",
    // Label branco para aparecer sobre o gradiente escuro
    formFieldLabel: "text-sm font-medium text-white",
    // Input branco, texto escuro, compacto
    formFieldInput: "h-11 rounded-lg bg-white border border-white/10 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
    // Botão sólido e elegante (sem gradiente), sombra leve
    formButtonPrimary: "h-11 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.99]",
    button: "rounded-lg h-11",
    dividerRow: "my-2",
    dividerLine: "bg-white/15",
    dividerText: "text-xs text-white/80",
    identityPreview: "rounded-lg bg-white/10",
    avatarBox: "ring-2 ring-white/20",
    socialButtonsBlockButton: "h-11 rounded-lg bg-white text-gray-900 hover:bg-white/90",
    alternativeMethodsBlockButton: "h-11 rounded-lg",
    formFieldError: "text-red-300 text-sm",
    footer: "hidden",
  },
};
