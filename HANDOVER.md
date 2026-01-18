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
│   │   ├── /models           # Sequelize models
│   │   ├── /routes           # API + View routes
│   │   ├── /views            # EJS templates
│   │   │   ├── /auth         # Login, Register
│   │   │   ├── /recipes      # CRUD forms
│   │   │   └── /layouts      # Main layout
│   │   └── /public           # Static assets (CSS)
│   ├── /tests
│   │   ├── /unit             # Model tests
│   │   └── /integration      # API + View tests
│   ├── server.js
│   └── package.json
│
├── /frontend                 # Svelte + Vite (for interactive components)
│   ├── /src
│   └── package.json
│
└── /requirements            # Mockups and design specs
```

---

## 🗄️ Database Models

| Model | Key Fields |
|-------|-----------|
| **User** | id, email, password_hash, username, role |
| **Recipe** | id, title, description, ingredients, instructions, difficulty, prep_time, cook_time, image_url, user_id (FK), category_id (FK), media_id (FK) |
| **Category** | id, name, description |
| **Media** | id, title, type (film/serie), image_url, release_year |

---

## ✅ Completed Work

### Sprint 0: Conception ✅
- Wireframes, mockups, color palette (#D4AF37 gold, #8B0000 red, #1A1A1A dark)
- Database design (MCD/MLD)

### Sprint 1: MVP Setup ✅ (Tagged: `v1.0-sprint1`)
- Express + EJS configuration
- Sequelize models with associations
- API routes (Auth, Recipes, Categories, Media)
- Frontend views (Homepage, Recipe list/detail, Login/Register)
- Cinematic UI (film strips, projector graphic, glassmorphic cards)
- Search & Filter functionality
- 81 tests passing

### Sprint 2 Progress:
#### Phase 0: Project Restructure ✅
- Split into `/backend` and `/frontend` directories
- Svelte + Vite initialized in `/frontend`

#### Phase 1: Recipe CRUD Forms ✅
- `GET /recipes/new` - Create recipe form
- `POST /recipes` - Submit new recipe
- `GET /recipes/:id/edit` - Edit recipe form
- `PUT /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe
- Auth-protected routes with `isRecipeAuthor` middleware
- **87 tests passing**

---

## 📋 Remaining Work (Sprint 2)

### Phase 2: User Profiles
- [ ] Add avatar_url, bio to User model
- [ ] Create `/profile/:id` view page
- [ ] Create `/profile/edit` form
- [ ] Add "My Recipes" section

### Phase 3: Ratings & Reviews
- [ ] Create Rating model (user_id, recipe_id, stars 1-5)
- [ ] Create Review model (user_id, recipe_id, content)
- [ ] Display average rating on recipe cards
- [ ] Add review form on recipe detail page

### Phase 4: Favorites
- [ ] Create Favorite model (user_id, recipe_id, unique together)
- [ ] Add favorite toggle button on recipes
- [ ] Create `/favorites` page

---

## 🔑 Key Files to Understand

| File | Purpose |
|------|---------|
| `backend/src/app.js` | Express setup, middlewares, route registration |
| `backend/src/routes/viewRoutes.js` | All frontend routes (views) |
| `backend/src/routes/index.js` | API routes under `/api/v1` |
| `backend/src/controllers/viewController.js` | Renders EJS pages + handles form submissions |
| `backend/src/middlewares/auth.js` | `isAuthenticated`, `isRecipeAuthor` middlewares |
| `backend/src/models/index.js` | Sequelize setup + model associations |
| `backend/src/public/css/style.css` | All styling (740+ lines of cinematic CSS) |

---

## 🧪 Running the Project

```bash
# Backend (from /backend directory)
npm install
npm run dev          # Starts on http://localhost:3000

# Frontend (from /frontend directory)
npm install
npm run dev          # Starts on http://localhost:5173

# Run tests (from /backend)
npm test

# Database
docker-compose up -d         # Start PostgreSQL
npm run db:migrate           # Run migrations
npm run db:seed              # Seed demo data
```

---

## 💡 Development Approach

- **TDD**: Write failing tests first (Red), implement to pass (Green), refactor
- **Auth Pattern**: Cookie-based JWT for views, Bearer token for API
- **API Routes**: `/api/v1/*` prefix
- **View Routes**: Root-level (`/`, `/recipes`, `/login`, etc.)

---

## 📝 Git Workflow

- **Main branch**: `develop`
- **Tags**: `v1.0-sprint1` marks end of Sprint 1
- **Commit style**: Conventional commits (`feat:`, `fix:`, `refactor:`)

---

## 🎯 Current Status

| Metric | Value |
|--------|-------|
| **Sprint** | 2 (in progress) |
| **Phase** | 1 complete, 2 next |
| **Tests** | 87 passing |
| **Progress** | ~60% of Sprint 2 |

**Last commit**: `feat(sprint2-phase1): implement Recipe CRUD forms`

---

## 🚀 To Continue Development

1. Read this document
2. Review `backend/src/` for current implementation
3. Check `backend/tests/integration/` for test patterns
4. Start Phase 2: User Profiles (see remaining work above)
5. Follow TDD: Write tests first, then implement

**Questions to answer:**
- Should avatar upload use URLs or file upload?
- Should profiles be public or private by default?
