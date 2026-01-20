# Ciné Délices - Notes de Développement

> **Document de suivi technique pour le développement du projet Ciné Délices**
> *Un site web de recettes de cuisine inspirées du cinéma et des séries*

---

## 📋 Table des Matières

1. [Vue d'Ensemble du Projet](#-vue-densemble-du-projet)
2. [Organisation des Sprints](#-organisation-des-sprints)
3. [Stack Technique](#-stack-technique)
4. [Architecture du Projet](#-architecture-du-projet)
5. [Conventions de Code](#-conventions-de-code)
6. [Conventions Git & GitHub](#-conventions-git--github)
7. [Déploiement & CI/CD](#-déploiement--cicd)
8. [Sécurité](#-sécurité)
9. [Structure des Fichiers](#-structure-des-fichiers)
10. [Environnement de Développement](#-environnement-de-développement)
11. [Checklist de Lancement](#-checklist-de-lancement)

---

## 🎬 Vue d'Ensemble du Projet

### Description

Ciné Délices est un site web de recettes de cuisine inspirées du cinéma et des séries. Le projet est développé dans un cadre pédagogique visant l'obtention du Titre Professionnel.

### MVP (Minimum Viable Product)

| Fonctionnalité | Description | Priorité |
|---------------|-------------|----------|
| **Catalogue de recettes** | Affichage, recherche par titre (recette/film/série), filtres par catégorie | 🔴 Haute |
| **Page recette** | Ingrédients, instructions, film/série associé, anecdotes | 🔴 Haute |
| **Authentification** | Connexion, inscription, gestion de profil | 🔴 Haute |
| **Ajout de recette** | Formulaire accessible aux utilisateurs connectés | 🔴 Haute |
| **Back-office** | Gestion des recettes, catégories, utilisateurs | 🔴 Haute |

### Évolutions Potentielles (Post-MVP)

- Commentaires avec modération
- Système de likes/notation (Implémenté Sprint 2)
- Gestion avancée des ingrédients
- Filtres par ingrédient

---

## 🏃 Organisation des Sprints - Guide Chronologique Complet

> **⏱️ Estimation globale** : 4 sprints de 1 semaine chacun
> **📅 Durée totale** : ~4 semaines de développement

---

### 📋 Sprint 0 : Conception ✅ (TERMINÉ)

**Objectif** : Définir le projet, concevoir l'architecture, valider les choix techniques.

| # | Tâche | Livrable | Statut |
|---|-------|----------|--------|
| 0.1 | Rédiger le cahier des charges | `cahier-des-charges.docx` | ✅ |
| 0.2 | Définir le MVP et les évolutions | Section MVP du CDC | ✅ |
| 0.3 | Lister les spécifications techniques | Choix stack technique | ✅ |
| 0.4 | Modéliser la base de données (MCD) | `MCD.png` | ✅ |
| 0.5 | Créer le MLD et dictionnaire de données | `MLD.docx`, `Dictionnaire.docx` | ✅ |
| 0.6 | Concevoir les wireframes | `wireframes.docx` | ✅ |
| 0.7 | Définir la charte graphique | `charte-graphique.docx` | ✅ |
| 0.8 | Créer les maquettes UI | `mockups_v2.docx` | ✅ |
| 0.9 | Définir l'arborescence du site | `arbo2.png` | ✅ |
| 0.10 | Préparer les notes de développement | `dev-notes.md` | ✅ |

---

### 🔧 Sprint 1 : Mise en Place (Setup Technique)

**Objectif** : Mettre en place l'environnement de développement complet et la structure du projet.

#### Jour 1 : Initialisation du Projet

| # | Tâche | Commande/Action | Livrable |
|---|-------|-----------------|----------|
| 1.1 | Créer le repository GitHub | GitHub → New Repository "cinedelices" | Repo GitHub | ✅ |
| 1.2 | Cloner le repository | `git clone <url>` | Dossier local | ✅ |
| 1.3 | Créer la branche develop | `git checkout -b develop` | Branche develop | ✅ |
| 1.4 | Initialiser le projet Node.js | `npm init -y` | `package.json` | ✅ |
| 1.5 | Créer la structure de dossiers | Voir structure ci-dessous | Arborescence projet | ✅ |
| 1.6 | Créer le fichier `.gitignore` | Copier template Node.js | `.gitignore` | ✅ |
| 1.7 | Créer `.env.example` | Variables d'environnement | `.env.example` | ✅ |
| 1.8 | Premier commit | `git commit -m "chore: initial project setup"` | Commit initial | ✅ |

**Structure de dossiers à créer (Sprint 1.5) :**
```
mkdir -p src/{controllers,models,routes,middlewares,views/{layouts,partials,pages,admin},config,utils}
mkdir -p public/{css,js,images}
mkdir -p tests/{unit,integration}
mkdir -p docker
```

#### Jour 2 : Installation des Dépendances

> **Note** : Ces packages correspondent au programme O'clock

| # | Tâche | Commande | Justification |
|---|-------|----------|---------------|
| 1.9 | Installer Express | `npm i express` | Framework HTTP | ✅ |
| 1.10 | Installer EJS | `npm i ejs` | Moteur de templates | ✅ |
| 1.11 | Installer Sequelize + pg | `npm i sequelize pg pg-hstore` | ORM + driver PostgreSQL | ✅ |
| 1.12 | Installer argon2 | `npm i argon2` | Hachage mots de passe (plus sécurisé que bcrypt) | ✅ |
| 1.13 | Installer bcrypt (backup) | `npm i bcrypt` | Alternative si argon2 pose problème | ✅ |
| 1.14 | Installer express-session | `npm i express-session` | Gestion des sessions | ✅ |
| 1.15 | Installer dotenv | `npm i dotenv` | Variables d'environnement | ✅ |
| 1.16 | Installer express-validator | `npm i express-validator` | Validation des entrées | ✅ |
| 1.17 | Installer joi | `npm i joi` | Validation de schémas (alternative) | ✅ |
| 1.18 | Installer cors | `npm i cors` | Cross-Origin Requests | ✅ |
| 1.19 | Installer dépendances dev | `npm i -D nodemon eslint jest` | Dev tools | ✅ |
| 1.20 | Commit dépendances | `git commit -m "chore(deps): add core dependencies"` | | ✅ |

**Note sur les images** : Pour le MVP, les recettes utiliseront des **URLs d'images** (texte) au lieu d'uploads. Cela évite d'utiliser multer et simplifie le projet.

#### Jour 3 : Configuration Docker & Base de Données

| # | Tâche | Action | Livrable |
|---|-------|--------|----------|
| 1.21 | Créer `Dockerfile` | Multi-stage build pour production | `Dockerfile` | ✅ |
| 1.22 | Créer `Dockerfile.dev` | Configuration développement | `docker/Dockerfile.dev` | ✅ |
| 1.23 | Créer `docker-compose.yml` | Services app + db | `docker-compose.yml` | ✅ |
| 1.24 | Créer `docker-compose.dev.yml` | Config développement avec volumes | `docker-compose.dev.yml` | ✅ |
| 1.25 | Lancer les containers | `docker-compose -f docker-compose.dev.yml up -d` | Containers démarrés | ✅ |
| 1.26 | Vérifier PostgreSQL | `docker exec -it cinedelices-db psql -U user -d cinedelices` | Connexion BDD OK | ✅ |
| 1.27 | Configurer Sequelize | Créer `src/config/database.js` | Config Sequelize | ✅ |
| 1.28 | Initialiser Sequelize CLI | `npx sequelize-cli init` | Dossiers migrations/seeders | ✅ |
| 1.29 | Commit Docker setup | `git commit -m "chore(docker): add containerization"` | | ✅ |

#### Jour 4 : Création des Modèles Sequelize

| # | Tâche | Fichier | Champs principaux |
|---|-------|---------|-------------------|
| 1.30 | Créer modèle User | `src/models/User.js` | id, email, password_hash, username, role, created_at | ✅ |
| 1.31 | Créer modèle Category | `src/models/Category.js` | id, name, description | ✅ |
| 1.32 | Créer modèle Media | `src/models/Media.js` | id, title, type, image_url, release_year | ✅ |
| 1.33 | Créer modèle Recipe | `src/models/Recipe.js` | id, title, description, ingredients, instructions, difficulty, prep_time, cook_time, image_url, user_id, category_id, media_id | ✅ |
| 1.34 | Créer fichier index models | `src/models/index.js` | Associations et export | ✅ |
| 1.35 | Définir les associations | Dans index.js | User→Recipe, Category→Recipe, Media→Recipe | ✅ |
| 1.36 | Créer la migration initiale | `npx sequelize-cli migration:generate --name create-tables` | Migration | ✅ |
| 1.37 | Exécuter la migration | `npx sequelize-cli db:migrate` | Tables créées | ✅ |
| 1.38 | Créer les seeders | `npx sequelize-cli seed:generate --name demo-data` | Données de test | ✅ |
| 1.39 | Exécuter les seeders | `npx sequelize-cli db:seed:all` | Données insérées | ✅ |
| 1.40 | Commit modèles | `git commit -m "feat(models): add Sequelize models and migrations"` | | ✅ |

#### Jour 5 : Structure Backend & Routes de Base

| # | Tâche | Fichier | Contenu |
|---|-------|---------|---------|
| 1.41 | Créer le serveur principal | `server.js` | Express app, middlewares, port | ✅ |
| 1.42 | Créer le router principal | `src/routes/index.js` | Import de tous les routers | ✅ |
| 1.43 | Créer les routes recettes (API) | `src/routes/recipeRoutes.js` | GET /recipes, GET /recipes/:id, POST /recipes | ✅ |
| 1.44 | Créer les routes auth (API) | `src/routes/authRoutes.js` | POST /login, POST /register | ✅ |
| 1.45 | Créer les routes vues | `src/routes/viewRoutes.js` | Pages publiques + profils | ✅ |
| 1.46 | Créer les routes admin (views) | `src/routes/viewRoutes.js` | CRUD admin côté pages | ✅ |
| 1.47 | Créer middleware auth | `src/middlewares/authMiddleware.js` | isAuthenticated, isAdmin | ✅ |
| 1.48 | Créer middleware erreurs | `src/middlewares/errorHandler.js` | Gestion des erreurs globale | ✅ |
| 1.49 | Tester le serveur | `npm run dev` → `http://localhost:3000` | Serveur fonctionnel | ✅ |
| 1.50 | Commit structure backend | `git commit -m "feat(backend): add Express routes and middlewares"` | | ✅ |

#### Jours 6-7 : Intégration Frontend de Base

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 1.51 | Créer le layout principal | `src/views/layouts/main.ejs` | Header, footer, liens CSS/JS | ✅ |
| 1.52 | Créer le header partial | `src/views/partials/header.ejs` | Navigation, logo | ✅ |
| 1.53 | Créer le footer partial | `src/views/partials/footer.ejs` | Liens, copyright | ✅ |
| 1.54 | Créer la page d'accueil | `src/views/pages/home.ejs` | Hero, recettes populaires | ✅ |
| 1.55 | Créer la page catalogue | `src/views/pages/recipes.ejs` | Liste des recettes, filtres | ✅ |
| 1.56 | Créer la page recette | `src/views/pages/recipe-detail.ejs` | Détail complet de la recette | ✅ |
| 1.57 | Créer la page login | `src/views/pages/login.ejs` | Formulaire connexion | ✅ |
| 1.58 | Créer la page register | `src/views/pages/register.ejs` | Formulaire inscription | ✅ |
| 1.59 | Créer les styles CSS de base | `public/css/main.css` | Reset, variables, layout | ✅ |
| 1.60 | Créer les styles composants | `public/css/components.css` | Cards, buttons, forms | ✅ |
| 1.61 | Intégrer la charte graphique | Appliquer les couleurs/polices | Styles cohérents avec maquettes | ✅ |
| 1.62 | Tester le responsive | DevTools → Mobile view | Mobile-first validé | ✅ |
| 1.63 | Commit intégration frontend | `git commit -m "feat(frontend): add EJS views and CSS styles"` | | ✅ |
| 1.64 | Merge vers develop | `git checkout develop && git merge feature/setup` | PR merged | ✅ |
| 1.65 | **LIVRABLE SPRINT 1** | Démo locale fonctionnelle | ✅ Site navigable en local |

**Critères de validation Sprint 1 :**
- [x] Le serveur démarre sans erreur (`npm run dev`)
- [x] La BDD est accessible et contient les tables MVP
- [x] Les pages principales s'affichent (accueil, catalogue, recette)
- [x] Docker fonctionne (`docker-compose up`)
- [x] Le code passe le linting (`npm run lint`)

---

### ⚙️ Sprint 2 : Développement des Fonctionnalités MVP

**Objectif** : Implémenter toutes les fonctionnalités critiques du MVP.

#### Semaine 2 - Jour 1-2 : Système d'Authentification

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 2.1 | Implémenter le hashage password | `src/controllers/authController.js` | bcrypt.hash() avec coût 12 | ✅ |
| 2.2 | Implémenter l'inscription | `authController.register()` | Validation, création user, redirection | ✅ |
| 2.3 | Implémenter la connexion | `authController.login()` | Vérification password, session | ✅ |
| 2.4 | Implémenter la déconnexion | `authController.logout()` | Destruction session | ✅ |
| 2.5 | Configurer express-session | `server.js` | Secret, cookie options, store | ✅ |
| 2.6 | Ajouter flash messages | `npm i connect-flash` | Messages de succès/erreur | ✅ |
| 2.7 | Créer middleware isAuthenticated | `authMiddleware.js` | Protection des routes | ✅ |
| 2.8 | Créer middleware isAdmin | `authMiddleware.js` | Accès admin uniquement | ✅ |
| 2.9 | Ajouter user aux locals | `server.js` middleware | `res.locals.user = req.session.user` | ✅ |
| 2.10 | Tester scénario complet | Manual testing | Register → Login → Access protected → Logout | ✅ |
| 2.11 | Commit auth | `git commit -m "feat(auth): implement authentication system"` | | ✅ |

#### Semaine 2 - Jour 3-4 : Catalogue & Recherche de Recettes

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 2.12 | Implémenter GET /recipes | `recipeController.getAll()` | Liste paginée avec filtres | ✅ |
| 2.13 | Ajouter filtre par catégorie | Query params `?category=` | Filter Sequelize where | ✅ |
| 2.14 | Ajouter recherche par titre | Query params `?search=` | ILIKE '%search%' | ✅ |
| 2.15 | Ajouter recherche par film/série | Query params `?media=` | Join avec Media | ✅ |
| 2.16 | Implémenter la pagination | Query params `?page=&limit=` | LIMIT + OFFSET | ✅ |
| 2.17 | Créer le composant RecipeCard | `views/partials/recipe-card.ejs` | Image, titre, catégorie, temps | ✅ |
| 2.18 | Créer les filtres UI | `views/pages/recipes.ejs` | Dropdown catégorie, search bar | ✅ |
| 2.19 | Ajouter tri des résultats | Query params `?sort=` | ORDER BY created_at, title | ✅ |
| 2.20 | Styliser le catalogue | `public/css/recipes.css` | Grid responsive, cards | ✅ |
| 2.21 | Tester les filtres | Manual testing | Toutes combinaisons de filtres | ✅ |
| 2.22 | Commit catalogue | `git commit -m "feat(recipes): add catalog with search and filters"` | | ✅ |

#### Semaine 2 - Jour 5 : Page Détail Recette

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 2.23 | Implémenter GET /recipes/:id | `recipeController.getById()` | Eager loading associations | ✅ |
| 2.24 | Afficher les ingrédients | `recipe-detail.ejs` | Liste formatée | ✅ |
| 2.25 | Afficher les instructions | `recipe-detail.ejs` | Étapes numérotées | ✅ |
| 2.26 | Afficher le film/série associé | `recipe-detail.ejs` | Titre, affiche, année | ✅ |
| 2.27 | Afficher les informations | `recipe-detail.ejs` | Temps prépa, cuisson, difficulté | ✅ |
| 2.28 | Ajouter l'anecdote/contexte | `recipe-detail.ejs` | Section contexte cinéma | ✅ |
| 2.29 | Ajouter Schema.org Recipe | `<script type="application/ld+json">` | SEO structured data | ✅ |
| 2.30 | Styliser la page | `public/css/recipe-detail.css` | Layout 2 colonnes, responsive | ✅ |
| 2.31 | Tester page détail | Manual testing | Navigation depuis catalogue | ✅ |
| 2.32 | Commit page détail | `git commit -m "feat(recipes): add recipe detail page"` | | ✅ |

#### Semaine 2 - Jours 6-7 : Ajout de Recette (Utilisateur Connecté)

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 2.33 | Créer GET /recipes/new | `recipeController.showCreateForm()` | Formulaire création (auth required) | ✅ |
| 2.34 | Créer le formulaire | `views/pages/recipe-form.ejs` | Tous les champs recette | ✅ |
| 2.35 | Charger catégories/médias | Controller | Dropdown dynamiques | ✅ |
| 2.36 | Ajouter champ URL image | `recipe-form.ejs` | Champ texte pour URL (pas d'upload fichier) | ✅ |
| 2.37 | Valider les entrées | express-validator | Règles de validation | ✅ |
| 2.38 | Implémenter POST /recipes | `recipeController.create()` | Création en BDD | ✅ |
| 2.39 | Ajouter messages de succès/erreur | Flash messages | Feedback utilisateur | ✅ |
| 2.40 | Protéger la route | `isAuthenticated` middleware | Redirection si non connecté | ✅ |
| 2.41 | Tester création recette | Manual testing | Formulaire complet → création | ✅ |
| 2.42 | Commit ajout recette | `git commit -m "feat(recipes): add recipe creation form"` | | ✅ |
| 2.43 | Merge vers develop | PR review + merge | Code review | ✅ |

---

#### 🤖 BONUS : Génération de Recette Assistée par IA (Optionnel)

> **⚠️ Feature Bonus** : Cette fonctionnalité est **entièrement optionnelle**. Ne l'implémenter que si :
> - Le MVP est fonctionnel
> - L'équipe a du temps disponible
> - Vous voulez un élément différenciant pour le portfolio
>
> **Objectif** : Accélérer la création de recettes en proposant un pré-remplissage automatique basé sur le film/série sélectionné, tout en laissant le contrôle éditorial total à l'utilisateur.

**Placement** : Intégré au formulaire de création de recette existant

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 2.44b | Créer variable d'environnement | `.env` | `GEMINI_API_KEY`, `AI_ENABLED=true` | 🚫 |
| 2.45b | Ajouter bouton "Suggérer avec l'IA" | `recipe-form.ejs` | Bouton affiché uniquement si média sélectionné | 🚫 |
| 2.46b | Créer service IA | `src/services/aiRecipeService.js` | Appel API Gemini pour génération | 🚫 |
| 2.47b | Créer endpoint génération | `recipeController.generateFromMedia()` | Route POST `/api/recipes/generate` | 🚫 |
| 2.48b | Implémenter prompt template | `aiRecipeService.js` | Template structuré film → JSON recette | 🚫 |
| 2.49b | Ajouter gestion front-end | `public/js/recipe-form.js` | Fetch API, loading state, pré-remplissage | 🚫 |
| 2.50b | Gestion des erreurs | Frontend + Backend | Timeout, rate limit, fallback manuel | 🚫 |
| 2.51b | Tester scénario complet | Manual testing | Sélection → Génération → Édition → Soumission | 🚫 |
| 2.52b | Commit feature IA | Git | `feat(ai): add AI-assisted recipe generation` | 🚫 |

**Choix Technique :**

| Décision | Choix | Justification |
|----------|-------|---------------|
| **LLM Provider** | Google Gemini 1.5 Flash | Tier gratuit généreux (15 req/min) |
| **Fallback** | Désactivation gracieuse | Si quota dépassé ou API down, formulaire manuel |
| **Format réponse** | JSON structuré | `{title, ingredients[], steps[], anecdote}` |
| **Cache** | Non (MVP) | Peut être ajouté plus tard si besoin |

**Variables d'environnement à ajouter :**
```env
# AI Recipe Generation (Optional Feature)
GEMINI_API_KEY=your-google-ai-api-key
AI_ENABLED=true
AI_MAX_RETRIES=2
AI_TIMEOUT_MS=10000
```

**Exemple de prompt template :**
```javascript
// src/services/aiRecipeService.js
const generateRecipePrompt = (media) => `
Tu es un chef créatif spécialisé dans les recettes inspirées du cinéma.

Film/Série : "${media.title}" (${media.release_year})
Type : ${media.type}

Génère une recette de cuisine INSPIRÉE par ce film/série.
La recette doit évoquer l'univers, les personnages, ou une scène emblématique.

Réponds UNIQUEMENT en JSON (pas de markdown) :
{
  "title": "Nom créatif de la recette",
  "ingredients": ["ingrédient 1", "ingrédient 2", ...],
  "instructions": ["étape 1", "étape 2", ...],
  "anecdote": "Lien entre la recette et le film/série",
  "difficulty": "facile|moyen|difficile",
  "prep_time": 30,
  "cook_time": 45
}
`;
```

**Garde-fous :**
- ✅ L'IA **ne crée jamais directement** en base de données
- ✅ L'utilisateur peut éditer tous les champs générés
- ✅ Bouton désactivé si pas de média sélectionné
- ✅ Feature flag : peut être désactivée via `AI_ENABLED=false`
- ✅ Aucun impact sur le schéma de BDD

**Installation de la dépendance :**
```bash
npm install @google/generative-ai
```

---

**Critères de validation Sprint 2 :**
- [x] Inscription/connexion/déconnexion fonctionnels
- [x] Catalogue avec recherche et filtres opérationnel
- [x] Page détail recette complète
- [x] Formulaire d'ajout de recette fonctionnel (utilisateurs connectés)
- [x] Tests manuels de tous les scénarios MVP passés

---

### 🏛️ Sprint 2 (Suite) : Back-Office Administration

#### Semaine 2 - En parallèle ou après MVP

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 2.44 | Créer layout admin | `views/admin/layout.ejs` | Sidebar, dashboard | ✅ |
| 2.45 | Créer dashboard admin | `views/admin/dashboard.ejs` | Stats: nb recettes, users, etc. | ✅ |
| 2.46 | CRUD Recettes (admin) | `adminController.recipes*()` | Liste, modifier, supprimer | ✅ |
| 2.47 | CRUD Catégories (admin) | `adminController.categories*()` | Ajouter, modifier, supprimer | ✅ |
| 2.48 | CRUD Utilisateurs (admin) | `adminController.users*()` | Liste, modifier rôle, supprimer | ✅ |
| 2.49 | CRUD Médias (admin) | `adminController.media*()` | Ajouter films/séries | ✅ |
| 2.50 | Tableaux de données | Admin tables | Pagination, tri, recherche | ✅ |
| 2.51 | Confirmation suppression | Modal JavaScript | Éviter suppressions accidentelles | ✅ |
| 2.52 | Styliser back-office | `public/css/admin.css` | Style pro, dark mode option | ✅ |
| 2.53 | Protéger toutes les routes | `isAdmin` middleware | Accès admin uniquement | ✅ |
| 2.54 | Tester back-office complet | Manual testing | Tous les CRUD | ✅ |
| 2.55 | Commit back-office | `git commit -m "feat(admin): add complete back-office"` | | ✅ |
| 2.56 | **LIVRABLE SPRINT 2** | MVP complet fonctionnel | ✅ Toutes fonctionnalités MVP (SPA Reactored) |

### 🔄 Sprint 2.5 : Refactorisation SPA (Architecture Moderne)

**Objectif** : Transitionner d'une architecture MVC monolithique (EJS) vers une architecture SPA (Single Page Application) avec Svelte + API REST Express.

| # | Tâche | Technologie | Description | Statut |
|---|-------|-------------|-------------|--------|
| 2.57 | Setup Frontend | Vite + Svelte | Initialisation projet frontend séparé | ✅ |
| 2.58 | API Backend | Express REST | Transformation routes EJS en routes JSON | ✅ |
| 2.59 | Authentification | JWT/Cookie | Auth basée sur cookies sécurisés (httpOnly) | ✅ |
| 2.60 | Migration Pages | Svelte Components | Portage : Accueil, Catalogue, Détail, Auth | ✅ |
| 2.61 | State Management | Svelte Stores | Gestion état utilisateur et UI globale | ✅ |
| 2.62 | Design System | CSS Custom | Restauration thème Cinéma (Or/Noir) + Glassmorphism | ✅ |


---

### 🎨 Sprint 3.0 : Visual Refinement (Match Mockups)

**Objectif** : Aligner les visuels du frontend avec les maquettes haute-fidélité créées en Sprint 0.

#### Phase 1 : Design Foundation

| # | Tâche | Description | Statut |
|---|-------|-------------|--------|
| 3.0.1 | Importer les fonts Google | Bebas Neue, Montserrat, Playfair Display | [ ] |
| 3.0.2 | Mettre à jour les variables CSS | Couleurs (#D4AF37, #8B0000, #1A1A1A) et typographie | [ ] |

#### Phase 2 : Navbar

| # | Tâche | Description | Statut |
|---|-------|-------------|--------|
| 3.0.3 | Ajouter logo film projector | Style cinéma authentique | [ ] |
| 3.0.4 | Appliquer typographie Bebas Neue | Titres et navigation | [ ] |

#### Phase 3 : Homepage

| # | Tâche | Description | Statut |
|---|-------|-------------|--------|
| 3.0.5 | Refondre le hero section | Film strip frame + featured dish | [ ] |
| 3.0.6 | Ajouter section "NOW PLAYING" | Header théâtral + film strip borders | [ ] |
| 3.0.7 | Ajouter section "COMING SOON" | Cards preview avec bordures cinéma | [ ] |

#### Phase 4 : Recipe Detail Page

| # | Tâche | Description | Statut |
|---|-------|-------------|--------|
| 3.0.8 | Ajouter Meta Icons Row | Prep time, cook time, portions, difficulty icons | [ ] |
| 3.0.9 | Créer TMDB Sidebar | Movie poster, release year, director, rating | [ ] |
| 3.0.10 | Numéroter les instructions | Grid layout avec cercles dorés | [ ] |

#### Phase 5 : Footer

| # | Tâche | Description | Statut |
|---|-------|-------------|--------|
| 3.0.11 | Créer footer complet | Links, social icons, newsletter | [ ] |

#### Phase 6 : Verification

| # | Tâche | Description | Statut |
|---|-------|-------------|--------|
| 3.0.12 | Tests visuels | Comparaison côte-à-côte avec mockups | [ ] |
| 3.0.13 | Tests responsive | Mobile, tablet, desktop | [ ] |

---

### 🎯 Sprint 3 : Finitions, Tests & Déploiement

**Objectif** : Finaliser, tester, sécuriser et déployer l'application.

#### Semaine 3 - Jour 1-2 : Tests & Qualité

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 3.1 | Configurer Jest | `jest.config.js` | Configuration tests | ✅ |
| 3.2 | Écrire tests unitaires modèles | `tests/unit/models/` | Tests validation, méthodes | ✅ |
| 3.3 | Écrire tests controllers | `tests/unit/controllers/` | Tests logique métier | ✅ |
| 3.4 | Écrire tests routes (integration) | `tests/integration/` | Tests endpoints API | ✅ |
| 3.5 | Configurer couverture de code | `npm test -- --coverage` | Objectif > 60% | ✅ |
| 3.6 | Corriger les bugs identifiés | Selon résultats tests | Debug | ✅ |
| 3.7 | Exécuter linting complet | `npm run lint:fix` | Code propre | ✅ |
| 3.8 | Commit tests | `git commit -m "test: add unit and integration tests"` | | ✅ |

#### Semaine 3 - Jour 3 : Sécurité & Performance

> **Explications des concepts de sécurité :**
> - **CSRF (Cross-Site Request Forgery)** : Attaque où un site malveillant envoie des requêtes au nom d'un utilisateur connecté. Protection : vérifier l'origine des requêtes.
> - **XSS (Cross-Site Scripting)** : Injection de scripts malveillants. Protection : échapper les données utilisateur (EJS le fait automatiquement avec `<%= %>`).
> - **Rate limiting** : Limiter le nombre de requêtes pour éviter les attaques par force brute.

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 3.9 | Audit sécurité dépendances | `npm audit` | Corriger vulnérabilités | ✅ |
| 3.10 | Vérifier échappement XSS | EJS avec `<%= %>` | EJS échappe automatiquement le HTML | ✅ |
| 3.11 | Vérifier injection SQL | Sequelize | Sequelize utilise des requêtes paramétrées | ✅ |
| 3.12 | Sécuriser les cookies | `express-session` config | `httpOnly: true`, `secure: true` en prod | ✅ |
| 3.13 | Valider toutes les entrées | `express-validator` / `joi` | Aucune donnée non validée | ✅ |
| 3.14 | Tester scénarios de sécurité | Manual testing | Tentatives d'injection, accès non autorisé | ✅ |
| 3.15 | Commit sécurité | `git commit -m "security: add input validation and secure cookies"` | | ✅ |

#### Semaine 3 - Jour 4 : SEO & Accessibilité (Simplifié)

> **SEO Essentiel** : Les éléments ci-dessous sont les plus importants pour le référencement. Les items avancés (sitemap, robots.txt, Schema.org) sont optionnels pour le MVP.

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 3.16 | Ajouter balise `<title>` | Toutes les pages EJS | Titre unique par page (ex: "Ratatouille - Ciné Délices") | ✅ |
| 3.17 | Ajouter meta description | `<meta name="description">` | Description courte (max 160 caractères) | ✅ |
| 3.18 | Utiliser structure HTML sémantique | `<header>`, `<main>`, `<footer>`, `<article>` | Améliore le SEO et l'accessibilité | ✅ |
| 3.19 | Ajouter attributs alt aux images | Toutes les `<img>` | Description textuelle des images | ✅ |
| 3.20 | Tester avec Lighthouse | Chrome DevTools → Lighthouse | Score SEO et accessibilité | ✅ |
| 3.21 | Corriger problèmes identifiés | Selon rapport Lighthouse | Améliorer les scores | ✅ |
| 3.22 | Commit SEO | `git commit -m "feat(seo): add meta tags and semantic HTML"` | | ✅ |

**Optionnel (bonus)** :
- `robots.txt` : Fichier indiquant aux moteurs de recherche quelles pages indexer
- `sitemap.xml` : Liste de toutes les pages pour Google
- Open Graph : Balises pour un bel affichage lors du partage sur les réseaux sociaux

#### Semaine 3 - Jour 5 : RGPD & Mentions Légales

| # | Tâche | Fichier | Description |
|---|-------|---------|-------------|
| 3.28 | Créer page mentions légales | `views/pages/legal.ejs` | Infos légales obligatoires | ✅ |
| 3.29 | Créer page politique confidentialité | `views/pages/privacy.ejs` | RGPD, cookies | ✅ |
| 3.30 | Ajouter bannière cookies | JavaScript + CSS | Consentement utilisateur | ✅ |
| 3.31 | Ajouter formulaire contact | `views/pages/contact.ejs` | Demande suppression données (Mailto link) | ✅ |
| 3.32 | Implémenter suppression compte | Profil utilisateur | Droit à l'oubli | ✅ |
| 3.33 | Tester conformité RGPD | Checklist | Toutes obligations | ✅ |
| 3.34 | Commit RGPD | `git commit -m "feat(legal): add GDPR compliance pages"` | | ✅ |

#### Semaine 3 - Jours 6-7 : CI/CD & Déploiement Azure

| # | Tâche | Action | Description |
|---|-------|--------|-------------|
| 3.35 | Créer workflow GitHub Actions | `.github/workflows/ci.yml` | Tests automatiques sur PR | ✅ |
| 3.36 | Créer workflow deploy | `.github/workflows/deploy.yml` | Build + deploy sur merge main | ✅ |
| 3.37 | Créer compte Azure | portal.azure.com | Crédits étudiants | 🔄 |
| 3.38 | Créer Resource Group | Azure Portal | `rg-cinedelices` | 🔄 |
| 3.39 | Créer Azure App Service | Azure Portal | Plan gratuit F1 (staging) | 🔄 |
| 3.40 | Créer PostgreSQL Flexible | Azure Portal | Burstable B1ms | 🔄 |
| 3.41 | Configurer variables d'env | App Service → Configuration | DATABASE_URL, secrets | 🔄 |
| 3.42 | Obtenir publish profile | App Service → Download | Pour GitHub Actions | 🔄 |
| 3.43 | Ajouter secrets GitHub | Settings → Secrets | AZURE_WEBAPP_PUBLISH_PROFILE | 🔄 |
| 3.44 | Tester deploy staging | Push vers main | Vérifier déploiement auto | 🔄 |
| 3.45 | Tester l'application déployée | URL Azure | Test complet | 🔄 |
| 3.46 | Configurer domaine custom | Azure DNS (optionnel) | Nom de domaine | 🔄 |
| 3.47 | Activer HTTPS | App Service → TLS/SSL | Certificat gratuit Azure | 🔄 |
| 3.48 | Commit CI/CD | `git commit -m "ci: add GitHub Actions deployment workflow"` | | ✅ |
| 3.49 | Merge final vers main | PR review + merge | Déploiement production | 🔄 |
| 3.50 | **LIVRABLE SPRINT 3** | Application déployée en production | ✅ Site accessible en ligne |

---

### 📊 Récapitulatif des Livrables par Sprint

| Sprint | Livrable Principal | Critères de Succès |
|--------|-------------------|-------------------|
| **Sprint 0** | Documentation complète | CDC, MCD/MLD, wireframes, maquettes validés |
| **Sprint 1** | Environnement opérationnel | Serveur local, BDD, Docker, structure projet |
| **Sprint 2** | MVP fonctionnel | Auth, catalogue, recettes, back-office |
| **Sprint 3** | Production déployée | Tests, sécurité, SEO, RGPD, Azure |

---

### 📅 Planning Estimé

```
SPRINT 0 (Conception)     : ████████████████████ TERMINÉ
SPRINT 1 (Setup)          : ████████████████████ TERMINÉ
SPRINT 2 (Fonctionnalités): ████████████████████ TERMINÉ (Refactor SPA Inclus)
SPRINT 3 (Finitions)      : ░░░░░░░░░░░░░░░░░░░░ EN COURS (Verification & Deployment)

Total estimé: ~4 semaines de développement
```

---

### ⚡ Quick Reference : Commandes Quotidiennes

```bash
# Démarrer le développement
docker-compose -f docker-compose.dev.yml up -d
npm run dev

# Avant chaque commit
npm run lint
npm test

# Workflow Git quotidien
git checkout -b feature/ma-feature
# ... développement ...
git add .
git commit -m "feat(scope): description"
git push origin feature/ma-feature
# Créer PR sur GitHub

# Migrations BDD
npx sequelize-cli migration:generate --name ma-migration
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## 🛠️ Stack Technique

### Frontend

| Technologie | Rôle | Justification |
|------------|------|---------------|
| **HTML5** | Structure | Standard web, SEO-friendly, sémantique |
| **CSS3** | Styles | Responsive, animations, variables CSS |
| **Svelte** | Framework UI | Performances optimales, bundle léger, syntaxe simple |
| **JavaScript (ES6+)** | Logique client | Interactivité, manipulation DOM |

### Backend

| Technologie | Rôle | Justification |
|------------|------|---------------|
| **Node.js** | Runtime | JavaScript côté serveur, écosystème NPM |
| **Express.js** | Framework HTTP | Léger, flexible, middleware ecosystem |
| **EJS** | Templating | Rendu côté serveur pour SEO, pages statiques |

### Base de Données

| Technologie | Rôle | Justification |
|------------|------|---------------|
| **PostgreSQL** | SGBD Relationnel | Robuste, performant, open-source |
| **Sequelize** | ORM | Abstraction BDD, migrations, validations |

### DevOps & Déploiement

| Technologie | Rôle | Justification |
|------------|------|---------------|
| **Docker** | Containerisation | Environnement reproductible, isolation |
| **GitHub Actions** | CI/CD | Intégration native GitHub, gratuit |
| **Azure Cloud** | Hébergement | Crédits étudiants, App Service économique |

---

## 🏗️ Architecture du Projet

### Pattern MVC

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  (Browser - HTML/CSS/JS/Svelte)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Requests
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      CONTROLLER                              │
│  (Express Routes - API & Pages)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│      MODEL      │       │      VIEW       │
│   (Sequelize)   │       │     (EJS)       │
└────────┬────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
└─────────────────┘
```

### Structure des Dossiers (Proposée)

```
cinedelices/
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 deploy.yml
├── 📁 public/
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 images/
├── 📁 src/
│   ├── 📁 controllers/
│   │   ├── 📄 recipeController.js
│   │   ├── 📄 userController.js
│   │   ├── 📄 authController.js
│   │   └── 📄 adminController.js
│   ├── 📁 models/
│   │   ├── 📄 index.js
│   │   ├── 📄 Recipe.js
│   │   ├── 📄 User.js
│   │   ├── 📄 Category.js
│   │   └── 📄 Media.js
│   ├── 📁 routes/
│   │   ├── 📄 index.js
│   │   ├── 📄 recipeRoutes.js
│   │   ├── 📄 authRoutes.js
│   │   └── 📄 viewRoutes.js
│   ├── 📁 middlewares/
│   │   ├── 📄 authMiddleware.js
│   │   ├── 📄 errorHandler.js
│   │   └── 📄 validators.js
│   ├── 📁 views/
│   │   ├── 📁 layouts/
│   │   ├── 📁 partials/
│   │   ├── 📁 pages/
│   │   └── 📁 admin/
│   ├── 📁 config/
│   │   ├── 📄 database.js
│   │   └── 📄 sequelize.js
│   └── 📁 utils/
│       ├── 📄 helpers.js
│       └── 📄 validators.js
├── 📁 tests/
│   ├── 📁 unit/
│   └── 📁 integration/
├── 📁 docker/
│   ├── 📄 Dockerfile
│   └── 📄 Dockerfile.dev
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 docker-compose.yml
├── 📄 docker-compose.dev.yml
├── 📄 package.json
├── 📄 README.md
└── 📄 server.js
```

### 🔀 Organisation des routes (actuel)

- **`src/app.js`**
  - Monte **API** : `app.use('/api/v1', router)` → `src/routes/index.js`
  - Monte **Views** : `app.use('/', viewRoutes)` → `src/routes/viewRoutes.js`
- **`src/routes/index.js` (API)**
  - `/recipes` → `recipeRoutes.js`
  - `/auth` → `authRoutes.js`
  - `/categories`, `/media` → `metadataController`
- **`src/routes/viewRoutes.js` (Pages + Admin)**
  - Pages publiques + profils (`/`, `/recipes`, `/profile/...`)
  - Auth pages (`/login`, `/register`, `/logout`)
  - **Admin** (`/admin/*`) avec `isAuthenticated` + `isAdmin`

---

## 📐 Conventions de Code

### Naming Conventions

| Élément | Convention | Exemple |
|---------|------------|---------|
| **Variables** | camelCase | `recipeTitle`, `userId` |
| **Constantes** | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE`, `API_URL` |
| **Fonctions** | camelCase | `getRecipeById()`, `validateUser()` |
| **Classes/Modèles** | PascalCase | `Recipe`, `UserController` |
| **Fichiers JS** | camelCase | `recipeController.js`, `authMiddleware.js` |
| **Fichiers CSS** | kebab-case | `main-styles.css`, `recipe-card.css` |
| **Routes URL** | kebab-case | `/api/recipes`, `/user-profile` |
| **Variables BDD** | snake_case | `created_at`, `recipe_id` |

### Règles de Formatage

```javascript
// ✅ Indentation : 2 espaces
// ✅ Point-virgule : obligatoire
// ✅ Guillemets : simples pour JS, doubles pour HTML
// ✅ Longueur de ligne max : 100 caractères
// ✅ Espaces : après les mots-clés (if, for, while)

// Exemple de fonction bien formatée
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    
    return res.json(recipe);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
```

### ESLint Configuration

```json
{
  "env": {
    "browser": true,
    "node": true,
    "es2022": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": ["warn"],
    "no-console": ["warn"]
  }
}
```

### Documentation du Code

```javascript
/**
 * Récupère une recette par son identifiant
 * @param {number} id - L'identifiant de la recette
 * @returns {Promise<Recipe|null>} La recette trouvée ou null
 * @throws {Error} En cas d'erreur de base de données
 */
const getRecipeById = async (id) => {
  // ...
};
```

---

## 🔀 Conventions Git & GitHub

### Structure des Branches

```
main                    # Production - code stable déployé
├── develop             # Développement - intégration continue
│   ├── feature/xxx     # Nouvelles fonctionnalités
│   ├── fix/xxx         # Corrections de bugs
│   ├── hotfix/xxx      # Corrections urgentes (prod)
│   └── chore/xxx       # Maintenance, refactoring
```

### Format des Commits (Conventional Commits)

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

#### Types de Commits

| Type | Description | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(recipes): add search functionality` |
| `fix` | Correction de bug | `fix(auth): resolve login redirect issue` |
| `docs` | Documentation | `docs(readme): update installation guide` |
| `style` | Formatage (pas de changement de code) | `style(css): fix indentation` |
| `refactor` | Refactoring sans changement fonctionnel | `refactor(api): simplify response handling` |
| `test` | Ajout/modification de tests | `test(recipes): add unit tests for search` |
| `chore` | Maintenance, dépendances | `chore(deps): update express to 4.18.2` |
| `perf` | Amélioration de performance | `perf(db): optimize recipe queries` |
| `ci` | Configuration CI/CD | `ci(actions): add deploy workflow` |

#### Règles des Messages de Commit

- ✅ Première lettre en minuscule
- ✅ Pas de point final
- ✅ Mode impératif ("add" plutôt que "added")
- ✅ Max 72 caractères pour la première ligne
- ✅ Référencer les issues quand pertinent (`#123`)

```bash
# ✅ Bons exemples
git commit -m "feat(recipes): add filter by category"
git commit -m "fix(auth): prevent duplicate sessions (#42)"
git commit -m "docs(api): document new endpoints"

# ❌ Mauvais exemples
git commit -m "Fixed bug"
git commit -m "WIP"
git commit -m "Updated stuff"
```

### Pull Requests

#### Naming Convention

```
[TYPE] Brief description of changes

# Exemples :
[FEAT] Add recipe search functionality
[FIX] Resolve authentication issue on mobile
[DOCS] Update API documentation
```

#### Template de Pull Request

```markdown
## Description
[Description claire des changements]

## Type de changement
- [ ] 🐛 Bug fix
- [ ] ✨ Nouvelle fonctionnalité
- [ ] 📝 Documentation
- [ ] 🔧 Refactoring
- [ ] 🧪 Tests

## Checklist
- [ ] Mon code suit les conventions du projet
- [ ] J'ai testé mes changements localement
- [ ] J'ai ajouté/mis à jour la documentation si nécessaire
- [ ] J'ai ajouté des tests pour couvrir mes changements

## Issues liées
Closes #[numéro]
```

### Labels GitHub

| Label | Couleur | Description |
|-------|---------|-------------|
| `bug` | 🔴 Rouge | Quelque chose ne fonctionne pas |
| `feature` | 🟢 Vert | Nouvelle fonctionnalité |
| `documentation` | 🔵 Bleu | Améliorations documentation |
| `help wanted` | 🟡 Jaune | Aide demandée |
| `priority: high` | 🟠 Orange | Priorité haute |
| `priority: low` | ⚪ Gris | Priorité basse |
| `wip` | 🟣 Violet | Travail en cours |
| `review needed` | 🟤 Marron | Review requise |

---

## 🚀 Déploiement & CI/CD

### Stratégie de Déploiement (Optimisation Coûts Azure)

#### Options Économiques Azure

| Service | Coût Estimé | Use Case |
|---------|-------------|----------|
| **App Service (Free F1)** | Gratuit | Développement/Tests |
| **App Service (Basic B1)** | ~13€/mois | Production légère |
| **Azure Container Apps** | Pay-per-use | Trafic variable |
| **Azure Database for PostgreSQL (Flexible - Burstable B1ms)** | ~15€/mois | BDD production |

#### Recommandation

Pour minimiser les coûts :
1. **Développement** : Docker local + PostgreSQL local
2. **Staging** : Azure App Service Free (F1)
3. **Production** : Azure App Service Basic (B1) + PostgreSQL Flexible (Burstable)

### Docker Configuration

#### Dockerfile (Production)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app .
USER nodejs
EXPOSE 3000
CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:pass@db:5432/cinedelices
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=cinedelices

volumes:
  postgres_data:
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: azure/webapps-deploy@v2
        with:
          app-name: cinedelices
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          images: ghcr.io/${{ github.repository }}:latest
```

---

## 🔒 Sécurité

### Mesures Obligatoires

| Vulnérabilité | Mesure | Implémentation |
|--------------|--------|----------------|
| **XSS** | Échappement HTML | EJS auto-escape, sanitize-html |
| **Injection SQL** | ORM / Requêtes préparées | Sequelize parameterized queries |
| **CSRF** | Tokens CSRF | csurf middleware |
| **Auth** | Hachage mots de passe | bcrypt (coût ≥ 12) |
| **Sessions** | Cookies sécurisés | httpOnly, secure, sameSite |
| **Headers** | Security headers | helmet middleware |
| **Rate Limiting** | Limitation des requêtes | express-rate-limit |

### Variables d'Environnement

```env
# .env.example
NODE_ENV=development

# Server
PORT=3000
HOST=localhost

# Database
DATABASE_URL=postgres://user:password@localhost:5432/cinedelices
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinedelices
DB_USER=user
DB_PASSWORD=password

# Session
SESSION_SECRET=your-super-secret-session-key
COOKIE_SECRET=your-cookie-secret

# API (externe si utilisée)
TMDB_API_KEY=your-tmdb-api-key
```

---

## 🌐 SEO & Accessibilité

### Checklist SEO

- [ ] Balises `<title>` uniques et descriptives
- [ ] Meta descriptions (max 160 caractères)
- [ ] Structure de titres hiérarchique (H1 → H6)
- [ ] URLs propres et descriptives (`/recettes/ratatouille-pixar`)
- [ ] Attributs `alt` sur toutes les images
- [ ] Sitemap XML
- [ ] Fichier robots.txt
- [ ] Schema.org markup (Recipe)
- [ ] Open Graph / Twitter Cards

### Checklist Accessibilité (WCAG)

- [ ] Navigation au clavier
- [ ] Contrastes de couleurs suffisants (4.5:1 minimum)
- [ ] Textes alternatifs descriptifs
- [ ] Formulaires avec labels associés
- [ ] Focus visible sur les éléments interactifs
- [ ] Messages d'erreur explicites
- [ ] Skip links pour navigation rapide

---

## 📊 Base de Données

### Modèles Principaux (MVP)

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string password_hash
        string username
        string role
        datetime created_at
        datetime updated_at
    }
    
    RECIPE {
        int id PK
        string title
        text description
        text ingredients
        text instructions
        string difficulty
        int prep_time
        int cook_time
        string image_url
        int user_id FK
        int category_id FK
        int media_id FK
        datetime created_at
        datetime updated_at
    }
    
    CATEGORY {
        int id PK
        string name
        string description
    }
    
    MEDIA {
        int id PK
        string title
        string type
        string image_url
        int release_year
    }
    
    USER ||--o{ RECIPE : creates
    CATEGORY ||--o{ RECIPE : contains
    MEDIA ||--o{ RECIPE : inspires
```

---

## ⚡ Environnement de Développement

### Prérequis

- Node.js 20.x LTS
- npm 10.x
- Docker Desktop
- PostgreSQL 15.x (ou via Docker)
- Git 2.x
- VS Code (recommandé)

### Extensions VS Code Recommandées

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "svelte.svelte-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "humao.rest-client",
    "ckolkman.vscode-postgres",
    "ms-azuretools.vscode-docker"
  ]
}
```

### Scripts NPM

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "db:migrate": "sequelize db:migrate",
    "db:seed": "sequelize db:seed:all",
    "db:reset": "sequelize db:drop && sequelize db:create && npm run db:migrate && npm run db:seed",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d"
  }
}
```

---

## ✅ Checklist de Lancement

### Sprint 1 - Setup Initial

- [ ] Initialiser le repository Git
- [ ] Créer la structure de dossiers
- [ ] Configurer package.json
- [ ] Installer les dépendances
- [ ] Configurer ESLint & Prettier
- [ ] Créer les fichiers Docker
- [ ] Configurer PostgreSQL & Sequelize
- [ ] Créer les modèles de base
- [ ] Configurer les routes de base
- [ ] Créer les vues principales (EJS)
- [ ] Intégrer les styles CSS de base
- [ ] Tester le déploiement local

### RGPD & Mentions Légales

- [ ] Page mentions légales
- [ ] Page politique de confidentialité
- [ ] Bannière cookies (si nécessaire)
- [ ] Formulaire de contact/demande de suppression

---

## 📚 Ressources

### Documentation Officielle

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Svelte](https://svelte.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker](https://docs.docker.com/)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)

### Inspirations Design

- [Marmiton](https://www.marmiton.org/)
- [750g](https://www.750g.com/)
- [Dribbble - Recipe Apps](https://dribbble.com/search/recipe-app)

---

## 👥 Équipe

| Membre | Rôle | Responsabilités |
|--------|------|-----------------|
| TBD | Lead Dev / Git Master | Architecture, revues de code, Git |
| TBD | Frontend | Intégration, CSS, Svelte |
| TBD | Backend | API, BDD, Auth |
| TBD | DevOps | Docker, CI/CD, Déploiement |


---

## 🎬 Feature Tracking: Recherche de Films & Séries (TMDB integration)

**Implémenté en :** Janvier 2026 (Sprint 2 Extension)

### Objectifs
- Permettre aux utilisateurs de rechercher un film ou une série via l'API TMDB.
- Sélectionner un média pour créer une recette associée.
- Pré-remplir le formulaire de création de recette avec les données du média.

### Architecture Technique
- **Backend** : 
  - `tmdbService.js` : Wrapper pour l'API TMDB.
  - `tmdbRoutes.js` : Endpoints `/search` et `/:id`.
  - `metadataController.js` : Ajout de `createMedia` pour l'enregistrement automatique.
- **Frontend** :
  - `MovieSearch.svelte` : Page de recherche.
  - `RecipeFromMovie.svelte` : Page intermédiaire (Choix AI vs Manuel).
  - `RecipeNew.svelte` : Mise à jour pour accepter les paramètres `prefill_movie`.

### Statut
- [x] Backend Routes (Search, Details, Post Media)
- [x] Frontend UI (Search Page, Choice Page)
- [x] Auth Protection
- [x] Auto-fill & Media Auto-creation
- [ ] AI Generation (Placeholder "Coming Soon")

---

*Document mis à jour le : 19 janvier 2026*
*Version : 1.1.0*
