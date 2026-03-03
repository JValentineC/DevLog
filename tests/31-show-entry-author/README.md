# Test Plan -- Step 31: Show Entry Author

## New Concept: Testing SQL JOINs & New Data Fields

When you add a field that comes from a **JOIN** (not a single table),
you need to test the full pipeline: SQL -> API -> Type -> Component.

### Testing the SQL JOIN

```ts
// Server now uses LEFT JOIN to get the author:
// SELECT e.*, u.username AS author FROM Entry e LEFT JOIN User u ON e.userId = u.id

const res = await request(app).get('/api/entries');
expect(res.body.data[0]).toHaveProperty('author');
```

### Why LEFT JOIN (not INNER JOIN)?

```
LEFT JOIN -> Returns entries even if userId is NULL (no author)
INNER JOIN -> Skips entries without a userId

Old entries (created before auth existed) have userId = NULL.
A LEFT JOIN ensures they still appear in the list with author = null.
```

### Testing the New Field End-to-End

| Layer | What to Test |
|-------|-------------|
| SQL | JOIN returns `author` column |
| API | Response includes `author` field |
| Type | `Entry.author` is `string \| null` |
| Component | Shows "by {author}" or hides if null |
| toEntry() | Maps `raw.author ?? null` correctly |

### Testing Conditional Rendering

```tsx
// Entry WITH author
render(<EntryCard entry={{ ...mockEntry, author: 'jv' }} />);
expect(screen.getByText(/by jv/i)).toBeInTheDocument();

// Entry WITHOUT author (old entry, pre-auth)
render(<EntryCard entry={{ ...mockEntry, author: null }} />);
expect(screen.queryByText(/by /i)).not.toBeInTheDocument();
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `GET /api/entries` | Each entry has `author` field | [ ] |
| 2 | Entry by logged-in user | Shows "by {username}" | [ ] |
| 3 | Old entry (no userId) | Author hidden, no "by null" | [ ] |
| 4 | Create new entry while logged in | Author shows your name | [ ] |
| 5 | `npm run build` | 0 errors | [ ] |
| 6 | `npm test` | All tests pass Yes | [ ] |
