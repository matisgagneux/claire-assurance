import type { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export type AppRole = "admin" | "gestionnaire" | "agent";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // À la connexion, on extrait les rôles du realm depuis le profil Keycloak
      if (account && profile) {
        const realmAccess = (profile as { realm_access?: { roles?: string[] } })
          .realm_access;
        token.roles = realmAccess?.roles ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const allRoles = (token.roles as string[]) ?? [];
        // On ne garde que les rôles applicatifs connus
        session.user.roles = allRoles.filter((r): r is AppRole =>
          ["admin", "gestionnaire", "agent"].includes(r)
        );
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
