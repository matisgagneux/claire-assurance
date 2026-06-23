# Claire Assurance — Backoffice

Backoffice de gestion de contrats d'assurance : clients, contrats, sinistres et paiements.
Authentification déléguée à **Keycloak** (OpenID Connect), avec gestion des rôles.

## Stack

- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS**
- **Prisma** + **PostgreSQL**
- **NextAuth (Auth.js)** avec provider **Keycloak**
- **Docker Compose** : PostgreSQL + Keycloak (realm pré-configuré)

## Prérequis

- Node.js 20+
- Docker + Docker Compose v2

## Démarrage

### 1. Lancer l'infrastructure (Postgres + Keycloak)

```bash
docker compose up -d
```

Keycloak met ~30 s à démarrer et importe automatiquement le realm `claire-assurance`
(client, rôles et utilisateurs de test). Console admin Keycloak : http://localhost:8080
(`admin` / `admin`).

### 2. Configurer l'environnement

```bash
cp .env.example .env
# Générer un vrai secret NextAuth :
# openssl rand -base64 32  → coller dans NEXTAUTH_SECRET
```

### 3. Installer les dépendances et préparer la base

```bash
npm install
npm run db:migrate   # crée le schéma dans PostgreSQL
npm run db:seed      # injecte les données factices
```

### 4. Lancer l'application

```bash
npm run dev
```

Application : http://localhost:3000 → redirige vers `/login`.

## Comptes de démonstration

| Utilisateur            | Mot de passe | Rôle          | Droits                          |
| ---------------------- | ------------ | ------------- | ------------------------------- |
| `admin.claire`         | `admin`      | Administrateur | Accès complet                   |
| `gestionnaire.claire`  | `gestion`    | Gestionnaire  | Gère contrats et sinistres      |
| `agent.claire`         | `agent`      | Agent         | Lecture seule                   |

Les rôles sont portés par le realm Keycloak et exposés dans le token via le claim
`realm_access.roles`. Ils sont lus côté NextAuth (`src/lib/auth.ts`) et exploités par
les helpers de `src/lib/session.ts` (`requireRole`, `canWrite`, …).

## Modèle de données

```
Client 1───* Contrat 1───* Sinistre
                    └───* Paiement
```

- **Client** : assuré (coordonnées, référence)
- **Contrat** : type (auto, habitation, santé, vie, RC), prime, franchise, statut
- **Sinistre** : déclaration liée à un contrat, montants estimé/indemnisé, statut
- **Paiement** : échéance liée à un contrat, moyen de paiement, statut

## Scripts npm

| Script             | Description                               |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Serveur de développement                  |
| `npm run build`    | Build de production                       |
| `npm run db:migrate` | Applique les migrations Prisma (dev)    |
| `npm run db:seed`  | Injecte les données factices              |
| `npm run db:reset` | Réinitialise la base + reseed             |

## Structure

```
prisma/
  schema.prisma          # modèle de données
  seed.ts                # données factices
keycloak/
  realm-claire-assurance.json  # realm importé au démarrage
src/
  app/
    (backoffice)/        # pages protégées (dashboard, clients, contrats, …)
    login/               # page de connexion
    forbidden/           # accès refusé
    api/auth/[...nextauth]/route.ts
  components/            # Sidebar, UserMenu, Badge, UI
  lib/                   # auth, prisma, session, format
  middleware.ts          # protège les routes du backoffice
```

## Sécurité

- Toutes les pages sous `(backoffice)` exigent une session (middleware + garde serveur).
- Les secrets de démo (`NEXTAUTH_SECRET`, secret du client Keycloak, mots de passe)
  sont volontairement triviaux. **À changer impérativement avant tout déploiement.**
