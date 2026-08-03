# Documentation index

| Document | Description |
|----------|-------------|
| [../README.md](../README.md) | Product overview, scripts, features |
| [PRD-COMPLETION.md](./PRD-COMPLETION.md) | Full PRD requirement checklist |
| [OPTIONAL.md](./OPTIONAL.md) | AI, share images, integrations, pins |
| [SEO.md](./SEO.md) | SEO, bot blocking, copyright & license |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel deploy + GitHub Actions CI/CD |
| [TESTING.md](./TESTING.md) | Vitest, coverage, writing tests |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design & directory map |

## Quick links

```bash
# Local
npm ci && npm run db:setup && npm run dev

# Quality
npm run lint && npm run typecheck && npm run test:ci

# Ship
git push origin main   # triggers CI + Vercel
```
