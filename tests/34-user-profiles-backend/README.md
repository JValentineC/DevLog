# Test Plan -- Step 34: User Profiles Backend

## New Concept: Testing Profile API Endpoints

Profile endpoints introduce **public vs private data** -- some fields
are visible to everyone, others only to the profile owner.

### Public vs Private Fields

| Field | `GET /api/users/:handle` (public) | `PUT /api/users/me/profile` |
|-------|----------------------------------|----------------------------|
| id | Yes | -- |
| username | Yes | -- |
| handle | Yes | -- |
| displayName | Yes | Yes Can update |
| bio | Yes | Yes Can update |
| avatarUrl | Yes | Yes Can update |
| createdAt | Yes | -- |
| email | No **Never exposed publicly** | -- |
| password | No **Never exposed** | -- |

### Testing Public Profile

```ts
const res = await request(app).get('/api/users/jv');

expect(res.status).toBe(200);
expect(res.body).toHaveProperty('handle', 'jv');
expect(res.body).toHaveProperty('displayName');

// SECURITY: Private fields must not leak!
expect(res.body).not.toHaveProperty('email');
expect(res.body).not.toHaveProperty('password');
```

### Testing Profile Update (Authenticated)

```ts
const res = await request(app)
 .put('/api/users/me/profile')
 .set('Authorization', `Bearer ${token}`)
 .send({ displayName: 'JV', bio: 'Building cool stuff' });

expect(res.status).toBe(200);
expect(res.body.displayName).toBe('JV');
```

### Testing Field Length Validation

```ts
// displayName max: 200 characters
const res = await request(app)
 .put('/api/users/me/profile')
 .set('Authorization', `Bearer ${token}`)
 .send({ displayName: 'x'.repeat(201) });

expect(res.status).toBe(400);
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `GET /api/users/:handle` | Returns public profile | [ ] |
| 2 | `GET /api/users/nonexistent` | 404 | [ ] |
| 3 | Response excludes email | Security check | [ ] |
| 4 | Response excludes password | Security check | [ ] |
| 5 | `PUT /api/users/me/profile` with token | Updates profile | [ ] |
| 6 | `PUT` without token | 401 | [ ] |
| 7 | `PUT` with too-long displayName | 400 validation | [ ] |
| 8 | `PUT` with too-long bio (>2000) | 400 validation | [ ] |
| 9 | `npm run build` | 0 errors | [ ] |
| 10 | `npm test` | All tests pass Yes | [ ] |
