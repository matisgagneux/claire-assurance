import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { StatutContratBadge } from "@/components/Badge";
import { formatEuro, formatDate, TYPE_CONTRAT_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ContratsPage() {
  const contrats = await prisma.contrat.findMany({
    orderBy: { dateDebut: "desc" },
    include: { client: true },
  });

  return (
    <div>
      <PageHeader
        title="Contrats"
        subtitle={`${contrats.length} contrat(s)`}
      />

      <Card>
        {contrats.length === 0 ? (
          <EmptyState message="Aucun contrat" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Début</th>
                <th className="px-5 py-3 text-right font-medium">Prime/an</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contrats.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/contrats/${c.id}`}
                      className="font-mono text-xs text-brand-600 hover:underline"
                    >
                      {c.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/clients/${c.clientId}`}
                      className="text-gray-900 hover:text-brand-700"
                    >
                      {c.client.prenom} {c.client.nom}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {TYPE_CONTRAT_LABEL[c.type]}
                  </td>
                  <td className="px-5 py-3">
                    <StatutContratBadge statut={c.statut} />
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {formatDate(c.dateDebut)}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-900">
                    {formatEuro(c.primeAnnuelle)}
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
