# Test Plan -- Step 23: Tailwind CSS + daisyUI Setup

## New Concept: Testing After a CSS Framework Migration

When you replace custom CSS with Tailwind + daisyUI, the **HTML structure
and functionality shouldn't change** -- only the styling. This is a perfect
use case for **regression testing**.

### What is Regression Testing?

> **Regression test**: A test that verifies existing functionality still
> works after a change. "Did we break anything?"

Your existing tests from steps 2–22 should still pass after adding Tailwind.
If they don't, you have a regression bug. 

### What Changes in This Step

| Before (Custom CSS) | After (Tailwind + daisyUI) |
|---------------------|---------------------------|
| `class="header"` | `class="navbar bg-base-200"` |
| `class="footer"` | `class="footer footer-center"` |
| `class="container"` | `class="container mx-auto"` |
| `style={{ ... }}` | Utility classes |
| `index.css` (~90 lines) | `index.css` (~17 lines) |

### Testing Strategy

```
1. Yes Run ALL existing tests -> They should pass (no functionality change)
2. Yes Visual check -> Does it look right?
3. Yes Accessibility check -> Are ARIA attributes preserved?
4. Yes Build check -> Does Tailwind process correctly?
```

### What NOT to Test

- Don't test that specific CSS classes are applied (`toHaveClass('btn')`)
- Testing CSS class names creates **brittle tests** that break on restyling
- Instead, test **behavior and ARIA attributes**

### Configuration Verification

```ts
// vite.config.ts should have the Tailwind plugin:
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
 plugins: [react(), tailwindcss()], // <- New!
});
```

```css
/* src/index.css should import Tailwind + daisyUI: */
@import "tailwindcss";
@plugin "daisyui";
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | `npm run build` | 0 errors | [ ] |
| 2 | Run ALL existing tests | Still pass Yes | [ ] |
| 3 | Open app in browser | Tailwind styles applied | [ ] |
| 4 | Check daisyUI theme | Light/dark mode works | [ ] |
| 5 | `index.css` is minimal | Just imports, no custom CSS | [ ] |
| 6 | `vite.config.ts` has `tailwindcss()` | Plugin registered | [ ] |
| 7 | No `tailwind.config.js` exists | Using v4 CSS config | [ ] |
| 8 | Tab through the app | Focus rings visible | [ ] |
