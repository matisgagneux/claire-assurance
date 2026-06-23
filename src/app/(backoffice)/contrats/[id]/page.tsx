import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import {
  StatutContratBadge,
  StatutSinistreBadge,
  StatutPaiementBadge,
} from "@/components/Badge";
import {
  formatEuro,
  formatDate,
  TYPE_CONTRAT_LABEL,
  MOYEN_PAIEMENT_LABEL,
} from "@/lib/format";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}

export default async function ContratDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contrat = await prisma.contrat.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      sinistres: { orderBy: { dateDeclaration: "desc" } },
      paiements: { orderBy: { dateEcheance: "desc" } },
    },
  });

  if (!contrat) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/contrats"
          className="text-sm text-brand-600 hover:underline"
        >
          ← Retour aux contrats
        </Link>
      </div>

      <PageHeader
        title={contrat.libelle}
        subtitle={`${contrat.reference} · ${TYPE_CONTRAT_LABEL[contrat.type]}`}
        action={<StatutContratBadge statut={contrat.statut} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="mb-4 font-medium text-gray-900">Détails</h2>
          <div className="space-y-3">
            <Field
              label="Client"
              value={
                <Link
                  href={`/clients/${contrat.clientId}`}
                  className="text-brand-600 hover:underline"
                >
                  {contrat.client.prenom} {contrat.client.nom}
                </Link>
              }
            />
            <Field label="Type" value={TYPE_CONTRAT_LABEL[contrat.type]} />
            <Field
              label="Prime annuelle"
              value={formatEuro(contrat.primeAnnuelle)}
            />
            <Field label="Franchise" value={formatEuro(contrat.franchise)} />
            <Field label="Date de début" value={formatDate(contrat.dateDebut)} />
            <Field label="Date de fin" value={formatDate(contrat.dateFin)} />
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="font-medium text-gray-900">
                Sinistres ({contrat.sinistres.length})
              </h2>
            </div>
            {contrat.sinistres.length === 0 ? (
              <EmptyState message="Aucun sinistre déclaré" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                    <th className="px-5 py-3 font-medium">Référence</th>
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                    <th className="px-5 py-3 text-right font-medium">Estimé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contrat.sinistres.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <Link
                          href={`/sinistres/${s.id}`}
                          className="font-mono text-xs text-brand-600 hover:underline"
                        >
                          {s.reference}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {s.description}
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

          <Card>
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="font-medium text-gray-900">
                Paiements ({contrat.paiements.length})
              </h2>
            </div>
            {contrat.paiements.length === 0 ? (
              <EmptyState message="Aucun paiement" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                    <th className="px-5 py-3 font-medium">Référence</th>
                    <th className="px-5 py-3 font-medium">Échéance</th>
                    <th className="px-5 py-3 font-medium">Moyen</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                    <th className="px-5 py-3 text-right font-medium">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contrat.paiements.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">
                        {p.reference}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
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
      </div>
    </div>
  );
}
