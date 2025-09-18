// src/styles/clerkAppearance.ts
import type { Appearance } from "@clerk/types";

// Tema branco, sem cartões/gradientes. Foco em legibilidade mobile.
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
    colorText: "#111827",
    colorBackground: "transparent",
    borderRadius: "12px",
    fontSize: "16px",
  },
  elements: {
    // Sem card visual do Clerk
    card: "bg-transparent border-0 shadow-none p-0",
    header: "hidden",
    form: "space-y-3",
    formField: "space-y-1.5",
    // LABELS PRETOS
    formFieldLabel: "text-[13px] font-medium text-black",
    // INPUT branco com texto escuro e borda cinza
    formFieldInput: "h-12 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600",
    // BOTÃO sólido, sem gradiente, compacto
    formButtonPrimary: "h-12 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.99]",
    button: "rounded-lg h-11",
    // Social button discreto (fundo branco, borda cinza)
    socialButtonsBlockButton: "h-11 rounded-lg bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
    alternativeMethodsBlockButton: "h-11 rounded-lg",
    dividerRow: "my-2",
    dividerLine: "bg-gray-200",
    dividerText: "text-xs text-gray-500",
    formFieldError: "text-red-600 text-sm",
    footer: "hidden",
  },
};
