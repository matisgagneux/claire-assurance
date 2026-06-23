import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { nom: "asc" },
    include: {
      _count: { select: { contrats: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} client(s) enregistré(s)`}
      />

      <Card>
        {clients.length === 0 ? (
          <EmptyState message="Aucun client" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Ville</th>
                <th className="px-5 py-3 text-right font-medium">Contrats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/clients/${c.id}`}
                      className="font-mono text-xs text-brand-600 hover:underline"
                    >
                      {c.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/clients/${c.id}`}
                      className="font-medium text-gray-900 hover:text-brand-700"
                    >
                      {c.civilite} {c.prenom} {c.nom}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{c.email}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {c.ville ? `${c.ville} (${c.codePostal})` : "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-700">
                    {c._count.contrats}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
