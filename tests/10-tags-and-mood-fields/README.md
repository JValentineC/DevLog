# Test Plan -- Step 10: Tags & Mood Fields

## New Concept: Testing Complex Form Inputs

Step 10 adds two new form fields:
- A **`<select>` dropdown** for mood
- A **text input** for comma-separated tags

These introduce new testing techniques.

### Testing `<select>` Dropdowns

```tsx
// Find the select by its label
const moodSelect = screen.getByLabelText(/mood/i)

// Use selectOptions() to choose a value
await user.selectOptions(moodSelect, 'happy')

// Verify the selected value
expect(moodSelect).toHaveValue('happy')
```

`userEvent.selectOptions()` is specifically designed for `<select>` elements. It
simulates a user opening the dropdown and choosing an option.

### Testing Comma-Separated Input

Tags are entered as a comma-separated string like `"react, hooks, state"` and then
split into an array. You should test:
1. The raw input accepts the comma string
2. The resulting data contains the parsed array

```tsx
await user.type(screen.getByLabelText(/tags/i), 'react, hooks, state')

// After submit, the callback should receive parsed tags
expect(mockOnAddEntry).toHaveBeenCalledWith(
 expect.objectContaining({
 tags: ['react', 'hooks', 'state']
 })
)
```

### Testing Default Values

`<select>` elements often have a default option. Verify it:

```tsx
expect(screen.getByLabelText(/mood/i)).toHaveValue('') // No mood selected
// OR
expect(screen.getByLabelText(/mood/i)).toHaveValue('happy') // Default mood
```

---

## Test Script

-> See [NewEntryForm.test.tsx](NewEntryForm.test.tsx) in this folder.

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Navigate to New Entry form | Mood dropdown and Tags input visible | [ ] |
| 3 | Select a mood from the dropdown | Value selected | [ ] |
| 4 | Type comma-separated tags | Input accepts text | [ ] |
| 5 | Submit with mood and tags | Entry created with all fields | [ ] |
| 6 | View entry in list | Mood and tags display on card | [ ] |
| 7 | Verify timestamp | Created date/time appears | [ ] |
| 8 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 9 | Run `npm test` | All tests pass Yes | [ ] |

---

## Frontend Testing Milestone!

Congratulations -- you've completed the **frontend testing foundations**! Here's what
you've learned across Steps 1–10:

| Step | Concept |
|------|---------|
| 01 | Why testing matters, TDD theory, tooling setup |
| 02 | Render tests, `describe`/`it`/`expect`, `screen` queries |
| 03 | Attribute assertions, accessibility testing |
| 04 | MemoryRouter, navigation testing, async tests |
| 05 | Unit vs integration tests, Testing Pyramid |
| 06 | List rendering, `getAllByRole`, test fixtures |
| 07 | `userEvent`, typing, clicking, `vi.spyOn` |
| 08 | TDD Red-Green-Refactor, negative testing, `queryBy` |
| 09 | Mock functions (`vi.fn`), callback testing |
| 10 | Select dropdowns, data parsing, complex inputs |

Starting in **Step 11**, you'll learn to test a **backend API** with Express and
supertest. The skills are different but the mindset is the same!
