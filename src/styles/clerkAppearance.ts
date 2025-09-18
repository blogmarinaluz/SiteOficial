// src/styles/clerkAppearance.ts
import type { Appearance } from "@clerk/types";

// Estilo compacto e profissional
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
    colorBackground: "#0a0a0a",
    borderRadius: "12px",
    fontSize: "16px",
  },
  elements: {
    rootBox: "w-full",
    // Card mais compacto
    card: "bg-[#0b0f0e]/70 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl p-4 max-w-[380px]",
    header: "hidden",
    // Menos espaço entre campos
    form: "space-y-3",
    formField: "space-y-1.5",
    // Label BRANCO
    formFieldLabel: "text-sm font-medium text-white",
    // Input compacto, fundo escuro e texto/placeholder brancos
    formFieldInput: "h-11 rounded-lg bg-[#111416] border border-white/15 text-white placeholder:text-white/70 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
    // Botão sólido (sem gradiente), altura menor e fonte semibold
    formButtonPrimary: "h-11 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow active:scale-[0.99]",
    button: "rounded-lg h-11",
    // Divisor mais curto
    dividerRow: "my-2",
    dividerLine: "bg-white/10",
    dividerText: "text-xs text-gray-400",
    identityPreview: "rounded-lg bg-white/5",
    avatarBox: "ring-2 ring-white/10",
    socialButtonsBlockButton: "h-11 rounded-lg bg-white text-gray-900 hover:bg-white/90",
    alternativeMethodsBlockButton: "h-11 rounded-lg",
    formFieldError: "text-red-400 text-sm",
    // Remover rodapé do Clerk se possível
    footer: "hidden",
  },
};
