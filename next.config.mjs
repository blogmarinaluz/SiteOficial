// next.config.mjs
/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    // Gera versões modernas das imagens quando possível (reduz KB sem perder qualidade)
    formats: ["image/avif", "image/webp"],

    // Mantém seu domínio remoto atual (caso você adicione outros, é só colocar aqui)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Pode manter o resto padrão — sem alterações em rotas ou imports
};
