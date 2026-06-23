import type { ReactNode } from "react";

type Tone = "green" | "blue" | "amber" | "red" | "gray" | "purple";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-600",
  purple: "bg-purple-100 text-purple-700",
};

export function Badge({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}

// ---- Mappings statut -> ton + libellé ----

const STATUT_CONTRAT: Record<string, { tone: Tone; label: string }> = {
  ACTIF: { tone: "green", label: "Actif" },
  EN_ATTENTE: { tone: "amber", label: "En attente" },
  SUSPENDU: { tone: "gray", label: "Suspendu" },
  RESILIE: { tone: "red", label: "Résilié" },
};

const STATUT_SINISTRE: Record<string, { tone: Tone; label: string }> = {
  OUVERT: { tone: "blue", label: "Ouvert" },
  EN_COURS: { tone: "amber", label: "En cours" },
  EN_EXPERTISE: { tone: "purple", label: "En expertise" },
  CLOS: { tone: "green", label: "Clos" },
  REFUSE: { tone: "red", label: "Refusé" },
};

const STATUT_PAIEMENT: Record<string, { tone: Tone; label: string }> = {
  PAYE: { tone: "green", label: "Payé" },
  EN_ATTENTE: { tone: "amber", label: "En attente" },
  EN_RETARD: { tone: "red", label: "En retard" },
  ANNULE: { tone: "gray", label: "Annulé" },
};

export function StatutContratBadge({ statut }: { statut: string }) {
  const c = STATUT_CONTRAT[statut] ?? { tone: "gray" as Tone, label: statut };
  return <Badge tone={c.tone}>{c.label}</Badge>;
}

export function StatutSinistreBadge({ statut }: { statut: string }) {
  const c = STATUT_SINISTRE[statut] ?? { tone: "gray" as Tone, label: statut };
  return <Badge tone={c.tone}>{c.label}</Badge>;
}

export function StatutPaiementBadge({ statut }: { statut: string }) {
  const c = STATUT_PAIEMENT[statut] ?? { tone: "gray" as Tone, label: statut };
  return <Badge tone={c.tone}>{c.label}</Badge>;
}
