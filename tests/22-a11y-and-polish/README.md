# Test Plan -- Step 22: Accessibility (a11y) and Polish

## New Concept: Accessibility Testing

Accessibility (a11y) ensures your app works for everyone -- including people
using screen readers, keyboard navigation, or high-contrast displays.

### Why Test Accessibility?

- **Legal**: ADA/Section 508 compliance is required for many organizations
- **Users**: ~15% of the world's population has some form of disability
- **Quality**: a11y improvements often make apps better for ALL users

### Key ARIA Patterns to Test

| Pattern | ARIA Role/Attribute | Test Query |
|---------|-------------------|------------|
| Skip link | Visible on focus | `getByText(/skip to main/i)` |
| Navigation | `aria-label="Main navigation"` | `getByRole('navigation')` |
| Main content | `id="main-content"` | `getByRole('main')` |
| Toast success | `role="status"` + `aria-live="polite"` | `getByRole('status')` |
| Toast error | `role="alert"` + `aria-live="assertive"` | `getByRole('alert')` |
| Error focus | `tabIndex={-1}` + ref focus | Manual or e2e test |

### Testing Skip Links

```tsx
const skipLink = screen.getByText(/skip to main content/i);

// Skip link should have an href pointing to #main-content
expect(skipLink).toHaveAttribute('href', '#main-content');

// The main element should have the matching id
expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
```

### Testing Keyboard Navigation

```tsx
// Tab to the skip link (it's the first focusable element)
await user.tab();
expect(screen.getByText(/skip/i)).toHaveFocus();

// Tab through navigation links
await user.tab();
expect(screen.getByRole('link', { name: /home/i })).toHaveFocus();
```

### Focus-Visible Styles

```css
/* Test that :focus-visible outline is visible */
:focus-visible {
 outline: 3px solid #6eb3f7;
 outline-offset: 2px;
}
```

Visual focus indicators can be tested with E2E tools like Playwright,
but NOT with jsdom (it doesn't render CSS).

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Press Tab repeatedly | Focus moves logically | [ ] |
| 2 | First Tab lands on skip link | Skip link visible | [ ] |
| 3 | Press Enter on skip link | Focus jumps to main | [ ] |
| 4 | Navigate with keyboard only | All features accessible | [ ] |
| 5 | Screen reader announces nav | `aria-label` works | [ ] |
| 6 | Error toast is announced | `aria-live="assertive"` | [ ] |
| 7 | Visit `/nonexistent` | 404 page renders | [ ] |
| 8 | Focus ring visible on buttons | `:focus-visible` works | [ ] |
| 9 | Run axe browser extension | 0 critical issues | [ ] |
| 10 | Run `npm test` | All tests pass Yes | [ ] |
