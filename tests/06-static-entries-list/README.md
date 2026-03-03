# Test Plan -- Step 06: Static Entries List

## New Concept: Testing Data-Driven Rendering

Your app now renders a **list** of entries from a data file. Testing lists introduces
two important techniques:

### 1. `getAllByRole()` -- Finding Multiple Elements

When a query matches more than one element, `getByRole()` throws an error. Use
`getAllByRole()` instead -- it returns an **array** of matching elements.

```tsx
const articles = screen.getAllByRole('article')
expect(articles).toHaveLength(5) // We expect exactly 5 entries
```

### 2. Testing with Known Data

Your entries live in `src/data/entries.ts`. Since this data is static and predictable,
you can assert against specific values:

```tsx
import entries from './data/entries'

expect(articles).toHaveLength(entries.length)
expect(screen.getByText(entries[0].title)).toBeInTheDocument()
```

> **Why import the data in the test?** If someone adds an entry to the data file,
> the test adapts automatically. Hardcoding `5` would break when the list grows.

### The `<article>` Role

The `<article>` HTML element has the ARIA role `article`. Each `EntryCard` wraps its
content in an `<article>`, making it easy to query:

```tsx
screen.getAllByRole('article') // One per entry
```

---

## Test Scripts

-> See [EntryCard.test.tsx](EntryCard.test.tsx) (unit test) and [EntriesList.test.tsx](EntriesList.test.tsx) (integration test)

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Navigate to the entries page | A list of entry cards is visible | [ ] |
| 3 | Each card shows a title, date, and summary | All fields render | [ ] |
| 4 | The correct number of entries appears | Matches `entries.ts` data | [ ] |
| 5 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 6 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 7**, you'll test **user interactions** -- typing into form fields and clicking
buttons. This is where tests start to feel like real user behavior!
