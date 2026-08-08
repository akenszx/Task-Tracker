# Task Tracker — Backend

Node.js + Express + Sequelize (MySQL) API for the Task Tracker app.

## Tech stack
- Node.js / Express
- Sequelize ORM + MySQL (via `mysql2`), hosted on Railway
- JWT auth (`jsonwebtoken`)
- Passwords hashed with `bcrypt`
- Jest + Supertest for unit tests

## Project structure

backend/
├── app.js Express app (routes, middleware) - no DB connect, no listen
├── server.js Connects to DB, starts the server - imports app.js
├── config/database.js Sequelize connection config
├── models/ User, Category, Task + associations
├── controllers/ Route handler logic
├── routes/ Express routers
├── middleware/auth.js JWT verification middleware
└── tests/ Jest unit tests (see Testing section below)


`app.js` is separated from `server.js` so tests can import the Express app
directly without needing a live database connection.

## Local setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your MySQL credentials and a JWT secret.
4. Create the database: `CREATE DATABASE task_tracker;` in your MySQL client.
5. `npm run dev` (or `npm start`). On boot, the server calls `sequelize.sync()`,
   which creates the `users`, `categories`, and `tasks` tables automatically —
   no manual migration step needed for local dev.
6. Confirm it's running: `GET http://localhost:4000/api/health`

## Testing

npm test

Runs the Jest test suite (9 tests across 3 files):
- `tests/health.test.js` — health check endpoint
- `tests/auth.test.js` — registration validation, duplicate email, success path
- `tests/tasks.test.js` — auth middleware protection on the tasks route

Tests mock the Sequelize models, so they run without needing a database
connection.

## API endpoints
| Method | Endpoint              | Auth | Description |
|--------|-----------------------|------|--------------|
| GET    | /api/health           | No   | Health check |
| POST   | /api/auth/register    | No   | Sign up (name, email, password) |
| POST   | /api/auth/login       | No   | Sign in, returns a JWT |
| GET    | /api/auth/me          | Yes  | Return the current authenticated user |
| GET    | /api/categories       | Yes  | List all categories |
| POST   | /api/categories       | Yes  | Create a category |
| GET    | /api/tasks            | Yes  | List the logged-in user's tasks. Supports `?status=`, `?category_id=`, `?search=`, `?sort=due_date\|status`, `?page=`, `?limit=` |
| GET    | /api/tasks/:id         | Yes  | Get one task (must belong to the user) |
| POST   | /api/tasks             | Yes  | Create a task |
| PUT    | /api/tasks/:id         | Yes  | Update a task (must belong to the user) |
| DELETE | /api/tasks/:id         | Yes  | Delete a task (must belong to the user) |

Authenticated requests require an `Authorization: Bearer <token>` header.

## Known limitations / trade-offs
- Uses `sequelize.sync()` instead of `sequelize-cli` migrations for speed.
- No rate limiting on the login endpoint.

## Deployment (Railway)
Deployed at: https://task-tracker-production-2d94.up.railway.app

1. MySQL is provisioned as a separate Railway service in the same project,
   with public networking enabled for external connections.
2. This backend service's root directory is set to `/backend`.
3. Environment variables (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,
   JWT_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN) are set in the Railway service's
   Variables tab — `CORS_ORIGIN` is set to the deployed Vercel URL.
4. `sequelize.sync()` runs automatically on server start and creates the
   tables in the Railway MySQL instance.
5. Confirm via `GET https://task-tracker-production-2d94.up.railway.app/api/health`.