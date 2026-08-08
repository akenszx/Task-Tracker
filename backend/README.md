# Task Tracker — Backend

Node.js + Express + Sequelize (MySQL) API for the Task Tracker app.

## Tech stack
- Node.js / Express
- Sequelize ORM + MySQL (via `mysql2`)
- JWT auth (`jsonwebtoken`)
- Passwords hashed with `bcrypt`

## Local setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your local MySQL credentials and a JWT secret.
4. Create the database: `CREATE DATABASE task_tracker;` in your MySQL client.
5. `npm run dev` (or `npm start`). On boot, the server calls `sequelize.sync()`,
   which creates the `users`, `categories`, and `tasks` tables automatically —
   no manual migration step needed for local dev.
6. Confirm it's running: `GET http://localhost:4000/api/health`

## API endpoints
| Method | Endpoint              | Auth | Description |
|--------|-----------------------|------|--------------|
| GET    | /api/health           | No   | Health check |
| POST   | /api/auth/register    | No   | Sign up (name, email, password) |
| POST   | /api/auth/login       | No   | Sign in, returns a JWT |
| GET    | /api/auth/me          | Yes  | Return the current authenticated user |
| GET    | /api/categories       | Yes  | List all categories |
| POST   | /api/categories       | Yes  | Create a category |
| GET    | /api/tasks            | Yes  | List the logged-in user's tasks. Supports `?status=`, `?category_id=`, `?search=`, `?page=`, `?limit=` |
| GET    | /api/tasks/:id         | Yes  | Get one task (must belong to the user) |
| POST   | /api/tasks             | Yes  | Create a task |
| PUT    | /api/tasks/:id         | Yes  | Update a task (must belong to the user) |
| DELETE | /api/tasks/:id         | Yes  | Delete a task (must belong to the user) |

Authenticated requests require an `Authorization: Bearer <token>` header.

## Known limitations / trade-offs
- Uses `sequelize.sync()` instead of `sequelize-cli` migrations for speed — see
  the bonus challenges list if migrations are wanted.
- No automated tests included in the base scope.
- No rate limiting on the login endpoint (listed as a bonus challenge).

## Deployment (Railway or similar)
1. Provision a MySQL instance on Railway.
2. Set the environment variables from `.env.example` in the Railway service
   (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, CORS_ORIGIN —
   set CORS_ORIGIN to your deployed Vercel URL).
3. Deploy. `sequelize.sync()` runs automatically on server start and creates
   the tables in the Railway MySQL instance.
4. Confirm `GET https://<your-railway-url>/api/health` responds `{status: "ok"}`.
