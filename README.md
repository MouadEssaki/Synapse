# Synapse

Synapse est une application de **cartographie visuelle** : créez des boards, organisez vos idées en nœuds et liens, et retrouvez vos espaces de travail depuis un tableau de bord.

Le projet est composé d’un **frontend React** (canvas interactif avec React Flow), d’une **API Spring Boot** et d’une base **PostgreSQL**, orchestrés avec **Docker Compose**.

## Fonctionnalités

- **Authentification** — inscription, connexion, refresh token avec rotation, déconnexion
- **Profil utilisateur** — rôles (`ROLE_FREE`, `ROLE_PREMIUM`), endpoint `/api/users/me`
- **Boards** — CRUD complet, graphe stocké en JSON (`nodes` / `edges`)
- **Workspace** — éditeur de graphe (React Flow) : nœuds, arêtes, historique undo/redo, export
- **Landing** — page d’accueil, tarification, inscription / connexion

## Stack technique

| Couche | Technologies |
|--------|----------------|
| Frontend | React 19, Vite 7, React Router, Tailwind CSS, `@xyflow/react`, Zustand |
| Backend | Java 21, Spring Boot 3.4, Spring Security, Spring Data JPA, JWT (JJWT) |
| Base de données | PostgreSQL 16 |
| Infra | Docker, Docker Compose |

## Architecture

```
frontend (:5173)  →  backend (:8080)  →  PostgreSQL (:5432)
```

Le backend suit une architecture en couches :

- **Controller** — endpoints REST (`/api/auth`, `/api/boards`, `/api/users`)
- **Service** — logique métier et sécurité (ownership des boards, tokens)
- **Repository** — accès données (Spring Data JPA)
- **Model / DTO** — entités persistées et contrats API

L’API est **stateless** : authentification par **JWT** (access token) et **refresh token** stocké en base.

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- Ou, pour le développement local : Java 21, Maven, Node.js 20+, PostgreSQL 16

## Démarrage rapide (Docker)

1. Cloner le dépôt et se placer à la racine :

```bash
git clone <url-du-repo>
cd Synapse
```

2. Créer le fichier d’environnement :

```bash
cp .env.example .env
```

Renseigner les variables dans `.env` :

| Variable | Description |
|----------|-------------|
| `DB_USER` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `DB_NAME` | Nom de la base |
| `JWT_SECRET_KEY` | Clé secrète JWT (encodage Base64, pour HMAC) |

Exemple pour générer une clé Base64 (PowerShell) :

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

3. Lancer l’ensemble des services :

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:8080 |
| PostgreSQL | `localhost:5432` |

## Développement local

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Variables attendues (voir `application.properties`) : `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET_KEY`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le serveur de dev Vite écoute sur http://localhost:5173 (CORS configuré pour le backend sur le port 8080).

## API REST

### Auth (public)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/refresh` | Nouveau couple de tokens |
| `POST` | `/api/auth/logout` | Révocation du refresh token |

### Boards (authentifié — header `Authorization: Bearer <accessToken>`)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/boards` | Liste des boards de l’utilisateur |
| `GET` | `/api/boards/{id}` | Détail d’un board |
| `POST` | `/api/boards` | Création |
| `PUT` | `/api/boards/{id}` | Mise à jour (titre, `graphData`) |
| `DELETE` | `/api/boards/{id}` | Suppression |

### Utilisateur (authentifié)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/users/me` | Profil de l’utilisateur connecté |

## Structure du projet

```
Synapse/
├── backend/          # API Spring Boot
├── frontend/         # Application React (Vite)
├── docker-compose.yml
├── .env.example
└── LICENSE
```

## Licence

MIT — voir [LICENSE](LICENSE).
