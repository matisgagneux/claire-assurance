"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrateur",
  gestionnaire: "Gestionnaire",
  agent: "Agent",
};

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const initiales = (user?.name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const roleLabel =
    user?.roles?.map((r) => ROLE_LABEL[r] ?? r).join(", ") || "Sans rôle";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {initiales}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-tight text-gray-900">
            {user?.name ?? "Utilisateur"}
          </p>
          <p className="text-xs leading-tight text-gray-400">{roleLabel}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
