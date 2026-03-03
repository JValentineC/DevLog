# Test Plan -- Step 20: Deploy Frontend (GitHub Pages)

## New Concept: Testing Build Configuration

Frontend deployment tests focus on verifying the **build output**
and **environment variable behavior** rather than testing components.

### Key Configuration: `VITE_BASE` and `VITE_API_URL`

```ts
// vite.config.ts uses VITE_BASE for the base path:
base: env.VITE_BASE ?? '/'

// API files use VITE_API_URL for the backend:
const BASE = `${import.meta.env.VITE_API_URL ?? ''}/api`
```

| Env Var | Dev | Production (GH Pages) |
|---------|-----|----------------------|
| `VITE_BASE` | `/` (default) | `/DevLog/` |
| `VITE_API_URL` | empty (uses Vite proxy) | `https://your-backend.com` |

### Testing Build Output

After `npm run build`, verify the `dist/` folder:

```powershell
# Check that index.html references the correct base
Select-String -Path dist/index.html -Pattern '/DevLog/'

# Check that assets are generated
Test-Path dist/assets/*.js
```

### Testing Environment Switching

```ts
// You can test the API URL logic directly:
const getApiBase = (envUrl?: string): string =>
 `${envUrl ?? ''}/api`;

expect(getApiBase()).toBe('/api'); // Dev
expect(getApiBase('https://api.example.com')).toBe( // Prod
 'https://api.example.com/api'
);
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npm run build` | 0 errors | [ ] |
| 2 | Check `dist/index.html` | Correct `<base>` path | [ ] |
| 3 | `npm run deploy` | Publishes to `gh-pages` branch | [ ] |
| 4 | Visit GH Pages URL | App loads | [ ] |
| 5 | Navigate to `/about` and refresh | SPA routing works | [ ] |
| 6 | API calls reach the backend | Entries load | [ ] |
| 7 | `.env.production` has `VITE_BASE` | Config correct | [ ] |
