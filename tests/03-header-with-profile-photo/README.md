# Test Plan -- Step 03: Header with Profile Photo

## New Concept: Testing DOM Attributes

When you add an `<img>` tag, there are **accessibility requirements** you should verify:
- Does the image have an `alt` attribute? (Screen readers need this)
- Does it have `width` and `height`? (Prevents layout shift)
- Is the `src` pointing to the right file?

Tests can check all of these! This is a great example of how tests enforce **code quality
standards** that are easy to forget during manual reviews.

### New Queries

| Query | What It Finds |
|-------|---------------|
| `screen.getByAltText('...')` | An element with a matching `alt` attribute |
| `screen.getByRole('img')` | Any `<img>` element |

### New Matchers

| Matcher | What It Checks |
|---------|----------------|
| `toHaveAttribute('alt', '...')` | The element has a specific attribute value |
| `toHaveAttribute('width', '96')` | Attribute value matches exactly |

### Using `getByRole('img')` vs `getByAltText()`

Both work for images, but `getByRole('img')` is preferred when you want to assert the
*role* of the element (it's an image), and `getByAltText()` is preferred when you want
to assert the *alt text* specifically.

> **Accessibility tip:** An image without `alt` text is invisible to screen readers.
> Writing a test for `alt` ensures you never accidentally deploy an inaccessible image.

---

## Test Script

-> See [App.test.tsx](App.test.tsx) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Verify a `<header>` element exists at the top | Header visible above main content | [ ] |
| 3 | Profile photo is visible in the header | Image renders correctly | [ ] |
| 4 | Inspect the `<img>` tag | Has `alt`, `width`, and `height` attributes | [ ] |
| 5 | Check the image path | Served from `public/` (e.g. `/profile.jpg`) | [ ] |
| 6 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 7 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 4**, you'll learn to test **client-side routing** -- how to simulate navigating
between pages in your tests without a real browser.
