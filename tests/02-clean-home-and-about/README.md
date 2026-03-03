# Test Plan -- Step 02: Clean Home & About

## New Concept: Your First Test -- "Does It Render?"

The most fundamental test you can write is a **smoke test** (also called a render test).
It answers one question: *"Does my component render without crashing?"*

This might sound trivial, but smoke tests catch:
- Import errors (misspelled file paths)
- Syntax errors in JSX
- Missing props that cause runtime crashes
- Broken context providers

### Anatomy of a Test

```ts
describe('App', () => { // Group related tests together
 it('renders the home page', () => { // Describe one specific behavior
 render(<App />) // Mount the component into a fake DOM
 expect( // Make an assertion
 screen.getByText('Home')
 ).toBeInTheDocument()
 })
})
```

| Piece | Purpose |
|-------|---------|
| `describe()` | Groups tests by feature or component |
| `it()` | Defines a single test case (also called a "spec") |
| `render()` | Mounts your component into a simulated browser DOM (jsdom) |
| `screen` | Provides queries to find elements in the rendered output |
| `expect().toBeInTheDocument()` | Asserts the element exists in the DOM |

### The `screen` Query Hierarchy

React Testing Library encourages querying the way a **user** would find things:

| Priority | Query | When to Use |
|----------|-------|-------------|
| 1st | `getByRole` | Buttons, headings, links -- most accessible |
| 2nd | `getByLabelText` | Form inputs connected to a `<label>` |
| 3rd | `getByText` | Visible text content |
| 4th | `getByAltText` | Images |
| Last resort | `getByTestId` | When nothing else works |

> **Why this order?** It mirrors how real users (and screen readers) find elements.
> Tests that use `getByRole` are less likely to break from CSS or structural changes.

---

## Test Script

Copy `App.test.tsx` into your `src/` folder and run `npm test`.

### `src/App.test.tsx`

-> See [App.test.tsx](App.test.tsx) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Open the page in a browser | No Vite/React logos or counter button remain | [ ] |
| 3 | Verify **Home** section is visible | Home heading and introductory content display | [ ] |
| 4 | Verify **About** section is visible | About heading and description display | [ ] |
| 5 | View page source / inspect DOM | Semantic HTML tags (`<main>`, `<section>`, `<h1>`) | [ ] |
| 6 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 7 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 3**, you'll learn to test **DOM attributes** -- checking that an image has the
right `alt` text, `width`, and `height`. These are real accessibility requirements!
