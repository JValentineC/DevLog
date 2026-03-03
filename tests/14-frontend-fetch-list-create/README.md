# Test Plan -- Step 14: Frontend Fetch List + Create

## New Concept: Mocking `fetch()` in Frontend Tests

Your frontend now calls `fetch()` to talk to the API. In tests, you don't want to hit
a real server -- so you **mock the global `fetch` function**.

### Mocking fetch()

```tsx
// Replace the global fetch with a mock
globalThis.fetch = vi.fn()

// Make it return fake data
vi.mocked(fetch).mockResolvedValue({
 ok: true,
 json: async () => [{ id: 1, title: 'Test' }],
} as Response)
```

### Why Mock fetch()?

| Without mocking | With mocking |
|----------------|-------------|
| Needs running backend | No backend needed |
| Slow (network) | Instant |
| Flaky (server could be down) | Always consistent |
| Tests real integration | Tests component logic |

### `waitFor()` -- Waiting for Async Updates

After `fetch()` resolves, React needs time to re-render. Use `waitFor()`:

```tsx
import { waitFor } from '@testing-library/react'

await waitFor(() => {
 expect(screen.getByText('Test Entry')).toBeInTheDocument()
})
```

`waitFor()` retries the assertion until it passes or times out (default: 1 second).

### `findByText()` -- Query + Wait in One

A shorthand for common cases:

```tsx
// These two are equivalent:
await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument())
expect(await screen.findByText('Test')).toBeInTheDocument()
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run build` | 0 errors | [ ] |
| 2 | Start backend, then frontend | Both run | [ ] |
| 3 | Open entries page | Entries load from database | [ ] |
| 4 | "Loading…" appears briefly | Loading state works | [ ] |
| 5 | Submit New Entry form | Entry created via POST | [ ] |
| 6 | New entry appears in list | UI updates | [ ] |
| 7 | Refresh page | Entries persist | [ ] |
| 8 | Run `npm test` | All tests pass Yes | [ ] |
