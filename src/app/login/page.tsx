"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-2xl font-bold text-white">
            C
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Claire Assurance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Espace de gestion des contrats
          </p>
        </div>

        <button
          onClick={() => signIn("keycloak", { callbackUrl })}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-medium text-white transition hover:bg-brand-700"
        >
          Se connecter avec Keycloak
        </button>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
          <p className="mb-1 font-medium text-gray-600">Comptes de démo :</p>
          <ul className="space-y-0.5">
            <li>admin.claire / admin</li>
            <li>gestionnaire.claire / gestion</li>
            <li>agent.claire / agent</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
