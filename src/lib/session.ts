import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, type AppRole } from "@/lib/auth";

/** Récupère la session côté serveur. */
export async function getSession() {
  return getServerSession(authOptions);
}

/** Exige une session, sinon redirige vers /login. */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/** Vrai si l'utilisateur possède au moins un des rôles demandés. */
export function hasRole(roles: AppRole[] | undefined, ...allowed: AppRole[]): boolean {
  if (!roles) return false;
  return roles.some((r) => allowed.includes(r));
}

/** Exige un des rôles donnés, sinon redirige (login ou page interdite). */
export async function requireRole(...allowed: AppRole[]) {
  const session = await requireSession();
  if (!hasRole(session.user.roles, ...allowed)) {
    redirect("/forbidden");
  }
  return session;
}

/** Droit d'écriture : admin et gestionnaire. L'agent est en lecture seule. */
export function canWrite(roles: AppRole[] | undefined): boolean {
  return hasRole(roles, "admin", "gestionnaire");
}
