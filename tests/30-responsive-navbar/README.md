# Test Plan -- Step 30: Responsive Navbar

## New Concept: Testing Responsive Layouts

Responsive design uses CSS breakpoints to show/hide elements:
- **Desktop** (`md:flex` / `hidden md:flex`): Full horizontal menu
- **Mobile** (`md:hidden`): Hamburger dropdown

### The Challenge: jsdom Doesn't Have a Viewport

`@testing-library/react` uses jsdom, which does NOT render CSS or have
a real viewport. This means `md:hidden` and `md:flex` have NO effect
in tests -- **both layouts are always in the DOM**.

### Testing Strategy for Responsive Components

```
1. Yes Test that BOTH layouts render (desktop + mobile links)
2. Yes Test that links/buttons have correct labels and targets
3. Yes Test conditional rendering (logged in vs out)
4. No Don't test CSS visibility -- use E2E tools for that
```

### Testing Navigation Links Exist

```tsx
// Both desktop and mobile nav should contain these links
const homeLinks = screen.getAllByRole('link', { name: /home/i });
expect(homeLinks.length).toBeGreaterThanOrEqual(1);

const aboutLinks = screen.getAllByRole('link', { name: /about/i });
expect(aboutLinks.length).toBeGreaterThanOrEqual(1);
```

### Testing Conditional Auth Links

```tsx
// When logged in -> "Logout" visible, "Login" hidden
expect(screen.getByText(/logout/i)).toBeInTheDocument();
expect(screen.queryByText(/log in/i)).not.toBeInTheDocument();

// When logged out -> "Login" visible, "Logout" hidden
expect(screen.getByText(/log in/i)).toBeInTheDocument();
expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
```

### When to Use E2E Testing

For true responsive testing, use Playwright or Cypress:

```ts
// Playwright example:
await page.setViewportSize({ width: 375, height: 812 }); // iPhone
await expect(page.locator('.hamburger-btn')).toBeVisible();
await expect(page.locator('.desktop-menu')).not.toBeVisible();
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Desktop (>768px) | Full horizontal nav | [ ] |
| 2 | Mobile (<768px) | Hamburger icon only | [ ] |
| 3 | Click hamburger | Dropdown menu opens | [ ] |
| 4 | Click a mobile link | Navigates + closes menu | [ ] |
| 5 | Logged in: desktop shows username | Auth state visible | [ ] |
| 6 | Logged in: hamburger shows logout | Mobile auth works | [ ] |
| 7 | Logged out: shows "Log In" | Both layouts update | [ ] |
| 8 | Resize browser smoothly | Layouts switch cleanly | [ ] |
