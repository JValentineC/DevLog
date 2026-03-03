# Test Plan -- Step 35: User Profiles Frontend

## New Concept: Testing a Full Feature Page (Profile)

This is the capstone testing step! The ProfilePage combines everything
you've learned: **routing**, **data fetching**, **conditional rendering**,
**forms**, **auth context**, and **accessibility**.

### Testing the Profile Page

```tsx
// Visit a profile by handle
render(
 <MemoryRouter initialEntries={['/u/jv']}>
 <App />
 </MemoryRouter>
);

// Profile loads
expect(await screen.findByText('JV the Dev')).toBeInTheDocument();
expect(screen.getByText('@jv')).toBeInTheDocument();
```

### Testing "Is Owner" Logic

```tsx
// When viewing YOUR OWN profile -> Edit button visible
// When viewing SOMEONE ELSE'S profile -> Edit button hidden

// Owner viewing their profile:
expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();

// Visitor viewing someone else's:
expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
```

### Testing the Edit Form

```tsx
// Click edit -> form appears
await user.click(screen.getByRole('button', { name: /edit profile/i }));

// Update display name
const nameInput = screen.getByLabelText(/display name/i);
await user.clear(nameInput);
await user.type(nameInput, 'New Name');

// Save
await user.click(screen.getByRole('button', { name: /save/i }));

// Form closes, new name displays
await waitFor(() => {
 expect(screen.getByText('New Name')).toBeInTheDocument();
 expect(screen.queryByLabelText(/display name/i)).not.toBeInTheDocument();
});
```

### Testing Avatar Fallback

```tsx
// With avatarUrl -> shows image
render(<ProfileCard profile={{ ...mockProfile, avatarUrl: 'https://...' }} />);
expect(screen.getByRole('img')).toBeInTheDocument();

// Without avatarUrl -> shows initial letter
render(<ProfileCard profile={{ ...mockProfile, avatarUrl: null }} />);
expect(screen.getByText('J')).toBeInTheDocument(); // First letter of name
```

---

## Curriculum Recap -- What You've Learned

Congratulations! Over 35 steps, you've learned:

| Steps | Testing Concepts |
|-------|-----------------|
| 1 | What is testing, TDD, regression testing |
| 2-5 | Render tests, DOM queries, routing tests, unit testing |
| 6-10 | Data-driven tests, form testing, TDD demo, mocks, complex inputs |
| 11-13 | API testing with supertest, DB mocking, CRUD tests |
| 14-17 | Fetch mocking, optimistic updates, pagination, parameterized tests |
| 18 | Auth testing, security assertions |
| 19-20 | Deployment verification |
| 21 | CI/CD, test infrastructure |
| 22 | Accessibility testing |
| 23-24 | Regression testing after restyling |
| 25-26 | Migration testing, raw SQL testing |
| 27-28 | Strategy pattern, localStorage testing, auth forms |
| 29-30 | Accordion testing, responsive testing |
| 31-33 | SQL JOIN testing, schema migration testing, data transformations |
| 34-35 | Profile API testing, end-to-end feature testing |

### Key Takeaways

1. **Test behavior, not implementation** -- query by role/label, not CSS classes
2. **Mock at the boundaries** -- fetch, database, browser APIs
3. **Test both happy and sad paths** -- success AND error cases
4. **Security tests are non-negotiable** -- never leak passwords or private data
5. **Regression tests protect you** -- run them after every change
6. **TDD gives confidence** -- write the test first, then the code

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Visit `/u/:handle` | Profile page loads | [ ] |
| 2 | View own profile | "Edit Profile" button visible | [ ] |
| 3 | View other's profile | Edit button hidden | [ ] |
| 4 | Click Edit | Form appears with current values | [ ] |
| 5 | Update display name | Saves and displays new name | [ ] |
| 6 | Update bio | Saves and displays new bio | [ ] |
| 7 | Cancel edit | Form closes, no changes | [ ] |
| 8 | Profile without avatar | Shows initial letter | [ ] |
| 9 | Profile with avatar | Shows image | [ ] |
| 10 | Header links to profile | `/u/:handle` link works | [ ] |
| 11 | `npm run build` | 0 errors | [ ] |
| 12 | `npm test` | All tests pass Yes | [ ] |

---

**You've completed the entire testing curriculum! Keep testing, keep building! ~jv**
