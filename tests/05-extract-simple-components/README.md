# Test Plan -- Step 05: Extract Simple Components

## New Concept: Unit Testing Components in Isolation

Up to now, we've tested `<App />` as a whole. But once you extract components like
`Header`, `Footer`, and `AboutSection`, you can test each one **independently**.

### Unit Tests vs. Integration Tests

| Type | What It Tests | Speed | Scope |
|------|--------------|-------|-------|
| **Unit test** | One component/function in isolation | Very fast | Narrow |
| **Integration test** | Multiple components working together | Fast | Medium |
| **End-to-end (E2E)** | The whole app in a real browser | Slow | Wide |

A healthy test suite has **many unit tests**, some integration tests, and a few E2E
tests. This is called the **Testing Pyramid**.

```
 / E2E \ <- Few (slow, expensive)
 /----------\
 / Integration\ <- Some
 /--------------\
 / Unit Tests \ <- Many (fast, cheap)
 /==================\
```

### Testing Components That Use `<Link>`

`Header` uses `<Link>` from react-router-dom. If you render `Header` without a Router
wrapper, it will crash: *"useHref() may only be used within a <Router> component"*

Solution: wrap it in `MemoryRouter`.

```tsx
render(
 <MemoryRouter>
 <Header />
 </MemoryRouter>
)
```

### Testing Components Without Dependencies

`Footer` and `AboutSection` don't use any router features, so they can be rendered
directly -- no wrapper needed. These are the easiest components to unit test!

---

## Test Scripts

This step has **three** test files -- one per extracted component:

-> See [Header.test.tsx](Header.test.tsx), [Footer.test.tsx](Footer.test.tsx), and [AboutSection.test.tsx](AboutSection.test.tsx)

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run dev` | Dev server starts without errors | [ ] |
| 2 | Verify Header renders with photo and nav links | Header visible | [ ] |
| 3 | Verify Footer renders at bottom | Footer content visible | [ ] |
| 4 | Navigate to About page | `AboutSection` renders correctly | [ ] |
| 5 | All routing still works (Home <-> About) | Navigation functions | [ ] |
| 6 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 7 | Run `npm test` | All tests pass Yes | [ ] |

---

## What's Next?

In **Step 6**, you'll test **data-driven rendering** -- verifying that a list of entries
displays the correct number of items with the right content.
