# CinéDélices - Project Handover Document

> **Purpose**: This document provides complete context for continuing development. Share this file + the codebase with a new LLM to resume work from where we stopped.

---

## 🎬 Project Overview

**CinéDélices** is a recipe website featuring dishes from movies and TV shows. Think "Ratatouille from Ratatouille" or "Los Pollos Hermanos from Breaking Bad".

### Tech Stack
| Layer | Technology |
|-------|------------|
| **Backend** | Express.js, Sequelize ORM, PostgreSQL |
| **Frontend** | EJS (server-rendered) + Svelte (interactive components) |
| **Auth** | JWT (cookie-based for views, Bearer header for API) |
| **Testing** | Jest, Supertest, Cheerio |
| **Styling** | Vanilla CSS with cinematic theme (gold #D4AF37, dark red #8B0000) |

---

## 📁 Project Structure

```
/final_project_oclock
├── /backend                  # Express + EJS server
│   ├── /src
│   │   ├── /controllers      # Route handlers
│   │   ├── /middlewares      # Auth, validation
│   │   ├── /models           # Sequelize models (User, Recipe, Category, Media, Rating, Review)
│   │   ├── /routes           # API + View routes
│   │   ├── /views            # EJS templates
│   │   │   ├── /auth         # Login, Register
│   │   │   ├── /recipes      # CRUD forms + detail with ratings/reviews
│   │   │   ├── /profile      # User profile views
│   │   │   └── /layouts      # Main layout
│   │   └── /public           # Static assets (CSS)
│   ├── /tests
│   │   ├── /unit             # Model tests
│   │   └── /integration      # API + View tests
│   ├── server.js
│   └── package.json
│
├── /frontend                 # Svelte + Vite (for interactive components - not yet used)
│   ├── /src
│   └── package.json
│
└── /requirements            # Mockups and design specs
```

---

## 🗄️ Database Models

| Model | Key Fields |
|-------|-----------|
| **User** | id, email, password_hash, username, role, avatar_url, bio |
| **Recipe** | id, title, description, ingredients, instructions, difficulty, prep_time, cook_time, image_url, user_id, category_id, media_id |
| **Category** | id, name, description |
| **Media** | id, title, type (film/serie), image_url, release_year |
| **Rating** | id, user_id, recipe_id, stars (1-5), unique(user_id, recipe_id) |
| **Review** | id, user_id, recipe_id, content |

---

## ✅ Completed Work

### Sprint 0: Conception ✅
- Wireframes, mockups, color palette

### Sprint 1: MVP Setup ✅ (Tagged: `v1.0-sprint1`)
- Express + EJS configuration
- Sequelize models with associations
- API routes (Auth, Recipes, Categories, Media)
- Frontend views (Homepage, Recipe list/detail, Login/Register)
- Cinematic UI (film strips, projector, glassmorphic cards)
- Search & Filter functionality

### Sprint 2 Progress:
#### Phase 0: Project Restructure ✅
- Split into `/backend` and `/frontend` directories

#### Phase 1: Recipe CRUD Forms ✅
- Create/Edit/Delete recipe forms with auth protection

#### Phase 2: User Profiles ✅
- Added avatar_url, bio to User model
- Profile page (`/profile/:id`) with "My Recipes"
- Profile edit form (`/profile/edit`)

#### Phase 3: Ratings & Reviews ✅
- Rating model (1-5 stars, unique per user/recipe)
- Review model with text content
- `POST /recipes/:id/rate` and `POST /recipes/:id/reviews`
- Recipe detail page shows average rating and reviews list

**Current Test Count: 97 tests passing**

---

## 📋 Remaining Work (Sprint 2)

### Phase 4: Favorites (NEXT)
- [ ] Create Favorite model (user_id, recipe_id, unique together)
- [ ] Create migration for favorites table
- [ ] Add `POST /recipes/:id/favorite` toggle route
- [ ] Add favorite button on recipe cards and detail page
- [ ] Create `/favorites` page showing user's favorites

---

## 🔑 Key Files to Understand

| File | Purpose |
|------|---------|
| `backend/src/app.js` | Express setup, middlewares, route registration |
| `backend/src/routes/viewRoutes.js` | All frontend routes (views) |
| `backend/src/controllers/viewController.js` | Renders EJS pages + handles form submissions |
| `backend/src/middlewares/auth.js` | `isAuthenticated`, `isRecipeAuthor` middlewares |
| `backend/src/models/index.js` | Sequelize setup + model associations (auto-loads all models) |
| `backend/src/public/css/style.css` | All styling (830+ lines of cinematic CSS) |

---

## 🧪 Running the Project

```bash
# Start PostgreSQL
docker-compose up -d

# Backend (from /backend directory)
cp ../.env .env     # Copy env file if needed
npm install
npm run dev         # Starts on http://localhost:3000

# Run tests (from /backend)
npm test

# Run migrations (from /backend)
npx sequelize-cli db:migrate --env development
```

---

## 💡 Development Approach

- **TDD**: Write failing tests first (Red), implement to pass (Green), refactor
- **Auth Pattern**: Cookie-based JWT for views, Bearer token for API
- **Migrations**: Use `.cjs` extension for Sequelize CLI compatibility with ES modules
- **View Routes**: Root-level (`/`, `/recipes`, `/profile`, etc.)
- **API Routes**: `/api/v1/*` prefix

---

## 🎯 Current Status

| Metric | Value |
|--------|-------|
| **Sprint** | 2 (in progress) |
| **Phase** | 3 complete, 4 next |
| **Tests** | 97 passing |
| **Progress** | ~80% of Sprint 2 |

**Last commit**: `feat(sprint2-phase3): implement Ratings and Reviews system`

---

## 🚀 To Continue Development

1. Read this document
2. Start Phase 4: Favorites
3. Follow TDD pattern used in existing tests
4. See `backend/tests/integration/ratingsReviews.test.js` for test patterns

---

## 📝 Prompt for Next LLM

Copy this prompt to continue development:

```
I'm working on CinéDélices, a recipe website for dishes from movies/TV shows.

**Current State:**
- Sprint 2, Phase 4: Favorites (last remaining phase)
- 97 tests passing
- Backend: Express + EJS + Sequelize + PostgreSQL
- All models: User, Recipe, Category, Media, Rating, Review

**Phase 4 Tasks:**
1. Create Favorite model (user_id + recipe_id, unique together)
2. Create migration (.cjs file) for favorites table
3. Add toggle favorite route: POST /recipes/:id/favorite
4. Update recipe cards/detail to show favorite button
5. Create /favorites page listing user's favorites
6. Write integration tests (TDD approach)

**Key Files:**
- backend/src/models/ (see Rating.js as reference)
- backend/src/routes/viewRoutes.js
- backend/src/controllers/viewController.js
- backend/tests/integration/ (for test patterns)

**Development Pattern:**
- TDD: Write tests first, then implement
- Migrations: Use .cjs extension
- Auth: Cookie-based JWT (use generateToken from utils/jwt.js in tests)

Please implement Phase 4: Favorites following the existing patterns.
```
