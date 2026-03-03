# Test Plan -- Step 07: Controlled Form Basics

## New Concept: Testing User Interactions

This is where testing gets exciting! You'll simulate a user **typing into inputs**
and **clicking buttons** -- then verify the component responds correctly.

### userEvent -- The User Simulator

`@testing-library/user-event` simulates realistic user behavior:

```tsx
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

// Type into an input
await user.type(screen.getByLabelText(/title/i), 'My First Entry')

// Click a button
await user.click(screen.getByRole('button', { name: /save/i }))
```

### Why `userEvent` Instead of `fireEvent`?

| Feature | `fireEvent` | `userEvent` |
|---------|------------|-------------|
| Fires one event at a time | Yes | Yes |
| Simulates full interaction (focus -> keydown -> input -> keyup) | No | Yes |
| Tests feel like real user behavior | No | Yes |

> **Always prefer `userEvent`**. It catches bugs that `fireEvent` misses because
> it more closely matches what a real browser does.

### Finding Inputs by Label

The best way to find form inputs is by their `<label>`:

```tsx
screen.getByLabelText(/title/i) // Finds <input> connected to <label>Title</label>
screen.getByLabelText(/content/i) // Finds <textarea> connected to <label>Content</label>
```

This works because the `<label htmlFor="entry-title">` is connected to
`<input id="entry-title">`. This is another reason to write accessible HTML!

### Testing Controlled Inputs

A "controlled input" stores its value in React state. To verify it works:

```tsx
const input = screen.getByLabelText(/title/i)
await user.type(input, 'Hello')
expect(input).toHaveValue('Hello') // State was updated!
```

---

## Test Script

-> See [NewEntryForm.test.tsx](NewEntryForm.test.tsx) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Navigate to the New Entry form | Title and Content fields appear | [ ] |
| 3 | Type into both fields | Values update as you type | [ ] |
| 4 | Open browser console, submit the form | Data logged to console | [ ] |
| 5 | After submission, fields are cleared | Inputs reset to empty | [ ] |
| 6 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 7 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 8**, you'll use **TDD (Test-Driven Development)** for the first time!
You'll write tests for form validation *before* the validation code exists,
then watch them go from red to green as you implement the feature.
