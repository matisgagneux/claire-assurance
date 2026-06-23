-- CreateEnum
CREATE TYPE "TypeContrat" AS ENUM ('AUTO', 'HABITATION', 'SANTE', 'VIE', 'RESPONSABILITE_CIVILE');

-- CreateEnum
CREATE TYPE "StatutContrat" AS ENUM ('ACTIF', 'EN_ATTENTE', 'SUSPENDU', 'RESILIE');

-- CreateEnum
CREATE TYPE "StatutSinistre" AS ENUM ('OUVERT', 'EN_COURS', 'EN_EXPERTISE', 'CLOS', 'REFUSE');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('PAYE', 'EN_ATTENTE', 'EN_RETARD', 'ANNULE');

-- CreateEnum
CREATE TYPE "MoyenPaiement" AS ENUM ('PRELEVEMENT', 'CARTE', 'VIREMENT', 'CHEQUE');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "civilite" TEXT,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT,
    "codePostal" TEXT,
    "ville" TEXT,
    "dateNaissance" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrat" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "TypeContrat" NOT NULL,
    "statut" "StatutContrat" NOT NULL DEFAULT 'ACTIF',
    "libelle" TEXT NOT NULL,
    "primeAnnuelle" DECIMAL(10,2) NOT NULL,
    "franchise" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Contrat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sinistre" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "statut" "StatutSinistre" NOT NULL DEFAULT 'OUVERT',
    "description" TEXT NOT NULL,
    "dateDeclaration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateIncident" TIMESTAMP(3) NOT NULL,
    "montantEstime" DECIMAL(10,2),
    "montantIndemnise" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contratId" TEXT NOT NULL,

    CONSTRAINT "Sinistre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "moyen" "MoyenPaiement" NOT NULL DEFAULT 'PRELEVEMENT',
    "dateEcheance" TIMESTAMP(3) NOT NULL,
    "datePaiement" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contratId" TEXT NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_reference_key" ON "Client"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_nom_idx" ON "Client"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Contrat_reference_key" ON "Contrat"("reference");

-- CreateIndex
CREATE INDEX "Contrat_clientId_idx" ON "Contrat"("clientId");

-- CreateIndex
CREATE INDEX "Contrat_statut_idx" ON "Contrat"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "Sinistre_reference_key" ON "Sinistre"("reference");

-- CreateIndex
CREATE INDEX "Sinistre_contratId_idx" ON "Sinistre"("contratId");

-- CreateIndex
CREATE INDEX "Sinistre_statut_idx" ON "Sinistre"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_reference_key" ON "Paiement"("reference");

-- CreateIndex
CREATE INDEX "Paiement_contratId_idx" ON "Paiement"("contratId");

-- CreateIndex
CREATE INDEX "Paiement_statut_idx" ON "Paiement"("statut");

-- AddForeignKey
ALTER TABLE "Contrat" ADD CONSTRAINT "Contrat_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sinistre" ADD CONSTRAINT "Sinistre_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "Contrat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "Contrat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
