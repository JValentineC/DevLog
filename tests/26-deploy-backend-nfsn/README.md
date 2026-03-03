# Test Plan -- Step 26: Deploy Backend (NFSN)

## New Concept: Testing Deployment Scripts & Raw SQL

This step makes two big changes:
1. **Deployment** to NearlyFreeSpeech.NET (NFSN)
2. **Raw SQL** replaces Prisma runtime queries

### Testing Raw SQL vs ORM Queries

When switching from Prisma to raw `mysql2`, test that the SQL is correct:

```ts
// Prisma (before):
prisma.entry.findMany({ where: { tags: { contains: tag } } })

// Raw SQL (after):
pool.execute('SELECT * FROM Entry WHERE tags LIKE ?', [`%${tag}%`])
```

### SQL Injection Prevention

With raw SQL, you MUST use **parameterized queries** (`?` placeholders):

```ts
// Yes SAFE -- parameterized (value is escaped by the driver)
pool.execute('SELECT * FROM Entry WHERE id = ?', [id])

// No DANGEROUS -- string concatenation (SQL injection!)
pool.execute(`SELECT * FROM Entry WHERE id = ${id}`)
```

### Testing the Deploy Script

The deploy script (`deploy-nfsn.sh`) is a bash script. You can test it by
verifying each phase produces the expected output:

| Phase | Action | Verify |
|-------|--------|--------|
| 1 | `npm run build` | `dist/` folder exists |
| 2 | `npm run build:server` | `dist-server/` folder exists |
| 3 | `npx prisma generate` | Client generated |
| 4 | `rsync` to NFSN | Files transferred |
| 5 | SSH `npm install` | Remote deps installed |

### Graceful Shutdown

```ts
// The server now handles SIGTERM/SIGINT:
process.on('SIGTERM', async () => {
 await pool.end(); // Close all DB connections
 process.exit(0); // Exit cleanly
});
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npm run build` | 0 errors | [ ] |
| 2 | `npm run build:server` | Server compiles | [ ] |
| 3 | `GET /api/health` | 200 ok | [ ] |
| 4 | `GET /api/health/ready` | DB connected | [ ] |
| 5 | CRUD operations | Raw SQL works | [ ] |
| 6 | Tag filtering | `LIKE` works | [ ] |
| 7 | `run.sh` starts server | No env errors | [ ] |
| 8 | `deploy-nfsn.sh` completes | All 5 phases pass | [ ] |
