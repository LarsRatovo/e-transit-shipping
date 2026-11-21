# E-Transit Express Prisma Service Template

Reusable starter for E-Transit microservices using Express, TypeScript, Prisma ORM, PostgreSQL, Swagger and feature-based modules.

## Create a service

1. Copy this directory into a new repository.
2. Change `name` in `package.json`.
3. Set `SERVICE_NAME` and `DATABASE_URL` in `.env`.
4. Change the PostgreSQL database name and exposed port in `compose.yaml` when several services run locally.
5. Add the service models to `prisma/schema.prisma`.
6. Create the first migration.

```bash
copy .env.example .env
npm install
docker compose up -d
npm run db:migrate -- --name init
npm run dev
```

- API health: `http://localhost:3000/api/v1/health`
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`

## Commands

```bash
npm run dev
npm run build
npm start
npm test
npm run typecheck
npm run db:generate
npm run db:migrate -- --name migration_name
npm run db:migrate:deploy
npm run db:studio
```

## Structure

```text
prisma/                 # Prisma schema and migrations
src/
├── config/             # Environment configuration
├── database/           # Shared Prisma Client
├── docs/               # OpenAPI document
├── middleware/         # Shared Express middleware
├── modules/            # One folder per business feature
├── app.ts              # Express application factory
└── server.ts           # Runtime entry point
tests/
├── integration/
└── unit/
```

## Adding a feature

Keep each feature self-contained under `src/modules/<feature>/`. Use the repository interface to separate business rules from Prisma and to make unit testing easy with an in-memory implementation.

Every API change should also update `src/docs/openapi.ts` and include relevant tests.

## Before publishing as a GitHub template

Move the contents of this directory into a dedicated repository, push it to GitHub, then enable **Template repository** in the repository settings.
