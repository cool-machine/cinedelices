# Sprint 1 : Mise en Place - Suivi de Progression

> **Objectif** : Mettre en place l'environnement de développement complet et la structure du projet.
> **Durée estimée** : 7 jours
> **Équipe** : [À compléter avec les noms des membres]

---

## 📅 Jour 1 : Initialisation du Projet

| # | Tâche | Statut | Responsable | Notes |
|---|-------|--------|-------------|-------|
| 1.1 | Créer le repository GitHub | ✅ | - | `cinedelices` (privé) |
| 1.2 | Cloner le repository | ✅ | - | Local setup |
| 1.3 | Créer la branche develop | ✅ | - | Branch créée |
| 1.4 | Initialiser le projet Node.js | ✅ | - | `package.json` créé |
| 1.5 | Créer la structure de dossiers | ✅ | - | src/, public/, tests/, docker/ |
| 1.6 | Créer le fichier `.gitignore` | ✅ | - | Node.js template |
| 1.7 | Créer `.env.example` | ✅ | - | Variables d'environnement documentées |
| 1.8 | Premier commit | ✅ | - | `103fe5b` |

**Livrable Jour 1** : ✅ Structure de projet initialisée

---

## 📦 Jour 2 : Installation des Dépendances

| # | Tâche | Statut | Package | Version | Notes |
|---|-------|--------|---------|---------|-------|
| 1.9 | Installer Express | ✅ | `express` | - | Framework HTTP |
| 1.10 | Installer EJS | ✅ | `ejs` | - | Moteur de templates |
| 1.11 | Installer Sequelize + pg | ✅ | `sequelize`, `pg`, `pg-hstore` | - | ORM + PostgreSQL |
| 1.12 | Installer argon2 | ✅ | `argon2` | - | Hachage mots de passe |
| 1.13 | Installer bcrypt (backup) | ✅ | `bcrypt` | - | Alternative argon2 |
| 1.14 | Installer express-session | ✅ | `express-session` | - | Gestion sessions |
| 1.15 | Installer dotenv | ✅ | `dotenv` | - | Variables env |
| 1.16 | Installer express-validator | ✅ | `express-validator` | - | Validation entrées |
| 1.17 | Installer joi | ✅ | `joi` | - | Validation schémas |
| 1.18 | Installer cors | ✅ | `cors` | - | Cross-Origin |
| 1.19 | Installer dépendances dev | ✅ | `nodemon`, `eslint`, `jest` | - | Dev tools |
| 1.20 | Commit dépendances | ⏳ | - | - | À faire |

**Note** : Pas d'utilisation de multer ou helmet (voir dev-notes.md)

**Livrable Jour 2** : ⏳ En cours

---

## 🐳 Jour 3 : Configuration Docker & Base de Données

| # | Tâche | Statut | Fichier | Notes |
|---|-------|--------|---------|-------|
| 1.21 | Créer `Dockerfile` | ⬜ | `Dockerfile` | Multi-stage build |
| 1.22 | Créer `Dockerfile.dev` | ⬜ | `docker/Dockerfile.dev` | Dev config |
| 1.23 | Créer `docker-compose.yml` | ⬜ | `docker-compose.yml` | Services app + db |
| 1.24 | Créer `docker-compose.dev.yml` | ⬜ | `docker-compose.dev.yml` | Dev avec volumes |
| 1.25 | Lancer les containers | ⬜ | - | `docker-compose up -d` |
| 1.26 | Vérifier PostgreSQL | ⬜ | - | Connexion BDD |
| 1.27 | Configurer Sequelize | ⬜ | `src/config/database.js` | Config ORM |
| 1.28 | Initialiser Sequelize CLI | ⬜ | - | Migrations/seeders |
| 1.29 | Commit Docker setup | ⬜ | - | - |

**Livrable Jour 3** : ⬜ À faire

---

## 🗄️ Jour 4 : Création des Modèles Sequelize

| # | Tâche | Statut | Modèle | Champs principaux |
|---|-------|--------|--------|-------------------|
| 1.30 | Créer modèle User | ⬜ | `User.js` | id, email, password_hash, username, role |
| 1.31 | Créer modèle Category | ⬜ | `Category.js` | id, name, description |
| 1.32 | Créer modèle Media | ⬜ | `Media.js` | id, title, type, image_url, release_year |
| 1.33 | Créer modèle Recipe | ⬜ | `Recipe.js` | id, title, description, ingredients, instructions |
| 1.34 | Créer fichier index models | ⬜ | `models/index.js` | Associations et export |
| 1.35 | Définir les associations | ⬜ | - | User→Recipe, Category→Recipe, Media→Recipe |
| 1.36 | Créer la migration initiale | ⬜ | - | Migration SQL |
| 1.37 | Exécuter la migration | ⬜ | - | `db:migrate` |
| 1.38 | Créer les seeders | ⬜ | - | Données de test |
| 1.39 | Exécuter les seeders | ⬜ | - | `db:seed:all` |
| 1.40 | Commit modèles | ⬜ | - | - |

