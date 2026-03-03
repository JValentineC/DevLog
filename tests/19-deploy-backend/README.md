# Test Plan -- Step 19: Deploy Backend

## New Concept: Testing Production Configuration

Deployment steps don't have traditional unit tests -- instead, you verify
**configuration and behavior differences** between environments.

### What to Test in Deployment Steps

| Area | How to Test |
|------|------------|
| Environment variables | Check all required vars are documented |
| Morgan logging mode | `NODE_ENV=production` -> combined format |
| Static file serving | Only in production mode |
| SPA fallback | Non-API routes serve `index.html` |
| Startup guards | Missing env vars -> graceful exit |

### Testing the SPA Fallback

```ts
const res = await request(app).get('/some/react/route')

// In production, non-API routes should return the HTML shell
expect(res.status).toBe(200)
expect(res.headers['content-type']).toContain('text/html')
```

### Testing Startup Guards

```ts
// Save and remove a required variable
const original = process.env.JWT_SECRET
delete process.env.JWT_SECRET

// Starting the server should log an error and exit
// (Hard to test with vitest -- better as a manual check)

process.env.JWT_SECRET = original // Restore
```

### Configuration Checklist

Before deploying, verify these files exist and are correct:

- [ ] `.env.production` has all required variables
- [ ] `package.json` has `"start": "node dist-server/index.js"`
- [ ] `npm run build` succeeds
- [ ] `npm run build:server` succeeds
- [ ] `npm start` boots without errors

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npm run build` | 0 errors | [ ] |
| 2 | `npm run build:server` | Server compiles | [ ] |
| 3 | Start with all env vars | Server boots | [ ] |
| 4 | Remove `JWT_SECRET`, start | Exits with error | [ ] |
| 5 | Remove `DATABASE_URL`, start | Exits with error | [ ] |
| 6 | `GET /api/health` | Returns `{ status: 'ok' }` | [ ] |
| 7 | `GET /some/random/path` (prod mode) | Returns `index.html` | [ ] |
| 8 | Check console output | Morgan logs appear | [ ] |
