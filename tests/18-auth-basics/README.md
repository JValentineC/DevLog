# Test Plan -- Step 18: Auth Basics

## New Concept: Testing Authentication & Security

Authentication is one of the **most critical areas to test** -- bugs here
expose user data. This step introduces testing JWT auth, password hashing,
and protected routes.

### Testing Auth Endpoints

```ts
// Register a new user
const res = await request(app)
 .post('/api/auth/register')
 .send({ username: 'testuser', password: 'password123' })

expect(res.status).toBe(201)
expect(res.body).toHaveProperty('token')
// NEVER return the password hash!
expect(res.body).not.toHaveProperty('password')
```

### Testing Protected Routes

```ts
// Without token -> 401
const res = await request(app).post('/api/entries').send({ title: 'No auth' })
expect(res.status).toBe(401)

// With token -> 201
const authed = await request(app)
 .post('/api/entries')
 .set('Authorization', `Bearer ${token}`) // <- set() adds headers
 .send({ title: 'Authed!', content: 'Works' })
expect(authed.status).toBe(201)
```

### What to ALWAYS Test in Auth

| Test | Why |
|------|-----|
| Register with short password -> 400 | Enforce minimum length |
| Register duplicate username -> 409 | Prevent conflicts |
| Login with wrong password -> 401 | Verify rejection |
| Error message is generic | Prevent username enumeration |
| Token missing -> 401 | Protect endpoints |
| Token expired/invalid -> 401 | Verify JWT validation |
| Password NOT in response body | Never leak hashes |

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `POST /api/auth/register` with valid data | 201 + token | [ ] |
| 2 | Register with same username | 409 Conflict | [ ] |
| 3 | Register with short password (<8) | 400 error | [ ] |
| 4 | `POST /api/auth/login` with correct creds | 200 + token | [ ] |
| 5 | Login with wrong password | 401, generic message | [ ] |
| 6 | `GET /api/auth/me` with valid token | 200 + user | [ ] |
| 7 | `GET /api/auth/me` without token | 401 | [ ] |
| 8 | `POST /api/entries` without token | 401 | [ ] |
| 9 | `POST /api/entries` with valid token | 201 | [ ] |
| 10 | Run `npm test` | All tests pass Yes | [ ] |
