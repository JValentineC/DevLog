# Test Plan -- Step 13: CRUD Entries

## New Concept: Testing a Full CRUD API

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete. These are the four fundamental
database operations, and they map directly to HTTP methods:

| CRUD | HTTP Method | Endpoint | Status Code |
|------|-------------|----------|-------------|
| Create | `POST` | `/api/entries` | `201 Created` |
| Read (all) | `GET` | `/api/entries` | `200 OK` |
| Read (one) | `GET` | `/api/entries/:id` | `200 OK` |
| Update | `PUT` | `/api/entries/:id` | `200 OK` |
| Delete | `DELETE` | `/api/entries/:id` | `204 No Content` |

### Testing Every Path

For each endpoint, test at least:
1. **Happy path** -- valid request -> expected response
2. **Validation error** -- missing required fields -> 400
3. **Not found** -- nonexistent ID -> 404
4. **Invalid input** -- wrong data type -> 400

This is called **boundary testing** -- checking behavior at the edges of valid input.

### supertest with POST/PUT

```ts
// POST with JSON body
const res = await request(app)
 .post('/api/entries')
 .send({ title: 'Test', summary: 'Content', mood: 'happy', tags: 'testing' })

expect(res.status).toBe(201)

// PUT with JSON body
const res = await request(app)
 .put('/api/entries/1')
 .send({ title: 'Updated', summary: 'New content', mood: 'curious', tags: '' })

expect(res.status).toBe(200)
```

### The `.send()` Method

`.send()` sets the request body and automatically sets `Content-Type: application/json`.

### `beforeEach()` and `afterEach()` -- Test Lifecycle Hooks

When tests modify data (create, update, delete), you need to **reset the state**
between tests so they don't interfere with each other:

```ts
beforeEach(() => {
 // Reset all mocks before each test
 vi.clearAllMocks()
})
```

---

## Test Script

-> See [entries.test.ts](entries.test.ts) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `POST /api/entries` with valid body | 201 + entry JSON | [ ] |
| 2 | `POST /api/entries` with missing fields | 400 + error | [ ] |
| 3 | `GET /api/entries` | 200 + array | [ ] |
| 4 | `GET /api/entries/:id` valid | 200 + entry | [ ] |
| 5 | `GET /api/entries/999` | 404 | [ ] |
| 6 | `PUT /api/entries/:id` valid | 200 + updated | [ ] |
| 7 | `DELETE /api/entries/:id` | 204 | [ ] |
| 8 | `DELETE /api/entries/999` | 404 | [ ] |
| 9 | `GET /api/entries/abc` | 400 | [ ] |
| 10 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 14**, you'll switch back to frontend testing -- testing `fetch()` calls with
mocked API responses.
