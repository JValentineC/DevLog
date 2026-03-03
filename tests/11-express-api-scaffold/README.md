# Test Plan -- Step 11: Express API Scaffold

## New Concept: API Testing with supertest

Welcome to **backend testing**! The tools are different, but the mindset is the same:
write code that automatically verifies your software works.

### What Is supertest?

`supertest` is a library that sends HTTP requests to your Express app **without starting
a real server**. This makes tests fast and isolated.

```ts
import request from 'supertest'
import app from './app'

const response = await request(app).get('/api/health')

expect(response.status).toBe(200)
expect(response.body).toEqual({ status: 'ok' })
```

### Why Not Just Use curl?

| Approach | Pros | Cons |
|----------|------|------|
| `curl` | Quick manual check | Not automated, no assertions |
| Postman | Visual, saveable | Requires running the server |
| **supertest** | Automated, fast, no server needed | Must write code |

> **supertest is for automated testing**. Use curl/Postman for exploration,
> supertest for your test suite.

### Extracting `app` from `index.ts`

To use supertest, you need to **export the Express app separately** from `app.listen()`:

```ts
// src/app.ts -- exports the app (testable)
const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(express.json())
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
export default app

// src/index.ts -- starts the server (not imported in tests)
import app from './app'
app.listen(PORT)
```

This pattern is called **separation of concerns** -- the app configuration is separate
from the server startup.

### Installing supertest

```bash
npm install -D supertest @types/supertest vitest
```

---

## Test Script

-> See [health.test.ts](health.test.ts) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Start the server | Runs on configured port | [ ] |
| 2 | `curl http://localhost:4000/api/health` | `{ "status": "ok" }` | [ ] |
| 3 | Check CORS headers | `Access-Control-Allow-Origin` present | [ ] |
| 4 | Hit a non-existent route (`/api/foo`) | Returns 404 | [ ] |
| 5 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 6 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 12**, you'll add a database and test the `/api/health/ready` endpoint that
verifies database connectivity.
