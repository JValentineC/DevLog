# Test Plan -- Step 21: Testing and CI

## New Concept: Continuous Integration & Test Infrastructure

This is the step where **testing becomes official** -- you set up the testing
framework, write your first real tests, and configure CI to run them
automatically on every push.

### The App/Server Split Pattern

```
// BEFORE (hard to test):
// index.ts has app setup + app.listen() mixed together

// AFTER (testable):
// app.ts -> Express app (routes, middleware) -- EXPORTED
// index.ts -> Startup (env guard, listen) -- NOT tested
```

This is critical! If `app.listen()` runs when you import the file,
supertest can't work. Split them apart.

### CI Pipeline (`.github/workflows/ci.yml`)

```yaml
- name: Install
 run: npm ci # Clean install (not npm install!)

- name: Generate Prisma
 run: npx prisma generate # Types needed for build

- name: Test
 run: npm test # Vitest runs all *.test.* files

- name: Build
 run: npm run build # TypeScript + Vite compilation
```

### `npm ci` vs `npm install`

| `npm install` | `npm ci` |
|--------------|----------|
| Updates lock file | Reads lock file exactly |
| Might change versions | Reproducible builds |
| For development | For CI/CD |

### Vitest Configuration

```ts
// Inside vite.config.ts:
test: {
 globals: true, // No need to import describe/it/expect
 environment: 'jsdom', // Simulates browser DOM
 setupFiles: './src/test/setup.ts', // Runs before each test file
}
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npm test` | All tests pass | [ ] |
| 2 | `npm run test:watch` | Enters watch mode | [ ] |
| 3 | Modify a component | Watch re-runs test | [ ] |
| 4 | `npm run build` | 0 errors | [ ] |
| 5 | Check `.github/workflows/ci.yml` exists | CI configured | [ ] |
| 6 | Push to GitHub | CI runs automatically | [ ] |
| 7 | CI shows green check | All steps pass | [ ] |
| 8 | Break a test intentionally | CI fails (red X) | [ ] |
