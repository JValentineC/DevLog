# Test Plan -- Step 09: State Lifting & Props

## New Concept: Testing Component Communication

When you "lift state" to a parent component, data flows down via **props** and events
flow up via **callbacks**. Testing this means verifying that:

1. The parent passes the right data to children
2. Children call the right callbacks when something happens
3. The UI updates after a callback fires

### Mock Functions with `vi.fn()`

When testing a child component, you don't want to render the entire App. Instead,
pass a **mock function** as the callback prop:

```tsx
const mockOnAddEntry = vi.fn()

render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

// ... user fills in the form and clicks submit ...

expect(mockOnAddEntry).toHaveBeenCalledWith({
 title: 'My Entry',
 content: 'Some content'
})
```

`vi.fn()` creates a fake function that records:
- Whether it was called
- How many times it was called
- What arguments it was called with

| Matcher | What It Checks |
|---------|----------------|
| `toHaveBeenCalled()` | Function was called at least once |
| `toHaveBeenCalledTimes(n)` | Function was called exactly n times |
| `toHaveBeenCalledWith(...)` | Function was called with specific arguments |

### Integration Test: Full Data Flow

You can also test the complete flow -- parent renders form, form submits, new entry
appears in the list. This is an **integration test** because multiple components
participate.

---

## Test Script

-> See [NewEntryForm.test.tsx](NewEntryForm.test.tsx) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Open the entries list | Existing entries display | [ ] |
| 3 | Navigate to New Entry, fill in, submit | Form submits | [ ] |
| 4 | Navigate back to entries list | New entry appears in the list | [ ] |
| 5 | Add a second entry | Both new entries appear | [ ] |
| 6 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 7 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 10**, you'll test **complex form fields** -- `<select>` dropdowns and
comma-separated tag inputs with data parsing.
