# Test Plan -- Step 32: Add Email to User

## New Concept: Testing Schema Migrations with New Fields

Adding a new required field (`email`) to an existing model touches every layer.
This is a great exercise in **end-to-end thinking** for a fullstack app.

### The Ripple Effect of a New Field

```
Schema (email column)
 -> DB types (UserRow.email)
 -> Auth routes (register/login/me include email)
 -> Frontend types (AuthUser.email)
 -> API client (register takes email param)
 -> Form UI (email input field)
 -> Demo data (DemoUser.email)
```

### Testing Email Validation

```ts
// Valid email -> accepted
const valid = await request(app)
 .post('/api/auth/register')
 .send({ username: 'test', email: 'test@example.com', password: 'pass12345' })
expect(valid.status).toBe(201)

// Invalid email -> rejected
const invalid = await request(app)
 .post('/api/auth/register')
 .send({ username: 'test2', email: 'not-an-email', password: 'pass12345' })
expect(invalid.status).toBe(400)
```

### Testing Email Uniqueness

```ts
// First register -> success
await request(app)
 .post('/api/auth/register')
 .send({ username: 'user1', email: 'same@test.com', password: 'pass12345' })

// Same email, different username -> 409
const dup = await request(app)
 .post('/api/auth/register')
 .send({ username: 'user2', email: 'same@test.com', password: 'pass12345' })
expect(dup.status).toBe(409)
```

### Testing the Form

```tsx
// Register mode should show email field
await user.click(screen.getByText(/need an account/i));
expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

// Login mode should NOT show email field
await user.click(screen.getByText(/already have an account/i));
expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Register with valid email | 201 success | [ ] |
| 2 | Register with invalid email | 400 error | [ ] |
| 3 | Register with duplicate email | 409 conflict | [ ] |
| 4 | Login response includes email | Field present | [ ] |
| 5 | `/api/auth/me` includes email | Field present | [ ] |
| 6 | Register form shows email input | UI updated | [ ] |
| 7 | Login form hides email input | Conditional render | [ ] |
| 8 | `npm run build` | 0 errors | [ ] |
