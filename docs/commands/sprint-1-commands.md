# Sprint 1 : Commandes Exécutées

> **Référence complète de toutes les commandes utilisées pendant le Sprint 1**
> *Pour reproduire l'environnement ou comprendre les étapes*

---

## 📅 Jour 1 : Initialisation du Projet

### 1.1-1.3 : Setup GitHub

```bash
# Créer le repo sur GitHub (via interface web ou CLI)
gh repo create cinedelices --private --source=. --push \
  --description "Site web de recettes de cuisine inspirées du cinéma et des séries"

# Créer la branche develop
git checkout -b develop
```

### 1.4 : Initialiser Node.js

```bash
npm init -y
```

**Résultat** : Création de `package.json`

### 1.5 : Créer la structure de dossiers

```bash
mkdir -p src/{controllers,models,routes,middlewares,views/{layouts,partials,pages,admin},config,utils}
mkdir -p public/{css,js,images}
mkdir -p tests/{unit,integration}
mkdir -p docker
```

**Arborescence créée** :
```
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── pages/
│   └── admin/
├── config/
└── utils/
public/
├── css/
├── js/
└── images/
tests/
├── unit/
└── integration/
docker/
```

### 1.6 : .gitignore (déjà créé)

*Fichier créé au début du projet*

### 1.7 : Créer .env.example

```bash
# Créé manuellement avec les variables suivantes
cat > .env.example << 'EOF'
NODE_ENV=development
PORT=3000
HOST=localhost

DATABASE_URL=postgres://user:password@localhost:5432/cinedelices
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinedelices
DB_USER=user
DB_PASSWORD=password

SESSION_SECRET=your-super-secret-session-key
COOKIE_SECRET=your-cookie-secret

GEMINI_API_KEY=your-google-ai-api-key
AI_ENABLED=false
AI_MAX_RETRIES=2
AI_TIMEOUT_MS=10000
EOF

# Copier pour créer .env local
cp .env.example .env
```

### 1.8 : Premier commit

```bash
git add .
git commit -m "chore: initialize Node.js project and create folder structure (Sprint 1 - Day 1)"
git push origin develop
```

---

## 📦 Jour 2 : Installation des Dépendances

### 1.9-1.18 : Installation des packages de production

```bash
# Installation en une seule commande
npm install express ejs sequelize pg pg-hstore argon2 bcrypt \
  express-session dotenv express-validator joi cors
```

**Packages installés** :
- `express` : Framework HTTP
- `ejs` : Moteur de templates
- `sequelize`, `pg`, `pg-hstore` : ORM + driver PostgreSQL
- `argon2` : Hachage de mots de passe
- `bcrypt` : Alternative pour hachage (backup)
- `express-session` : Gestion des sessions
- `dotenv` : Variables d'environnement
- `express-validator` : Validation des entrées
- `joi` : Validation de schémas
- `cors` : Cross-Origin Resource Sharing

**Résultat** : 140 packages installés, 0 vulnérabilités

### 1.19 : Installation des dépendances de développement

```bash
npm install -D nodemon eslint jest
```

**Packages dev installés** :
- `nodemon` : Auto-redémarrage du serveur
- `eslint` : Linter JavaScript
- `jest` : Framework de tests

**Résultat** : 365 packages supplémentaires installés

### Ajout des scripts NPM

```bash
# Les scripts ont été ajoutés manuellement dans package.json
# Voir section "Scripts utiles" ci-dessous
```

### 1.20 : Commit des dépendances

```bash
git add .
git commit -m "chore(deps): add core dependencies and npm scripts (Sprint 1 - Day 2)

- Installed all production dependencies (express, ejs, sequelize, argon2, etc.)
- Installed dev dependencies (nodemon, eslint, jest)
- Added comprehensive npm scripts for dev, test, and DB management
- Created SPRINT1.md progress tracker"

git push origin develop
```

---

## 🐳 Jour 3 : Docker & Base de Données (À venir)

### 1.21-1.24 : Création des fichiers Docker

```bash
# Créer Dockerfile pour production
touch Dockerfile

# Créer Dockerfile pour développement
touch docker/Dockerfile.dev

# Créer docker-compose.yml pour production
touch docker-compose.yml

# Créer docker-compose.dev.yml pour développement
touch docker-compose.dev.yml
```

### 1.25 : Lancement des containers

```bash
# Démarrer les services en mode développement
docker-compose -f docker-compose.dev.yml up -d

# Vérifier que les containers tournent
docker ps
```

### 1.26 : Vérifier PostgreSQL

```bash
# Se connecter à PostgreSQL dans le container
docker exec -it cinedelices-db psql -U user -d cinedelices

# Dans psql, vérifier la connexion
\l  # Liste des bases de données
\q  # Quitter
```

### 1.27-1.28 : Configuration Sequelize

```bash
# Installer Sequelize CLI globalement ou localement
npm install --save-dev sequelize-cli

# Initialiser Sequelize
npx sequelize-cli init
```

**Résultat** : Création de :
- `config/config.json`
- `migrations/`
- `seeders/`
- `models/`

### 1.29 : Commit Docker setup

