import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/ui";
import { StatutSinistreBadge } from "@/components/Badge";
import { formatEuro, formatDate, TYPE_CONTRAT_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}

export default async function SinistreDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const sinistre = await prisma.sinistre.findUnique({
    where: { id: params.id },
    include: { contrat: { include: { client: true } } },
  });

  if (!sinistre) notFound();

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/sinistres"
          className="text-sm text-brand-600 hover:underline"
        >
          ← Retour aux sinistres
        </Link>
      </div>

      <PageHeader
        title={sinistre.description}
        subtitle={sinistre.reference}
        action={<StatutSinistreBadge statut={sinistre.statut} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 font-medium text-gray-900">Informations</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Date de l'incident"
              value={formatDate(sinistre.dateIncident)}
            />
            <Field
              label="Date de déclaration"
              value={formatDate(sinistre.dateDeclaration)}
            />
            <Field
              label="Montant estimé"
              value={formatEuro(sinistre.montantEstime)}
            />
            <Field
              label="Montant indemnisé"
              value={formatEuro(sinistre.montantIndemnise)}
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-medium text-gray-900">Contrat concerné</h2>
          <div className="space-y-3">
            <Field
              label="Contrat"
              value={
                <Link
                  href={`/contrats/${sinistre.contratId}`}
                  className="text-brand-600 hover:underline"
                >
                  {sinistre.contrat.libelle} ({sinistre.contrat.reference})
                </Link>
              }
            />
            <Field
              label="Type"
              value={TYPE_CONTRAT_LABEL[sinistre.contrat.type]}
            />
            <Field
              label="Client"
              value={
                <Link
                  href={`/clients/${sinistre.contrat.clientId}`}
                  className="text-brand-600 hover:underline"
                >
                  {sinistre.contrat.client.prenom}{" "}
                  {sinistre.contrat.client.nom}
                </Link>
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
