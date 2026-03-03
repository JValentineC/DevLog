# Test Plan -- Step 24: daisyUI Components

## New Concept: Testing Component Restyling (Visual Regression)

This step replaces custom-styled components with daisyUI components.
Again -- **functionality stays the same**, only the markup changes.

### The daisyUI Component Patterns

| Component | daisyUI Classes | What It Creates |
|-----------|----------------|-----------------|
| `card` + `card-body` | Elevated card with padding | Entry card |
| `btn` + `btn-primary` | Styled button | Submit, actions |
| `badge` + `badge-sm` | Small tag/label | Mood, tags |
| `form-control` + `input` | Styled input group | Form fields |
| `join` + `join-item` | Connected button group | Pagination |
| `toast` + `alert` | Floating notification | Success/error |
| `navbar` | Top navigation bar | Header |

### Testing Strategy: Behavior Over Appearance

```tsx
// No BAD: Testing CSS classes (brittle!)
expect(button).toHaveClass('btn btn-primary'); // Breaks on restyle

// Yes GOOD: Testing behavior and semantics
expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
```

### Why Not Test CSS Classes?

- Classes change frequently during design iterations
- Different daisyUI themes could swap class names
- What matters is: **does the user see a clickable button?**

### What SHOULD Change in Tests

If the HTML structure changes (e.g., `<div>` -> `<article>`), your
role-based queries might need updating:

```tsx
// Before: card was a <div>
screen.getByText('Entry Title');

// After: card is an <article> -- getByRole('article') now works!
screen.getByRole('article');
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npm run build` | 0 errors | [ ] |
| 2 | Run ALL existing tests | Still pass Yes | [ ] |
| 3 | Entry cards use `card` class | Card styling visible | [ ] |
| 4 | Buttons use `btn` class | Button styling visible | [ ] |
| 5 | Tags display as `badge` | Badge styling visible | [ ] |
| 6 | Forms use `form-control` | Input styling visible | [ ] |
| 7 | Pagination uses `join` | Connected buttons | [ ] |
| 8 | Toasts use `alert` | Colored notifications | [ ] |
| 9 | All ARIA attributes preserved | Screen reader works | [ ] |
| 10 | Keyboard navigation works | Tab order correct | [ ] |
