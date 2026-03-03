# Test Plan -- Step 08: Form Validation (Minimal)

## TDD In Practice -- Red, Green, Refactor

This is the step where you experience **Test-Driven Development** for real.

### The Scenario

You need to add validation to the New Entry form:
- Title is required
- Content is required
- Error messages appear when fields are empty
- The submit button is disabled until errors are fixed
- Invalid fields get `aria-invalid="true"` for screen readers

### The TDD Workflow

Instead of writing the code first, you'll **write the tests first**. Here's how:

#### Step 1 -- Red: Write Failing Tests

Copy the test file into your project. Run `npm test`. **All validation tests fail**
because you haven't added validation to `NewEntryForm.tsx` yet. That's expected!

```
 shows title error when submitted empty FAIL
 shows content error when submitted empty FAIL
 disables button when validation fails FAIL
 sets aria-invalid on empty title FAIL
```

#### Step 2 -- Green: Write the Minimum Code

Now implement validation in `NewEntryForm.tsx`:
1. Add a `submitted` state
2. Compute `titleError` and `contentError`
3. Conditionally render error messages
4. Add `aria-invalid` and `aria-describedby`
5. Disable the button when invalid

Run `npm test` after each small change. Watch tests flip from red to green 
one by one. **This is the most satisfying feeling in programming.**

#### Step 3 -- Refactor

Once all tests pass, clean up the code. Rename variables, extract helpers -- anything
that improves readability. Run `npm test` after every change to make sure nothing broke.

### Key Testing Concepts in This Step

| Concept | What It Means |
|---------|--------------|
| **Negative testing** | Testing what happens when things go *wrong* (empty fields) |
| **Accessibility testing** | Verifying `aria-invalid`, `aria-describedby`, `role="alert"` |
| **State-dependent UI** | Testing that UI changes based on component state |
| **`queryByText()`** | Like `getByText()` but returns `null` instead of throwing |

### `getByText` vs `queryByText`

| Method | When element is missing |
|--------|------------------------|
| `getByText()` | No Throws an error (test fails) |
| `queryByText()` | Yes Returns `null` (test continues) |

Use `queryBy...` when you want to assert something **does NOT exist**:

```tsx
expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
```

---

## Test Script

-> See [NewEntryForm.test.tsx](NewEntryForm.test.tsx) -- this is a comprehensive test
suite with detailed comments explaining every concept.

### TDD Challenge

Try this workflow:
1. Copy `NewEntryForm.test.tsx` into your `src/components/` folder
2. Start with the Step 7 version of `NewEntryForm.tsx` (no validation)
3. Run `npm test` -- see failures
4. Add validation code one piece at a time
5. Run `npm test` after each change until all tests pass

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Go to New Entry form, click **Save** with empty fields | Error messages appear | [ ] |
| 3 | Inspect invalid fields | `aria-invalid="true"` is set | [ ] |
| 4 | Check the submit button | Disabled when fields are empty after first submit | [ ] |
| 5 | Fill in only the title | Error shows only for content | [ ] |
| 6 | Fill in all fields | Errors disappear, button enabled | [ ] |
| 7 | Submit the valid form | Submits successfully | [ ] |
| 8 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 9 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 9**, you'll test **component communication** -- how data flows via props
between parent and child components. This is integration testing at its best!
