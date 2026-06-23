export { default } from "next-auth/middleware";

// Protège toutes les routes du backoffice. Les pages publiques (login, api auth,
// assets) sont exclues via le matcher ci-dessous.
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - /login (page de connexion)
     * - /forbidden (page accès refusé)
     * - /api/auth/* (endpoints NextAuth)
     * - les fichiers statiques Next.js
     */
    "/((?!login|forbidden|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
