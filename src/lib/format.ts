/** Type minimal couvrant les Decimal Prisma (et tout objet sérialisable en nombre). */
type Numeric = number | string | { toString(): string } | null | undefined;

/** Formatage monétaire en euros. */
export function formatEuro(value: Numeric): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "number" ? value : Number(value.toString());
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

/** Formatage de date court (JJ/MM/AAAA). */
export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Libellés lisibles des types de contrat. */
export const TYPE_CONTRAT_LABEL: Record<string, string> = {
  AUTO: "Auto",
  HABITATION: "Habitation",
  SANTE: "Santé",
  VIE: "Vie",
  RESPONSABILITE_CIVILE: "Responsabilité civile",
};

/** Libellés lisibles des moyens de paiement. */
export const MOYEN_PAIEMENT_LABEL: Record<string, string> = {
  PRELEVEMENT: "Prélèvement",
  CARTE: "Carte",
  VIREMENT: "Virement",
  CHEQUE: "Chèque",
};
