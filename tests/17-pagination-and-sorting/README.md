# Test Plan -- Step 17: Pagination & Sorting

## New Concept: Testing Paginated API Responses

Pagination changes the API response shape from a simple array to an **envelope**:

```json
{
 "data": [...],
 "page": 1,
 "limit": 10,
 "total": 47,
 "totalPages": 5
}
```

### Testing the API Envelope

```ts
const res = await request(app).get('/api/entries?page=2&limit=5')

expect(res.body).toHaveProperty('data')
expect(res.body).toHaveProperty('page', 2)
expect(res.body).toHaveProperty('totalPages')
expect(res.body.data).toHaveLength(5) // or fewer on the last page
```

### Testing Sort Order

```ts
const res = await request(app).get('/api/entries?sort=title&order=asc')

const titles = res.body.data.map((e: any) => e.title)
const sorted = [...titles].sort()
expect(titles).toEqual(sorted) // Already in ascending order
```

### Testing Invalid Sort Params

```ts
const res = await request(app).get('/api/entries?sort=password')
// Should default to createdAt, not expose sensitive fields
expect(res.status).toBe(200)
```

### Frontend: Testing Pagination Controls

```tsx
// Click "Next" button
await user.click(screen.getByRole('button', { name: /next/i }))

// Verify the URL updated
expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=2'))
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `GET /api/entries` | Returns envelope with `data`, `page`, `total` | [ ] |
| 2 | `GET /api/entries?page=2&limit=5` | Second page, 5 items | [ ] |
| 3 | `GET /api/entries?sort=title&order=asc` | Sorted A–Z | [ ] |
| 4 | `GET /api/entries?sort=password` | Defaults to `createdAt` | [ ] |
| 5 | Pagination buttons hide with ≤1 page | UX check | [ ] |
| 6 | Click Next/Previous | URL `?page=` updates | [ ] |
| 7 | Change sort dropdown | Re-fetches correctly | [ ] |
| 8 | Run `npm run build` | 0 errors | [ ] |
| 9 | Run `npm test` | All tests pass Yes | [ ] |
