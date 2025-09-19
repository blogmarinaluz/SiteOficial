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

,
async headers() {
  return [
    {
      // Garante que arquivos .jfif sejam entregues como JPEG em qualquer pasta pública
      source: "/:path*.jfif",
      headers: [{ key: "Content-Type", value: "image/jpeg" }],
    },
  ];
}
};
