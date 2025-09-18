// src/styles/clerkAppearance.ts
import type { Appearance } from "@clerk/types";

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
    borderRadius: "14px",
    fontSize: "16px",
  },
  elements: {
    card: "bg-transparent border-0 shadow-none p-0",
    header: "hidden",
    form: "space-y-3",
    formField: "space-y-1.5",
    // LABEL: branco puro e sem translucidez
    formFieldLabel: "text-[13px] font-medium text-white",
    // INPUT: branco, borda suave, texto escuro, placeholder legível
    formFieldInput: "h-12 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 border border-white/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500",
    // BOTÃO: elegante, pill, sólido, sombra leve e ring inset
    formButtonPrimary: "h-12 rounded-full font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md ring-1 ring-inset ring-white/10 transition active:scale-[0.99]",
    button: "rounded-full h-11",
    dividerRow: "my-2",
    dividerLine: "bg-white/20",
    dividerText: "text-xs text-white/85",
    identityPreview: "rounded-xl bg-white/10",
    avatarBox: "ring-2 ring-white/20",
    socialButtonsBlockButton: "h-11 rounded-full bg-white text-gray-900 hover:bg-white/90",
    alternativeMethodsBlockButton: "h-11 rounded-full",
    formFieldError: "text-red-300 text-sm",
    footer: "hidden",
  },
};
