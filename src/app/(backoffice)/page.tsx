import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/ui";
import {
  StatutSinistreBadge,
  StatutPaiementBadge,
} from "@/components/Badge";
import { formatEuro, formatDate, TYPE_CONTRAT_LABEL } from "@/lib/format";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="p-5 transition hover:shadow-md">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </Card>
    </Link>
  );
}

export default async function DashboardPage() {
  const [
    nbClients,
    nbContrats,
    contratsActifs,
    sinistresOuverts,
    paiementsEnRetard,
    primeAgg,
    derniersSinistres,
    prochainesEcheances,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.contrat.count(),
    prisma.contrat.count({ where: { statut: "ACTIF" } }),
    prisma.sinistre.count({
      where: { statut: { in: ["OUVERT", "EN_COURS", "EN_EXPERTISE"] } },
    }),
    prisma.paiement.count({ where: { statut: "EN_RETARD" } }),
    prisma.contrat.aggregate({
      _sum: { primeAnnuelle: true },
      where: { statut: "ACTIF" },
    }),
    prisma.sinistre.findMany({
      take: 5,
      orderBy: { dateDeclaration: "desc" },
      include: { contrat: { include: { client: true } } },
    }),
    prisma.paiement.findMany({
      take: 5,
      where: { statut: { in: ["EN_ATTENTE", "EN_RETARD"] } },
      orderBy: { dateEcheance: "asc" },
      include: { contrat: { include: { client: true } } },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activité"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Clients"
          value={String(nbClients)}
          href="/clients"
        />
        <StatCard
          label="Contrats actifs"
          value={String(contratsActifs)}
          hint={`${nbContrats} contrats au total`}
          href="/contrats"
        />
        <StatCard
          label="Sinistres en cours"
          value={String(sinistresOuverts)}
          href="/sinistres"
        />
        <StatCard
          label="Paiements en retard"
          value={String(paiementsEnRetard)}
          href="/paiements"
        />
      </div>

      <div className="mt-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500">
            Volume de primes (contrats actifs)
          </p>
          <p className="mt-2 text-3xl font-semibold text-brand-700">
            {formatEuro(primeAgg._sum.primeAnnuelle ?? 0)}
            <span className="ml-1 text-base font-normal text-gray-400">
              / an
            </span>
          </p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="font-medium text-gray-900">Derniers sinistres</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {derniersSinistres.map((s) => (
              <li key={s.id} className="px-5 py-3">
                <Link
                  href={`/sinistres/${s.id}`}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {s.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.contrat.client.prenom} {s.contrat.client.nom} ·{" "}
                      {TYPE_CONTRAT_LABEL[s.contrat.type]} ·{" "}
                      {formatDate(s.dateDeclaration)}
                    </p>
                  </div>
                  <StatutSinistreBadge statut={s.statut} />
                </Link>
              </li>
            ))}
            {derniersSinistres.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-gray-400">
                Aucun sinistre
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="font-medium text-gray-900">
              Prochaines échéances à régler
            </h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {prochainesEcheances.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {p.contrat.client.prenom} {p.contrat.client.nom}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatEuro(p.montant)} · échéance{" "}
                    {formatDate(p.dateEcheance)}
                  </p>
                </div>
                <StatutPaiementBadge statut={p.statut} />
              </li>
            ))}
            {prochainesEcheances.length === 0 && (
              <li className="px-5 py-6 text-center text-sm text-gray-400">
                Aucune échéance en attente
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
