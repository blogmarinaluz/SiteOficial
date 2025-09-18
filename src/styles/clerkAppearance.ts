// src/styles/clerkAppearance.ts
import type { Appearance } from "@clerk/types";


export const clerkAppearance: Appearance = {
layout: {
shimmer: true,
socialButtonsPlacement: "top",
socialButtonsVariant: "blockButton",
logoPlacement: "inside",
helpPageUrl: "/central-de-ajuda",
privacyPageUrl: "/politica-de-privacidade",
termsPageUrl: "/termos-de-uso",
},
variables: {
colorPrimary: "#10b981", // verde proStore
colorText: "#e5e7eb",
colorTextOnPrimaryBackground: "#0b1412",
colorBackground: "#0b1412",
colorInputBackground: "#111827",
colorInputText: "#e5e7eb",
colorAlphaShade: "#0b1412",
borderRadius: "16px",
fontSize: "16px",
},
elements: {
rootBox: "w-full",
card: "backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 max-w-[420px]",
header: "hidden", // usamos nosso cabeçalho custom via AuthShell
form: "space-y-4",
formField: "space-y-2",
formFieldLabel: "text-sm text-gray-300",
formFieldInput: "bg-gray-900/60 border border-white/10 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
footer: "hidden md:hidden", // ocultar selo; se plano não permitir, comentar esta linha
formButtonPrimary: "h-12 rounded-xl font-medium transition active:scale-[0.99] bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-600 text-white",
button: "rounded-xl",
dividerRow: "my-4",
dividerLine: "bg-white/10",
dividerText: "text-xs text-gray-400",
identityPreview: "rounded-xl bg-white/5",
avatarBox: "ring-2 ring-white/10",
socialButtonsBlockButton: "h-11 rounded-xl bg-white/90 text-gray-900 hover:bg-white",
alternativeMethodsBlockButton: "h-11 rounded-xl",
formFieldError: "text-red-400 text-sm",
},
};
