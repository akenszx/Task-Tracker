# Task Tracker — Frontend

React (Vite) frontend for the Task Tracker app.

## Tech stack
- React + Vite
- React Router (client-side routing, with protected routes)
- Axios (API client, auto-attaches the JWT to requests)
- Plain CSS

## Local setup
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env` — `VITE_API_BASE_URL` should point at your
   running backend (defaults to `http://localhost:4000`).
4. `npm run dev`
5. Open http://localhost:5173

## Project structure

frontend/
├── src/
│ ├── api/client.js Axios instance - attaches JWT, redirects to
│ │ sign in on a 401
│ ├── context/AuthContext.jsx Login state, persists session via localStorage
│ ├── components/ ProtectedRoute, TaskForm, TaskList,
│ │ CategoryManager
│ ├── pages/ SignUp, SignIn, Tasks
│ ├── App.jsx Route definitions
│ └── styles.css
└── vercel.json SPA rewrite so direct/refreshed routes
(e.g. /tasks) don't 404 on Vercel


## Key behaviors
- Session persists across a page refresh (JWT stored in localStorage,
  validated against `/api/auth/me` on load).
- Protected routes redirect signed-out visitors to Sign In.
- Task list supports search by title, filtering by status/category, sorting
  by due date or status, and pagination — all backed by the API's query params.

## Deployment (Vercel)
Deployed at: https://task-tracker-ten-bay.vercel.app

- Root directory set to `/frontend`
- Build command: `npm run build` (auto-detected, Vite preset)
- Environment variable: `VITE_API_BASE_URL` set to the deployed Railway
  backend URL
- `vercel.json` rewrites all paths to `index.html` so React Router can
  handle client-side routing correctly on refresh/direct navigation