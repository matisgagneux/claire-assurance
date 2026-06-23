import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
          🔒
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Accès refusé</h1>
        <p className="mt-2 text-sm text-gray-500">
          Votre rôle ne vous autorise pas à consulter cette page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
