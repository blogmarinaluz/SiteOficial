// middleware.ts (raiz do projeto)
// Protege rotas autenticadas com Clerk.
// Requer @clerk/nextjs instalado e variáveis do Clerk setadas no ambiente.
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
  // Liste aqui as rotas que exigem login
  const isProtectedRoute = createRouteMatcher([
    "/minha-conta(.*)",
    "/checkout(.*)",
  ]);

  if (isProtectedRoute(req)) {
    // Redireciona automaticamente para /entrar se não autenticado
    auth().protect();
  }
});

// Evita processar arquivos estáticos e rotas do Next interno
export const config = {
  matcher: [
    // processa tudo, exceto assets estáticos e arquivos públicos
    "/((?!_next|.*\..*|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
