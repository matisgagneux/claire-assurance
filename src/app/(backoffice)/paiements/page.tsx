import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { StatutPaiementBadge } from "@/components/Badge";
import { formatEuro, formatDate, MOYEN_PAIEMENT_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PaiementsPage() {
  const paiements = await prisma.paiement.findMany({
    orderBy: { dateEcheance: "desc" },
    include: { contrat: { include: { client: true } } },
  });

  const totalEnRetard = paiements
    .filter((p) => p.statut === "EN_RETARD")
    .reduce((acc, p) => acc + Number(p.montant), 0);

  return (
    <div>
      <PageHeader
        title="Paiements"
        subtitle={`${paiements.length} échéance(s) · ${formatEuro(
          totalEnRetard
        )} en retard`}
      />

      <Card>
        {paiements.length === 0 ? (
          <EmptyState message="Aucun paiement" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Échéance</th>
                <th className="px-5 py-3 font-medium">Moyen</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 text-right font-medium">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paiements.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">
                    {p.reference}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/contrats/${p.contratId}`}
                      className="text-gray-900 hover:text-brand-700"
                    >
                      {p.contrat.client.prenom} {p.contrat.client.nom}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {formatDate(p.dateEcheance)}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {MOYEN_PAIEMENT_LABEL[p.moyen]}
                  </td>
                  <td className="px-5 py-3">
                    <StatutPaiementBadge statut={p.statut} />
                  </td>
                  <td className="px-5 py-3 text-right text-gray-900">
                    {formatEuro(p.montant)}
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