**Livrable Jour 4** : ⬜ À faire

---

## 🛣️ Jour 5 : Structure Backend & Routes de Base

| # | Tâche | Statut | Fichier | Contenu |
|---|-------|--------|---------|---------|
| 1.41 | Créer le serveur principal | ⬜ | `server.js` | Express app, middlewares, port |
| 1.42 | Créer le router principal | ⬜ | `src/routes/index.js` | Import routers |
| 1.43 | Créer les routes recettes | ⬜ | `recipeRoutes.js` | GET, POST /recipes |
| 1.44 | Créer les routes auth | ⬜ | `authRoutes.js` | login, register, logout |
| 1.45 | Créer les routes utilisateur | ⬜ | `userRoutes.js` | /profile |
| 1.46 | Créer les routes admin | ⬜ | `adminRoutes.js` | CRUD admin |
| 1.47 | Créer middleware auth | ⬜ | `authMiddleware.js` | isAuthenticated, isAdmin |
| 1.48 | Créer middleware erreurs | ⬜ | `errorHandler.js` | Gestion erreurs globale |
| 1.49 | Tester le serveur | ⬜ | - | `npm run dev` |
| 1.50 | Commit structure backend | ⬜ | - | - |

**Livrable Jour 5** : ⬜ À faire

---

## 🎨 Jours 6-7 : Intégration Frontend de Base

| # | Tâche | Statut | Fichier | Description |
|---|-------|--------|---------|-------------|
| 1.51 | Créer le layout principal | ⬜ | `layouts/main.ejs` | Header, footer, CSS/JS |
| 1.52 | Créer le header partial | ⬜ | `partials/header.ejs` | Navigation, logo |
| 1.53 | Créer le footer partial | ⬜ | `partials/footer.ejs` | Liens, copyright |
| 1.54 | Créer la page d'accueil | ⬜ | `pages/home.ejs` | Hero, recettes populaires |
| 1.55 | Créer la page catalogue | ⬜ | `pages/recipes.ejs` | Liste recettes, filtres |
| 1.56 | Créer la page recette | ⬜ | `pages/recipe-detail.ejs` | Détail recette |
| 1.57 | Créer la page login | ⬜ | `pages/login.ejs` | Formulaire connexion |
| 1.58 | Créer la page register | ⬜ | `pages/register.ejs` | Formulaire inscription |
| 1.59 | Créer les styles CSS de base | ⬜ | `public/css/main.css` | Reset, variables, layout |
| 1.60 | Créer les styles composants | ⬜ | `public/css/components.css` | Cards, buttons, forms |
| 1.61 | Intégrer la charte graphique | ⬜ | - | Couleurs/polices maquettes |
| 1.62 | Tester le responsive | ⬜ | - | Mobile-first validé |
| 1.63 | Commit intégration frontend | ⬜ | - | - |
| 1.64 | Merge vers develop | ⬜ | - | PR merged |
| 1.65 | **LIVRABLE SPRINT 1** | ⬜ | - | ✅ Site navigable en local |

---

## ✅ Critères de Validation Sprint 1

- [ ] Le serveur démarre sans erreur (`npm run dev`)
- [ ] La BDD est accessible et contient les tables MVP
- [ ] Les pages principales s'affichent (accueil, catalogue, recette)
- [ ] Docker fonctionne (`docker-compose up`)
- [ ] Le code passe le linting (`npm run lint`)

---

## 📝 Notes & Décisions

### Choix Techniques
- **ORM** : Sequelize (vu en cours O'clock)
- **Templates** : EJS (SSR pour SEO)
- **Hachage** : Argon2 (avec bcrypt en backup)
- **Validation** : express-validator + joi

### Problèmes Rencontrés
*[À documenter au fur et à mesure]*

### Ressources Utiles
- [Sequelize Docs](https://sequelize.org/)
- [Express.js Docs](https://expressjs.com/)
- Dev-notes.md : Guide complet Sprint 1

---

## 👥 Répartition des Tâches

| Membre | Rôle | Tâches assignées |
|--------|------|------------------|
| TBD | Lead Dev | Architecture, revues de code |
| TBD | Backend | Modèles, routes, API |
| TBD | Frontend | EJS, CSS, intégration |
| TBD | DevOps | Docker, BDD, déploiement |

---

*Dernière mise à jour : 18 janvier 2026*
*Progression globale Sprint 1 : ██░░░░░░░░ 20% (Jour 2 en cours)*
