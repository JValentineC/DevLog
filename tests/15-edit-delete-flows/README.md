# Test Plan -- Step 15: Edit & Delete Flows

## New Concept: Testing Optimistic Updates & Modals

### Optimistic Updates

An **optimistic update** changes the UI *immediately* before the server responds,
then rolls back if the server request fails. Testing this requires:

1. Mock `fetch()` to succeed -> verify UI updates instantly
2. Mock `fetch()` to fail -> verify UI rolls back

```tsx
// Simulate a failed delete
vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response)

await user.click(deleteButton)

// Entry should reappear after the rollback
await waitFor(() => {
 expect(screen.getByText('Entry Title')).toBeInTheDocument()
})
```

### Testing Confirmation Dialogs

Before deleting, the app shows a confirmation. You can test this with:

```tsx
// Mock window.confirm to return true (user clicks "OK")
vi.spyOn(window, 'confirm').mockReturnValue(true)

await user.click(deleteButton)

expect(window.confirm).toHaveBeenCalled()
```

### Testing Toast Notifications

Toasts typically appear via `role="alert"` or `role="status"`:

```tsx
await waitFor(() => {
 expect(screen.getByRole('alert')).toHaveTextContent(/deleted/i)
})
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm run build` | 0 errors | [ ] |
| 2 | Entries list shows Edit and Delete | Buttons visible | [ ] |
| 3 | Click Edit -> pre-filled form | Navigates to edit page | [ ] |
| 4 | Submit edit -> success toast | Entry updates | [ ] |
| 5 | Click Delete -> confirmation | Dialog appears | [ ] |
| 6 | Confirm delete -> entry removed | Item disappears | [ ] |
| 7 | Toasts auto-dismiss | ~3 seconds | [ ] |
| 8 | Run `npm test` | All tests pass Yes | [ ] |
