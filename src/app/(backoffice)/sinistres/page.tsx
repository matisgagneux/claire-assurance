import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { StatutSinistreBadge } from "@/components/Badge";
import { formatEuro, formatDate, TYPE_CONTRAT_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SinistresPage() {
  const sinistres = await prisma.sinistre.findMany({
    orderBy: { dateDeclaration: "desc" },
    include: { contrat: { include: { client: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Sinistres"
        subtitle={`${sinistres.length} sinistre(s)`}
      />

      <Card>
        {sinistres.length === 0 ? (
          <EmptyState message="Aucun sinistre" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Déclaré le</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 text-right font-medium">Estimé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sinistres.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/sinistres/${s.id}`}
                      className="font-mono text-xs text-brand-600 hover:underline"
                    >
                      {s.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-900">{s.description}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {s.contrat.client.prenom} {s.contrat.client.nom}
                    <span className="ml-1 text-xs text-gray-400">
                      ({TYPE_CONTRAT_LABEL[s.contrat.type]})
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {formatDate(s.dateDeclaration)}
                  </td>
                  <td className="px-5 py-3">
                    <StatutSinistreBadge statut={s.statut} />
                  </td>
                  <td className="px-5 py-3 text-right text-gray-900">
                    {formatEuro(s.montantEstime)}
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
