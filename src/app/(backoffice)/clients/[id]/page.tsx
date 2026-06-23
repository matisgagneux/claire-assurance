import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState } from "@/components/ui";
import { StatutContratBadge } from "@/components/Badge";
import {
  formatEuro,
  formatDate,
  TYPE_CONTRAT_LABEL,
} from "@/lib/format";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contrats: {
        orderBy: { dateDebut: "desc" },
        include: { _count: { select: { sinistres: true } } },
      },
    },
  });

  if (!client) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/clients"
          className="text-sm text-brand-600 hover:underline"
        >
          ← Retour aux clients
        </Link>
      </div>

      <PageHeader
        title={`${client.civilite ?? ""} ${client.prenom} ${client.nom}`.trim()}
        subtitle={client.reference}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h2 className="mb-4 font-medium text-gray-900">Coordonnées</h2>
          <div className="space-y-3">
            <Field label="Email" value={client.email} />
            <Field label="Téléphone" value={client.telephone ?? "—"} />
            <Field
              label="Adresse"
              value={
                client.adresse
                  ? `${client.adresse}, ${client.codePostal} ${client.ville}`
                  : "—"
              }
            />
            <Field
              label="Date de naissance"
              value={formatDate(client.dateNaissance)}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="font-medium text-gray-900">
              Contrats ({client.contrats.length})
            </h2>
          </div>
          {client.contrats.length === 0 ? (
            <EmptyState message="Aucun contrat pour ce client" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3 font-medium">Référence</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 text-right font-medium">Prime/an</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {client.contrats.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/contrats/${c.id}`}
                        className="font-mono text-xs text-brand-600 hover:underline"
                      >
                        {c.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {TYPE_CONTRAT_LABEL[c.type]}
                    </td>
                    <td className="px-5 py-3">
                      <StatutContratBadge statut={c.statut} />
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
    </div>
  );
}
