# Test Plan -- Step 04: Basic Routing (One Link)

## New Concept: Testing Client-Side Routing

When your app uses `react-router-dom`, your tests need to simulate navigation. The
key tool is `MemoryRouter` -- a special router that keeps the URL history **in memory**
instead of using the browser's address bar.

### Why MemoryRouter?

Your app uses `HashRouter` (or `BrowserRouter`), but tests run in **jsdom** -- a fake
DOM that doesn't have a real address bar. `MemoryRouter` solves this by letting you
set the initial route and navigate programmatically.

```tsx
import { MemoryRouter } from 'react-router-dom'

render(
 <MemoryRouter initialEntries={['/about']}>
 <App />
 </MemoryRouter>
)
```

| Prop | Purpose |
|------|---------|
| `initialEntries` | Array of URL paths to start from (defaults to `['/']`) |

### Testing User Navigation

To simulate a user clicking a link:

```tsx
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.click(screen.getByRole('link', { name: /about/i }))
```

Then assert what appears after the click:

```tsx
expect(screen.getByText(/About/i)).toBeInTheDocument()
```

> **Important:** When using `userEvent`, your test function must be `async`
> because user interactions are asynchronous (just like real clicks).

### `getByRole('link')` -- Finding Links

`<a>` and `<Link>` elements have the ARIA role `link`. You can find them by their
visible text using the `name` option:

```tsx
screen.getByRole('link', { name: /Go to About/i })
```

---

## Test Script

-> See [App.test.tsx](App.test.tsx) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Navigate to `/#/` (Home) | Home page content displays | [ ] |
| 3 | Navigate to `/#/about` | About page content displays | [ ] |
| 4 | Click the link to switch pages | Content swaps **without a full page reload** | [ ] |
| 5 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 6 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 5**, you'll learn about **unit testing extracted components** -- testing
`Header`, `Footer`, and `AboutSection` in isolation. This is where unit testing
truly shines!
