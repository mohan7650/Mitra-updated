# Mitra backend (NestJS + Prisma + Postgres)

## Setup

```bash
cd backend
cp .env.example .env      # edit secrets as needed
docker compose up -d      # starts Postgres on localhost:5432
npm install
npx prisma migrate dev --name init
npm run dev                # http://localhost:4000
```

## Endpoints

- `POST /auth/register` — `{ firstName, lastName, email, password }`
- `POST /auth/login` — `{ email, password }`
- `POST /auth/refresh` — reads `refresh_token` httpOnly cookie, returns a new access token
- `POST /auth/logout` — revokes the refresh token, clears the cookie
- `GET /users/me` — requires `Authorization: Bearer <accessToken>`

Access tokens are short-lived (15m) and returned in the JSON response body only —
the frontend keeps them in memory. Refresh tokens are long-lived (7d), stored
hashed in the `refresh_tokens` table, and set as an `httpOnly`, `SameSite=Lax`
cookie scoped to `/auth` so plain JavaScript can't read them.
