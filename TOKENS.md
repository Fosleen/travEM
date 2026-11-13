# Token configuration

Commit variable names and empty examples only. Configure actual values separately
on each machine or hosting service; Git push does not copy local env files.

| Variable | Local development | Production |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | `client/.env.local` | Frontend hosting environment, before building |
| `SERPAPI_API_KEY` | `backend/.env` | Backend server environment or its `backend/.env` |

Both local env files are ignored by Git. Restart the local app after changes.

## Frontend

The local frontend is linked to the Vercel project `travem`. On Vercel, open
Project Settings > Environment Variables and add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
for Production and any Preview environments that need the map. Redeploy afterwards.
If another frontend host is used, set the same variable in its build environment.

Next.js embeds `NEXT_PUBLIC_` values in browser JavaScript at build time. Use a
public Mapbox token (`pk.`), never a secret token (`sk.`), for this variable.
Moving it to env configuration does not hide it from visitors.

## Backend

The backend already reads `SERPAPI_API_KEY` from `process.env` and loads `.env`
through dotenv. On the server, set it in the backend environment or add it to
`backend/.env` without committing that file. Restart the backend after changes;
for the PM2 deployment shown in this repository, use `pm2 restart <app-name> --update-env`.

SerpApi is server-only: do not put its key in a `NEXT_PUBLIC_` variable or in
frontend hosting settings. The same separation applies to other private backend
API keys.
