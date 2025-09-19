// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Força Content-Type correto para .jfif (melhora compatibilidade no mobile, especialmente iOS)
  async headers() {
    return [
      {
        source: "/:path*.jfif",
        headers: [{ key: "Content-Type", value: "image/jpeg" }],
      },
    ];
  },
};

export default nextConfig;
