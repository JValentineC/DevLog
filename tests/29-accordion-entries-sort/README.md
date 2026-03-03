# Test Plan -- Step 29: Accordion Entries & Sort

## New Concept: Testing Collapsible UI (Accordion)

Accordions hide content behind a toggle. Testing them requires verifying
both the **initial state** (collapsed) and the **expanded state**.

### Testing Accordion Toggle

```tsx
// Get the accordion toggle (usually a checkbox input)
const toggle = screen.getByRole('checkbox', { hidden: true });

// Initially collapsed -- content hidden
expect(screen.queryByText(/summary text/i)).not.toBeVisible();

// Click to expand
await user.click(toggle);

// Now content should be visible
expect(screen.getByText(/summary text/i)).toBeVisible();
```

### daisyUI Collapse Pattern

```html
<article class="collapse collapse-arrow join-item">
 <input type="checkbox" />
 <div class="collapse-title">Title + Date + Mood</div>
 <div class="collapse-content">Summary + Tags + Actions</div>
</article>
```

The `<input type="checkbox">` controls visibility via CSS.
In tests, clicking it toggles the content.

### Testing Sort Controls

```tsx
// Select a sort option
await user.selectOptions(
 screen.getByLabelText(/sort by/i),
 'title'
);

// Verify the URL updated 
expect(fetch).toHaveBeenCalledWith(
 expect.stringContaining('sort=title')
);
```

### Testing Sorted Order

```ts
// Verify entries are returned in the correct order
const titles = result.data.map(e => e.title);
const expectedOrder = [...titles].sort((a, b) => a.localeCompare(b));
expect(titles).toEqual(expectedOrder);
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Open entries page | Entries show as accordion | [ ] |
| 2 | Accordion items start collapsed | Only title/date visible | [ ] |
| 3 | Click an accordion | Summary + tags expand | [ ] |
| 4 | Click again | Collapses back | [ ] |
| 5 | Multiple can be open | Independent toggles | [ ] |
| 6 | Change sort field | Entries re-sort | [ ] |
| 7 | Toggle asc/desc | Order reverses | [ ] |
| 8 | Run `npm run build` | 0 errors | [ ] |
