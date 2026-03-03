# Test Plan -- Step 25: Prisma MySQL Migration

## New Concept: Testing Database Migration Safety

When migrating from one database to another (SQL Server -> MySQL), your
**tests become your safety net**. If all tests still pass after the
migration, the application behavior is preserved.

### What Changes in a Database Migration

| Area | Before (SQL Server) | After (MySQL) |
|------|-------------------|---------------|
| Prisma provider | `"sqlserver"` | `"mysql"` |
| Connection string | `sqlserver://...` | `mysql://...` |
| Column types | `@db.NVarChar` | `@db.VarChar`, `@db.Text` |
| Charset | Default | `utf8mb4_unicode_ci` |
| Auto-increment | `autoincrement()` | Same (MySQL native) |
| Indexes | None | Yes Now explicit: `idx_entry_tags`, etc. |

### Regression Testing Strategy

```
1. Yes npx prisma generate -> New client generated for MySQL
2. Yes npm run build -> TypeScript still compiles
3. Yes npm test -> All API tests still pass
4. Yes Test CRUD manually -> Create, Read, Update, Delete work
5. Yes Test pagination -> Skip/take work with MySQL
6. Yes Test tag filtering -> 'contains' works the same way
```

### Testing Index Performance

Indexes don't change functionality but improve speed. You can't easily test
for "fast queries" in unit tests, but you can verify indexes exist:

```sql
SHOW INDEX FROM Entry;
-- Should list: idx_entry_tags, idx_entry_created, idx_entry_user
```

### Testing Character Encoding

```ts
// MySQL with utf8mb4 supports emoji 
const res = await request(app)
 .post('/api/entries')
 .set('Authorization', `Bearer ${token}`)
 .send({ title: 'Emoji Test ', content: 'Works! ', mood: 'happy', tags: '' })

expect(res.status).toBe(201)
expect(res.body.title).toBe('Emoji Test ')
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Update `.env` with MySQL connection | Config set | [ ] |
| 2 | `npx prisma generate` | Client generated | [ ] |
| 3 | `npx prisma db push` | Tables created | [ ] |
| 4 | `npm run build` | 0 errors | [ ] |
| 5 | `npm test` | All tests pass | [ ] |
| 6 | Create an entry via API | Works | [ ] |
| 7 | List entries | Pagination works | [ ] |
| 8 | Filter by tag | `contains` works | [ ] |
| 9 | `npx prisma studio` | Browse data | [ ] |
