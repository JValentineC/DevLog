# Test Plan -- Step 12: Prisma + SQL Server Setup

## New Concept: Testing Database Connectivity

This step adds Prisma ORM and a `/api/health/ready` endpoint. The "ready" endpoint
queries the database to confirm the connection works.

### Mocking the Database in Tests

You have two approaches for testing database code:

| Approach | Pros | Cons |
|----------|------|------|
| **Real test database** | Tests actual SQL queries | Slow, needs DB setup |
| **Mock Prisma client** | Fast, no DB needed | Doesn't test real SQL |

For unit tests, **mocking is preferred** because tests should be fast and independent.
For integration tests, use a real test database.

### Mocking Prisma with vi.mock()

```ts
vi.mock('./lib/prisma', () => ({
 prisma: {
 $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
 entry: {
 findMany: vi.fn(),
 create: vi.fn(),
 }
 }
}))
```

`vi.mock()` replaces an entire module with fake implementations. Every function
becomes a mock that you control.

---

## Test Script

-> See [health.test.ts](health.test.ts) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npx prisma validate` | Schema validation passes | [ ] |
| 2 | `npx prisma generate` | Client generates successfully | [ ] |
| 3 | Start the server | No errors | [ ] |
| 4 | `curl /api/health` | `{ "status": "ok" }` | [ ] |
| 5 | `curl /api/health/ready` | `{ "status": "ready" }` when DB reachable | [ ] |
| 6 | Stop the DB, hit `/api/health/ready` | Error status returned | [ ] |
| 7 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 8 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 13**, you'll write tests for a **full CRUD API** -- the most comprehensive
API testing you'll do in this curriculum!
