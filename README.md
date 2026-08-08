# Task Tracker

A small task management app with user accounts. Users sign up, sign in, create
categories, then create/view/filter/search/edit/delete their own tasks —
tasks belong to the user who created them, not to everyone.

**Live app:** https://task-tracker-ten-bay.vercel.app
**API:** https://task-tracker-production-2d94.up.railway.app

## Tech stack used
- **Frontend:** React (Vite), React Router, Axios, plain CSS
- **Backend:** Node.js, Express
- **ORM:** Sequelize
- **Database:** MySQL (hosted on Railway)
- **Auth:** JWT + bcrypt password hashing
- **Testing:** Jest + Supertest

This matches the required stack in Section 2 of the exam brief — no substitutions.

## Project structure

task-tracker/
├── backend/ Express API - see backend/README.md for setup + endpoints
└── frontend/ React (Vite) app - see frontend/README.md for setup


## Local setup (quick start)

**Backend:**

cd backend
npm install
cp .env.example .env # fill in your MySQL credentials + a JWT secret
npm run dev

Runs on http://localhost:4000. Tables are created automatically via
`sequelize.sync()` on first boot — no manual migration step.

**Frontend:**

cd frontend
npm install
cp .env.example .env # points VITE_API_BASE_URL at the backend
npm run dev

Runs on http://localhost:5173.

## API endpoints
See `backend/README.md` for the full endpoint table, including query params
for filter/search/sort/pagination on `GET /api/tasks`.

## Bonus features included
- **Sorting** — task list can be sorted by due date or status (`?sort=`)
- **Unit tests** — Jest + Supertest covering the health check, registration
  validation, and the tasks route's auth protection (9 passing tests, see
  `backend/tests/`)

## Known limitations / trade-offs
- `sequelize.sync()` is used instead of `sequelize-cli` migrations, to keep
  local setup to one command.
- No rate limiting on `/api/auth/login`.
- Category deletion isn't implemented — categories can be viewed and added,
  matching "simple category management" in 4.3.

## Test account
A test account is available for the reviewer:
- **Email:** test@example.com
- **Password:** pass123

This account has a few sample tasks pre-created across categories so the
app isn't empty on first login.