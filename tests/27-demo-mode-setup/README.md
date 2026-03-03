# Test Plan -- Step 27: Demo Mode Setup

## New Concept: Testing Multiple Data Sources (Strategy Pattern)

Demo mode introduces a **strategy pattern** -- the same API functions
use different data sources depending on the environment:

```ts
const DEMO = !import.meta.env.VITE_API_URL;

export async function fetchEntries(params) {
 if (DEMO) return DemoData.fetchEntries(params); // localStorage
 return fetch(`${BASE}/entries?...`); // Real API
}
```

### Why Test Demo Mode?

| Scenario | Data Source | Token Type |
|----------|-----------|------------|
| Production (NFSN) | MySQL via API | JWT from server |
| GitHub Pages | localStorage | Fake JWT in DemoData |
| Local dev | MySQL via proxy | JWT from server |

Each path needs its own tests!

### Testing the Demo Data Layer

```ts
describe('DemoData.fetchEntries()', () => {
 it('loads entries from dummy-logs.json on first call', async () => {
 const result = await DemoData.fetchEntries({});
 expect(result.data).toBeInstanceOf(Array);
 expect(result.data.length).toBeGreaterThan(0);
 });

 it('supports pagination', async () => {
 const page1 = await DemoData.fetchEntries({ page: 1, limit: 2 });
 const page2 = await DemoData.fetchEntries({ page: 2, limit: 2 });

 expect(page1.data).toHaveLength(2);
 // Page 2 should have different entries
 expect(page1.data[0].id).not.toBe(page2.data[0].id);
 });

 it('supports tag filtering', async () => {
 const result = await DemoData.fetchEntries({ tag: 'react' });
 result.data.forEach(entry => {
 expect(entry.tags).toContain('react');
 });
 });
});
```

### Testing localStorage Persistence

```ts
it('persists new entries to localStorage', async () => {
 await DemoData.createEntry({ title: 'Test', ... });

 const stored = JSON.parse(localStorage.getItem('jvc_demo_logs') || '[]');
 expect(stored.find(e => e.title === 'Test')).toBeTruthy();
});
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npm run build` (no `VITE_API_URL`) | Build succeeds | [ ] |
| 2 | Open built app | Demo mode activates | [ ] |
| 3 | Entries load from `dummy-logs.json` | Data appears | [ ] |
| 4 | Create an entry | Saves to localStorage | [ ] |
| 5 | Refresh page | New entry persists | [ ] |
| 6 | Filter by tag | In-memory filter works | [ ] |
| 7 | Pagination works | Page controls functional | [ ] |
| 8 | Clear localStorage | Resets to dummy data | [ ] |
