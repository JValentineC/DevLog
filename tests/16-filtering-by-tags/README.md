# Test Plan -- Step 16: Filtering by Tags

## New Concept: Testing URL Query Parameters

Filtering uses **URL search params** (`?tag=react`). In tests, you can set these
via `MemoryRouter`:

```tsx
render(
 <MemoryRouter initialEntries={['/entries?tag=react']}>
 <App />
 </MemoryRouter>
)
```

### Testing API Endpoints with Query Params

```ts
const res = await request(app).get('/api/entries?tag=react')
expect(res.status).toBe(200)
// Assert only matching entries are returned
```

### Testing User-Driven Filtering

```tsx
// Select a tag from the dropdown
await user.selectOptions(screen.getByLabelText(/filter/i), 'react')

// Verify fetch was called with the tag parameter
expect(fetch).toHaveBeenCalledWith(
 expect.stringContaining('tag=react')
)
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `GET /api/entries?tag=react` | Only matching entries | [ ] |
| 2 | `GET /api/entries/tags` | Sorted, de-duplicated array | [ ] |
| 3 | Select a tag in the dropdown | List filters | [ ] |
| 4 | Select "All tags" | Filter clears | [ ] |
| 5 | Click a tag badge on a card | Filter activates | [ ] |
| 6 | Check URL | `?tag=` updates correctly | [ ] |
| 7 | Run `npm run build` | 0 errors | [ ] |
| 8 | Run `npm test` | All tests pass Yes | [ ] |
