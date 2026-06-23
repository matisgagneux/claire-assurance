import {
  PrismaClient,
  TypeContrat,
  StatutContrat,
  StatutSinistre,
  StatutPaiement,
  MoyenPaiement,
} from "@prisma/client";

const prisma = new PrismaClient();

// Petit générateur pseudo-aléatoire déterministe pour des seeds reproductibles
let seedState = 42;
function rand(): number {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function pad(n: number, len = 4): string {
  return String(n).padStart(len, "0");
}
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

const PRENOMS = [
  "Camille", "Lucas", "Emma", "Hugo", "Léa", "Nathan", "Chloé", "Louis",
  "Manon", "Théo", "Sarah", "Gabriel", "Inès", "Raphaël", "Jade", "Arthur",
  "Alice", "Paul", "Louise", "Adam",
];
const NOMS = [
  "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit",
  "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel",
  "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier",
];
const VILLES: { ville: string; cp: string }[] = [
  { ville: "Paris", cp: "75011" },
  { ville: "Lyon", cp: "69003" },
  { ville: "Marseille", cp: "13008" },
  { ville: "Toulouse", cp: "31000" },
  { ville: "Bordeaux", cp: "33000" },
  { ville: "Nantes", cp: "44000" },
  { ville: "Lille", cp: "59000" },
  { ville: "Strasbourg", cp: "67000" },
  { ville: "Rennes", cp: "35000" },
  { ville: "Nice", cp: "06000" },
];
const RUES = [
  "12 rue de la République", "5 avenue Victor Hugo", "28 boulevard Voltaire",
  "3 place de la Mairie", "47 rue des Lilas", "8 impasse des Roses",
  "15 avenue de la Gare", "92 rue Nationale",
];

const LIBELLES_CONTRAT: Record<TypeContrat, string[]> = {
  AUTO: ["Auto Tous Risques", "Auto Tiers Étendu", "Auto au Tiers"],
  HABITATION: ["Multirisque Habitation", "Habitation Confort", "Habitation Essentiel"],
  SANTE: ["Santé Famille", "Santé Solo", "Santé Senior"],
  VIE: ["Assurance Vie Sérénité", "Prévoyance Capital"],
  RESPONSABILITE_CIVILE: ["RC Vie Privée", "RC Professionnelle"],
};

const DESCRIPTIONS_SINISTRE: Record<TypeContrat, string[]> = {
  AUTO: [
    "Collision arrière sur parking",
    "Bris de glace pare-brise",
    "Vol du véhicule sur voie publique",
    "Accrochage en stationnement",
  ],
  HABITATION: [
    "Dégât des eaux cuisine",
    "Cambriolage avec effraction",
    "Incendie électroménager",
    "Bris de vitre suite à tempête",
  ],
  SANTE: [
    "Hospitalisation 3 jours",
    "Soins dentaires",
    "Consultation spécialiste",
  ],
  VIE: ["Demande de rachat partiel"],
  RESPONSABILITE_CIVILE: [
    "Dommage causé à un tiers",
    "Bris d'objet chez un voisin",
  ],
};

async function main() {
  console.log("🌱 Nettoyage des tables…");
  await prisma.paiement.deleteMany();
  await prisma.sinistre.deleteMany();
  await prisma.contrat.deleteMany();
  await prisma.client.deleteMany();

  console.log("🌱 Génération des données factices…");

  const typeContrats = Object.values(TypeContrat);
  const statutsContrat: StatutContrat[] = [
    StatutContrat.ACTIF, StatutContrat.ACTIF, StatutContrat.ACTIF,
    StatutContrat.EN_ATTENTE, StatutContrat.SUSPENDU, StatutContrat.RESILIE,
  ];
  const statutsSinistre = Object.values(StatutSinistre);
  const moyens = Object.values(MoyenPaiement);

  let contratSeq = 1;
  let sinistreSeq = 1;
  let paiementSeq = 1;

  const NB_CLIENTS = 18;

  for (let i = 1; i <= NB_CLIENTS; i++) {
    const prenom = pick(PRENOMS);
    const nom = pick(NOMS);
    const loc = pick(VILLES);
    const civilite = pick(["M.", "Mme"]);
    const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}${i}@example.com`
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

    const client = await prisma.client.create({
      data: {
        reference: `CLI-2024-${pad(i)}`,
        civilite,
        prenom,
        nom,
        email,
        telephone: `0${randInt(6, 7)} ${pad(randInt(10, 99), 2)} ${pad(
          randInt(10, 99),
          2
        )} ${pad(randInt(10, 99), 2)} ${pad(randInt(10, 99), 2)}`,
        adresse: pick(RUES),
        codePostal: loc.cp,
        ville: loc.ville,
        dateNaissance: new Date(
          randInt(1960, 2000),
          randInt(0, 11),
          randInt(1, 28)
        ),
      },
    });

    // 1 à 3 contrats par client
    const nbContrats = randInt(1, 3);
    for (let c = 0; c < nbContrats; c++) {
      const type = pick(typeContrats);
      const statut = pick(statutsContrat);
      const prime = randInt(200, 1800) + rand();
      const dateDebut = daysAgo(randInt(30, 900));
      const contrat = await prisma.contrat.create({
        data: {
          reference: `CTR-2024-${pad(contratSeq++)}`,
          type,
          statut,
          libelle: pick(LIBELLES_CONTRAT[type]),
          primeAnnuelle: prime.toFixed(2),
          franchise: pick([0, 75, 120, 150, 300]).toFixed(2),
          dateDebut,
          dateFin:
            statut === StatutContrat.RESILIE ? daysAgo(randInt(1, 60)) : null,
          clientId: client.id,
        },
      });

      // 0 à 2 sinistres par contrat
      const nbSinistres = randInt(0, 2);
      for (let s = 0; s < nbSinistres; s++) {
        const statutSin = pick(statutsSinistre);
        const dateIncident = daysAgo(randInt(5, 400));
        const montantEstime = randInt(300, 9000) + rand();
        const indemnise =
          statutSin === StatutSinistre.CLOS
            ? (montantEstime * (0.6 + rand() * 0.4)).toFixed(2)
            : null;
        await prisma.sinistre.create({
          data: {
            reference: `SIN-2024-${pad(sinistreSeq++)}`,
            statut: statutSin,
            description: pick(DESCRIPTIONS_SINISTRE[type]),
            dateIncident,
            dateDeclaration: new Date(
              dateIncident.getTime() + randInt(1, 10) * 86400000
            ),
            montantEstime: montantEstime.toFixed(2),
            montantIndemnise: indemnise,
            contratId: contrat.id,
          },
        });
      }

      // 1 à 4 paiements (échéances) par contrat
      const nbPaiements = randInt(1, 4);
      for (let p = 0; p < nbPaiements; p++) {
        const echeanceOffset = p * 90 - randInt(0, 60);
        const echeance =
          echeanceOffset >= 0
            ? daysFromNow(echeanceOffset)
            : daysAgo(-echeanceOffset);
        const isPast = echeance.getTime() < Date.now();
        let statutPai: StatutPaiement;
        if (isPast) {
          statutPai = rand() < 0.8 ? StatutPaiement.PAYE : StatutPaiement.EN_RETARD;
        } else {
          statutPai = StatutPaiement.EN_ATTENTE;
        }
        await prisma.paiement.create({
          data: {
            reference: `PAY-2024-${pad(paiementSeq++)}`,
            montant: (Number(prime) / nbPaiements).toFixed(2),
            statut: statutPai,
            moyen: pick(moyens),
            dateEcheance: echeance,
            datePaiement:
              statutPai === StatutPaiement.PAYE
                ? new Date(echeance.getTime() - randInt(0, 5) * 86400000)
                : null,
            contratId: contrat.id,
          },
        });
      }
    }
  }

  const [clients, contrats, sinistres, paiements] = await Promise.all([
    prisma.client.count(),
    prisma.contrat.count(),
    prisma.sinistre.count(),
    prisma.paiement.count(),
  ]);

  console.log("✅ Seed terminé :");
  console.log(`   • ${clients} clients`);
  console.log(`   • ${contrats} contrats`);
  console.log(`   • ${sinistres} sinistres`);
  console.log(`   • ${paiements} paiements`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