```bash
git add .
git commit -m "chore(docker): add containerization (Sprint 1 - Day 3)"
git push origin develop
```

---

## 🗄️ Jour 4 : Modèles Sequelize (À venir)

### 1.30-1.33 : Création des modèles

```bash
# Générer les modèles via Sequelize CLI
npx sequelize-cli model:generate --name User \
  --attributes email:string,password_hash:string,username:string,role:string

npx sequelize-cli model:generate --name Category \
  --attributes name:string,description:text

npx sequelize-cli model:generate --name Media \
  --attributes title:string,type:string,image_url:string,release_year:integer

npx sequelize-cli model:generate --name Recipe \
  --attributes title:string,description:text,ingredients:text,instructions:text,difficulty:string,prep_time:integer,cook_time:integer,image_url:string
```

### 1.36-1.37 : Migrations

```bash
# Créer une migration manuelle si nécessaire
npx sequelize-cli migration:generate --name create-tables

# Exécuter les migrations
npx sequelize-cli db:migrate

# Annuler la dernière migration (si erreur)
npx sequelize-cli db:migrate:undo
```

### 1.38-1.39 : Seeders

```bash
# Créer un seeder
npx sequelize-cli seed:generate --name demo-data

# Exécuter tous les seeders
npx sequelize-cli db:seed:all

# Annuler tous les seeders
npx sequelize-cli db:seed:undo:all
```

### 1.40 : Commit modèles

```bash
git add .
git commit -m "feat(models): add Sequelize models and migrations (Sprint 1 - Day 4)"
git push origin develop
```

---

## 🛣️ Jour 5 : Backend & Routes (À venir)

### 1.41 : Créer server.js

```bash
# Créer le fichier principal
touch server.js
```

### 1.49 : Tester le serveur

```bash
# Démarrer le serveur en mode développement
npm run dev

# Le serveur devrait démarrer sur http://localhost:3000
```

### 1.50 : Commit structure backend

```bash
git add .
git commit -m "feat(backend): add Express routes and middlewares (Sprint 1 - Day 5)"
git push origin develop
```

---

## 🎨 Jours 6-7 : Frontend (À venir)

### Création des vues EJS

```bash
# Les fichiers seront créés manuellement dans src/views/
# Pas de commande spécifique
```

### 1.63 : Commit intégration frontend

```bash
git add .
git commit -m "feat(frontend): add EJS views and CSS styles (Sprint 1 - Days 6-7)"
git push origin develop
```

### 1.64 : Merge vers develop

```bash
# Si travail sur une branche feature
git checkout develop
git merge feature/sprint1-setup

# Ou créer une Pull Request sur GitHub
```

---

## 📝 Scripts NPM Utiles

### Développement

```bash
# Démarrer le serveur avec auto-reload
npm run dev

# Démarrer en mode production
npm start
```

### Tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch
```

### Linting

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lint:fix
```

### Base de données

```bash
# Exécuter les migrations
npm run db:migrate

# Exécuter les seeders
npm run db:seed

# Reset complet de la BDD
npm run db:reset
```

### Docker

```bash
# Démarrer en mode développement
npm run docker:dev

# Build les images
npm run docker:build

# Démarrer en arrière-plan
npm run docker:up

# Arrêter les containers
docker-compose down

# Voir les logs
docker-compose logs -f
```

---

## 🔍 Commandes de Debugging

### Vérifier les versions

```bash
node --version
npm --version
docker --version
docker-compose --version
psql --version
```

### Vérifier les packages installés

```bash
npm list --depth=0
```

### Audit de sécurité

```bash
npm audit
npm audit fix  # Corriger les vulnérabilités
```

### Nettoyer node_modules

```bash
rm -rf node_modules package-lock.json
npm install
```

### Logs Docker

```bash
# Voir les logs d'un container
docker logs cinedelices-app

# Voir les logs en temps réel
docker logs -f cinedelices-db
```

---

## 📋 Checklist de Vérification

Après avoir exécuté toutes les commandes du Sprint 1 :

```bash
# ✅ Vérifier que le serveur démarre
npm run dev
# → Doit afficher "Server running on http://localhost:3000"

# ✅ Vérifier que Docker fonctionne
docker-compose up
# → Les containers app et db doivent démarrer

# ✅ Vérifier la connexion BDD
docker exec -it cinedelices-db psql -U user -d cinedelices -c "\dt"
# → Doit afficher les tables créées

# ✅ Vérifier le linting
npm run lint
# → Aucune erreur

# ✅ Vérifier les tests
npm test
# → Tests passent (ou "no tests" si pas encore implémentés)
```

---

## 🆘 Dépannage

### Problèmes courants

**Port 3000 déjà utilisé**
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans .env
PORT=3001
```

**PostgreSQL ne démarre pas**
```bash
# Vérifier les logs
docker-compose logs db

# Redémarrer le container
docker-compose restart db
```

**Erreur de permissions Docker**
```bash
# Ajouter l'utilisateur au groupe docker (Linux)
sudo usermod -aG docker $USER

# Redémarrer Docker Desktop (Mac/Windows)
```

---

*Document mis à jour : 18 janvier 2026*
*Sprint 1 - Jours 1-2 exécutés*
