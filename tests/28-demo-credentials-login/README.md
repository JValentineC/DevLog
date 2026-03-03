# Test Plan -- Step 28: Demo Credentials Login

## New Concept: Testing Authentication Forms

This step adds a login/register form that works in both demo and real mode.
Testing auth forms involves verifying **form behavior**, **error handling**,
and **state management** via React Context.

### Testing Login Form Behavior

```tsx
// Type credentials
await user.type(screen.getByLabelText(/username/i), 'testuser');
await user.type(screen.getByLabelText(/password/i), 'password123');
await user.click(screen.getByRole('button', { name: /log in/i }));

// After login, user should be redirected
await waitFor(() => {
 expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
});
```

### Testing Mode Toggle (Login <-> Register)

```tsx
// Start in login mode
expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();

// Toggle to register
await user.click(screen.getByText(/need an account/i));

// Register form should show
expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
```

### Testing Error Messages

```tsx
// Wrong password -> error message
vi.mocked(fetch).mockResolvedValue({
 ok: false,
 json: async () => ({ error: 'Invalid username or password' }),
} as Response);

await user.click(screen.getByRole('button', { name: /log in/i }));

await waitFor(() => {
 expect(screen.getByRole('alert')).toHaveTextContent(/invalid/i);
});
```

### Testing `autoComplete` Attributes

```tsx
// Good for password managers and accessibility
expect(screen.getByLabelText(/username/i)).toHaveAttribute('autoComplete', 'username');
expect(screen.getByLabelText(/password/i)).toHaveAttribute('autoComplete', 'current-password');
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Visit `/login` | Login form appears | [ ] |
| 2 | Toggle to Register mode | Register form shows | [ ] |
| 3 | Submit empty form | Validation prevents submit | [ ] |
| 4 | Login with demo credentials | Redirected to entries | [ ] |
| 5 | Login with wrong password | Error message appears | [ ] |
| 6 | Error has `role="alert"` | Screen reader announces | [ ] |
| 7 | After login, header shows username | Auth state works | [ ] |
| 8 | Refresh page | Session persists (localStorage) | [ ] |
