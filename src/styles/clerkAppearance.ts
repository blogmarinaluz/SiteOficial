// src/styles/clerkAppearance.ts
import type { Appearance } from "@clerk/types";

// Aparência enxuta + classes Tailwind para visual profissional
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
    borderRadius: "14px",
    fontSize: "16px",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-black/35 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-5 sm:p-6 max-w-[400px]",
    header: "hidden",
    form: "space-y-4",
    formField: "space-y-2",
    formFieldLabel: "text-sm text-gray-300",
    formFieldInput: "bg-[#111416] border border-white/10 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-11 rounded-xl",
    footer: "hidden",
    formButtonPrimary: "h-12 rounded-xl font-medium transition active:scale-[0.99] bg-emerald-600 hover:bg-emerald-500 text-white",
    button: "rounded-xl",
    dividerRow: "my-3",
    dividerLine: "bg-white/10",
    dividerText: "text-xs text-gray-400",
    identityPreview: "rounded-xl bg-white/5",
    avatarBox: "ring-2 ring-white/10",
    socialButtonsBlockButton: "h-11 rounded-xl bg-white text-gray-900 hover:bg-white/90",
    alternativeMethodsBlockButton: "h-11 rounded-xl",
    formFieldError: "text-red-400 text-sm",
  },
};
