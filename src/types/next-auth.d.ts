import NextAuth from "next-auth";
import type { AppRole } from "@/lib/auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles: AppRole[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
  }
}
