# Task Tracker

A small task management app with user accounts. Users sign up, sign in, create
categories, then create/view/filter/search/edit/delete their own tasks —
tasks belong to the user who created them, not to everyone.

## Tech stack used
- **Frontend:** React (Vite), React Router, Axios, plain CSS
- **Backend:** Node.js, Express
- **ORM:** Sequelize
- **Database:** MySQL
- **Auth:** JWT + bcrypt password hashing

This matches the required stack in Section 2 of the exam brief exactly —
no substitutions.

## Project structure
```
task-tracker/
├── backend/     Express API (see backend/README.md for full setup + endpoint list)
└── frontend/    React (Vite) app (see frontend/README.md for setup)
```

## Local setup (quick start)

**Backend:**
```
cd backend
npm install
cp .env.example .env   # fill in your MySQL credentials + a JWT secret
npm run dev
```
Runs on http://localhost:4000. Tables are created automatically via
`sequelize.sync()` on first boot — no manual migration step.

**Frontend:**
```
cd frontend
npm install
cp .env.example .env   # points VITE_API_BASE_URL at the backend
npm run dev
```
Runs on http://localhost:5173.

## API endpoints
See `backend/README.md` for the full endpoint table (auth, categories, tasks
— including query params for filter/search/pagination on `GET /api/tasks`).

## Known limitations / trade-offs
- `sequelize.sync()` is used instead of `sequelize-cli` migrations, to keep
  local setup to one command. Listed in the exam brief as an acceptable
  bonus-challenge upgrade rather than a base requirement.
- No automated tests included (unit tests are listed as an optional bonus).
- No rate limiting on `/api/auth/login` (also listed as optional bonus).
- No sorting UI (bonus challenge) — tasks are ordered newest-first by default.
- Category deletion isn't implemented (not required by the brief) — categories
  can be viewed and added, matching "simple category management" in 4.3.

## Test account
Register your own account via the Sign Up page — no seed data seed script is
included. (Swap this line for real seeded credentials if you add a seeder
before submitting.)
