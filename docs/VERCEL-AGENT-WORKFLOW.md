# Vercel agent workflow — adab-real-estate-web

How Cursor agents (and you) deploy and inspect this project with the Vercel CLI. **Secrets stay in the Vercel dashboard** — see [USER-NEXT-STEPS.md](./USER-NEXT-STEPS.md) for env var names.

## Prerequisites (one-time, on your machine)

1. **Node.js** — same version you use for local dev.
2. **Vercel CLI** — use via `npx` (no global install required):
   ```bash
   npx vercel --version
   ```
3. **Login** (interactive — agents cannot do this for you):
   ```bash
   npx vercel login
   npx vercel whoami
   ```
   You should see your Vercel username (e.g. `adab-tech`).

4. **Link this repo** (creates `.vercel/project.json`, gitignored):
   ```bash
   cd path/to/adab-real-estate-web
   npx vercel link --yes --project adab-real-estate-web --scope <TEAM_OR_USER_SCOPE>
   ```
   If link only creates `repo.json` and not `project.json`, remove `.vercel` and run `npx vercel link` interactively, or pass the project ID from the Vercel dashboard:
   ```bash
   npx vercel link --yes --project <PROJECT_ID> --scope <SCOPE>
   ```
   **Verify:** `.vercel/project.json` exists and `npx vercel pull --yes --environment=production` succeeds.

Known production project (from Git integration): **adab-real-estate-web** — ID `prj_nj0aYgDeR2qvw0FqmKU9YWOrA6fR` (team scope in Vercel UI).

## What agents can do after link

| Task | Command |
|------|---------|
| Pull env template (no secret values in repo) | `npx vercel env pull .env.local` |
| Sync missing vars from `.env.local` to Vercel | `.\scripts\vercel-sync-env.ps1` (never logs values) |
| Production deploy | `npx vercel deploy --prod` |
| Preview deploy | `npx vercel deploy` |
| Inspect latest deployment | `npx vercel ls` |

Agents **cannot** complete `vercel login` or first-time `vercel link` without your session. Use a **Vercel token** only in CI or if you explicitly configure `VERCEL_TOKEN` in the environment (never commit it).

## Git deploy vs CLI

- **Default:** pushes to `master` on `adab-tech/adab-real-estate-web` trigger Vercel Git deployments (see [DEPLOYMENT.md](./DEPLOYMENT.md)).
- **CLI:** use when you need a redeploy without a commit or to debug build logs locally after `vercel pull`.

## Checklist before calling production “done”

- [ ] Vercel env vars set (see [USER-NEXT-STEPS.md](./USER-NEXT-STEPS.md))
- [ ] Supabase SQL scripts applied (same doc)
- [ ] `.vercel/project.json` present locally after `vercel link`
- [ ] `npx vercel whoami` works
- [ ] Smoke tests at `https://adab.ng` (same doc §3)

## Troubleshooting

- **`vercel` not found** — use `npx vercel …` from the project root.
- **Project Settings could not be retrieved** — delete `.vercel`, re-run `npx vercel link` while logged into the team that owns the project.
- **Deploy succeeds but site misbehaves** — missing env vars; redeploy after updating Vercel settings.
