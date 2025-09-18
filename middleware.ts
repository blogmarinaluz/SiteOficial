// middleware.ts (raiz do projeto)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
  const isProtectedRoute = createRouteMatcher([
    "/minha-conta(.*)",
    "/checkout(.*)",
  ]);
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    "/((?!_next|.*\..*|favicon.ico|robots.txt|sitemap.xml|api/webhooks|api/cron).*)",
  ],
};
