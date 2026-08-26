# Wedding Point

Creating Beautiful Weddings, Making Memories Last Forever.

Wedding Point is a MERN-stack wedding planning and event services platform. Visitors explore services, packages, galleries, and request quotes. Admins manage content and wedding inquiries from a protected dashboard.

This repository is in **Phase 11** (complete): testing, bug fixes, and production preparation are in place.

## Technology stack

| Layer | Stack |
| --- | --- |
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Uploads | Multer |
| Security | Helmet, CORS, HPP, rate limiting, sanitization, validation |

Ports:

- Frontend (Vite): `http://localhost:5173`
- Backend API: `http://localhost:4000`

## Folder structure

```
wedding-point/
├── client/                 # React (Vite)
│   └── src/
├── server/                 # Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/            # smoke-test.js
│   ├── utils/
│   ├── uploads/
│   └── server.js
├── package.json            # Root convenience scripts
├── .env.example
├── .gitignore
└── README.md
```

## Environment variables

### Backend (`server/.env`)

Copy `server/.env.example` to `server/.env`.

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret (32+ chars in production) |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `PORT` | API port (default `4000`) |
| `CLIENT_URL` | Frontend origin for CORS |
| `NODE_ENV` | `development` or `production` |
| `ADMIN_EMAIL` | Seed admin email |
| `ADMIN_PASSWORD` | Seed admin password |
| `ADMIN_NAME` | Seed admin display name |
| `SERVE_CLIENT` | `true` to serve `client/dist` from Express |

Never commit `server/.env`.

### Frontend (`client/.env`, optional)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Absolute API base (e.g. `https://api.example.com/api`). Leave empty in local Vite to use the `/api` proxy. |

## MongoDB setup

1. Install and start [MongoDB Community](https://www.mongodb.com/docs/manual/installation/) locally, **or** use MongoDB Atlas.
2. Default local URI: `mongodb://127.0.0.1:27017/wedding-point`
3. This project often uses Docker: `docker run -d --name wedding-point-mongo -p 27017:27017 mongo:7`

## Installation

Requires Node.js 18 or later.

From the repo root:

```bash
npm run install:all
```

Or separately:

```bash
cd server && npm install
cd ../client && npm install
```

## How to run (development)

Start MongoDB, then:

```bash
# Terminal 1 — API
npm run dev:server

# Terminal 2 — Vite
npm run dev:client
```

Health check: `GET http://localhost:4000/api/health`

## Admin account setup

```bash
npm run seed
```

Default local credentials (override in `server/.env`):

- Email: `admin@weddingpoint.local`
- Password: `Admin@12345`

Change these before any real deployment.

Admin UI: `http://localhost:5173/admin/login`

## API endpoints

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| POST | `/api/auth/login` | Public (rate limited) |
| GET | `/api/auth/me` | Admin |
| GET | `/api/services` | Public |
| GET | `/api/services/:id` | Public |
| POST/PUT/DELETE | `/api/services` | Admin |
| GET | `/api/packages` | Public |
| GET | `/api/packages/:id` | Public |
| POST/PUT/DELETE | `/api/packages` | Admin |
| GET | `/api/gallery` | Public |
| POST/PUT/DELETE | `/api/gallery` | Admin |
| GET | `/api/testimonials` | Public |
| POST/PUT/DELETE | `/api/testimonials` | Admin |
| POST | `/api/inquiries` | Public (rate limited) |
| GET/PUT/DELETE | `/api/inquiries` | Admin |
| GET | `/api/inquiries/stats` | Admin |
| GET | `/api/settings` | Public |
| PUT | `/api/settings` | Admin |
| GET | `/api/settings/dashboard` | Admin |

Uploaded files are served from `/uploads/...`.

## Testing

With the API running and the database seeded:

```bash
npm run smoke
```

This checks health, public content routes, admin login, `/auth/me`, inquiry stats, auth protection, and inquiry validation.

Client production build:

```bash
npm run build
```

## Production build & run

1. Build the frontend:

```bash
npm run build
```

2. Set production env in `server/.env`:

```
NODE_ENV=production
MONGO_URI=<atlas-or-hosted-uri>
JWT_SECRET=<long-random-secret-32+-chars>
CLIENT_URL=https://your-frontend-origin
SERVE_CLIENT=true
```

3. Start the API (optionally serving `client/dist`):

```bash
npm run start:server
```

When `SERVE_CLIENT=true` and `client/dist` exists, Express serves the SPA and still mounts `/api` and `/uploads`. Leave `VITE_API_URL` empty so the browser calls same-origin `/api`.

Alternatively, host `client/dist` on a static CDN/host and leave `SERVE_CLIENT=false`, pointing `CLIENT_URL` at that origin and setting `VITE_API_URL` to your API base before building.

## Production checklist

- [ ] Strong unique `JWT_SECRET` (not the development placeholder)
- [ ] Production `MONGO_URI` with auth and network restrictions
- [ ] Unique `ADMIN_EMAIL` / `ADMIN_PASSWORD` (re-seed or update in DB)
- [ ] Correct `CLIENT_URL` (CORS) when frontend is on a separate origin
- [ ] `NODE_ENV=production`
- [ ] HTTPS terminated at your host/proxy
- [ ] `npm run build` and `npm run smoke` against the staging API
- [ ] Upload disk space / backups for `server/uploads`
- [ ] Confirm robots.txt / sitemap.xml URLs match the live domain

## Deployment (outline)

1. Provision MongoDB (Atlas or self-hosted).
2. Build the client (`npm run build`).
3. Deploy the API with production environment variables.
4. Either set `SERVE_CLIENT=true` on the API host, or deploy `client/dist` separately and configure CORS + `VITE_API_URL`.
5. Run smoke checks against the live `/api` base URL: `API_URL=https://your-api/api npm run smoke`.

## Phase status

| Phase | Status |
| --- | --- |
| 1 Scaffold | Complete |
| 2 Backend models & APIs | Complete |
| 3 React shell | Complete |
| 4 Public site | Complete |
| 5 Quote / inquiry | Complete |
| 6 Package calculator | Complete |
| 7 Admin auth | Complete |
| 8 Dashboard | Complete |
| 9 Admin CRUD | Complete |
| 10 Polish (SEO, a11y, perf, security) | Complete |
| 11 Testing & production prep | Complete |
