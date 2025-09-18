// src/styles/clerkAppearance.ts
import type { Appearance } from "@clerk/types";

// Tema definitivo: branco, tipografia preta, inputs e botões profissionais.
export const clerkAppearance: Appearance = {
  layout: {
    shimmer: false,
    socialButtonsPlacement: "top", // manter padrão, mas escondemos via elements
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
    // Nada de cartão do Clerk
    rootBox: "w-full",
    card: "bg-transparent border-0 shadow-none p-0",
    header: "hidden",
    // Grid compacto e consistente
    form: "space-y-4",
    formField: "space-y-1.5",
    // Label PRETA e legível
    formFieldLabel: "text-[14px] font-medium text-black",
    // Input branco, borda cinza, padding correto, texto escuro
    formFieldInput: "w-full h-12 rounded-md bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 px-3 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600",
    // Botão sólido, altura 48, cantos md (não corta), sem gradiente
    formButtonPrimary: "w-full h-12 rounded-md font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.99]",
    button: "rounded-md h-11",
    // Esconder botões sociais e divisor para não poluir a UI
    socialButtons: "hidden",
    socialButtonsBlockButton: "hidden",
    alternativeMethods: "hidden",
    dividerRow: "hidden",
    // Erros visíveis
    formFieldError: "text-red-600 text-sm",
    footer: "hidden",
  },
};
