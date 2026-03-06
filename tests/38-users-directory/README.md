# Test Plan -- Step 38: Users Directory

## New Concept: Testing Search + Combined State UI

The Users Directory combines **search queries**, **parallel data
fetching**, and **derived UI state** (mapping friendship status to
button labels). Testing this kind of component means verifying:

1. The search input triggers debounced API calls
2. The component renders cards from fetched data
3. Friend action buttons reflect the correct status
4. Button clicks call the right API and refresh the list

### Debounce Testing Strategy

Debounced inputs delay their effect. In tests you need to advance timers
or use `waitFor` to let the debounce resolve:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Enable fake timers so you can control the debounce delay
vi.useFakeTimers();

const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

// Type into the search box
await user.type(screen.getByRole('searchbox'), 'alex');

// Advance past the 300 ms debounce
vi.advanceTimersByTime(350);

// Now the fetch should have been called with ?search=alex
expect(mockFetchUserDirectory).toHaveBeenCalledWith(
  expect.any(String), // token
  'alex',
);
```

### Mocking Two Parallel Fetches

The component calls `Promise.all([fetchUserDirectory, fetchFriendships])`.
In tests you mock both:

```tsx
import * as usersApi from '../api/users';
import * as friendshipsApi from '../api/friendships';

// Mock user directory
vi.spyOn(usersApi, 'fetchUserDirectory').mockResolvedValue([
  {
    id: 1, username: 'jvc', handle: 'jvc',
    displayName: 'Jonathan', bio: 'Tech Fellow',
    avatarUrl: null, createdAt: '2026-01-01T00:00:00.000Z',
    entryCount: 5,
  },
  {
    id: 2, username: 'intern_alex', handle: 'intern-alex',
    displayName: 'Alex Torres', bio: null,
    avatarUrl: null, createdAt: '2026-01-06T10:00:00.000Z',
    entryCount: 2,
  },
]);

// Mock friendships (none yet)
vi.spyOn(friendshipsApi, 'fetchFriendships').mockResolvedValue([]);
```

### Testing Derived Friend Status

The `getFriendInfo` helper maps a flat friendships list to a per-user
status. Test each state:

```ts
// getFriendInfo(targetUserId, myId, friendships)
import { getFriendInfo } from './UsersPage';

// No friendship exists
expect(getFriendInfo(2, 1, [])).toEqual({ status: 'NONE' });

// Pending request
expect(getFriendInfo(2, 1, [
  { id: 10, userAId: 1, userBId: 2, status: 'PENDING', ... }
])).toEqual({ status: 'PENDING', friendshipId: 10 });

// Accepted
expect(getFriendInfo(2, 1, [
  { id: 10, userAId: 1, userBId: 2, status: 'ACCEPTED', ... }
])).toEqual({ status: 'ACCEPTED', friendshipId: 10 });
```

### Testing Button Label Mapping

| Friendship status | Button text | Button style |
|-------------------|-------------|-------------|
| NONE | "Add Friend" | btn-primary |
| PENDING | "Pending -- Cancel" | btn-warning btn-outline |
| ACCEPTED | "Friends -- Unfriend" | btn-success btn-outline |
| DECLINED | "Send Request Again" | btn-primary |
| (self) | "You" badge | badge-ghost |

### Backend Search Endpoint Test

```ts
import request from 'supertest';
import app from '../server/app';

// Search by username
const res = await request(app)
  .get('/api/users?search=alex')
  .set('Authorization', `Bearer ${token}`);
expect(res.status).toBe(200);
expect(res.body).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ username: 'intern_alex' }),
  ]),
);
// Should NOT include non-matching users
expect(res.body.every(
  (u: any) =>
    u.username.includes('alex') ||
    u.handle.includes('alex') ||
    (u.displayName && u.displayName.includes('alex'))
)).toBe(true);
```

---

## Manual QA Checklist

| # | Action | Expected Result | Pass |
|---|--------|----------------|------|
| 1 | Navigate to /users while logged in | See card grid of all users | [ ] |
| 2 | Navigate to /users while logged out | Redirect to /login | [ ] |
| 3 | Type "alex" in search box | After ~300 ms, only matching users show | [ ] |
| 4 | Clear search box | All users reappear | [ ] |
| 5 | Type gibberish in search | "No users match your search." message | [ ] |
| 6 | See your own card | Shows "You" badge, no friend button | [ ] |
| 7 | Click "Add Friend" on another user | Button changes to "Pending -- Cancel" | [ ] |
| 8 | Click "Pending -- Cancel" | Button reverts to "Add Friend" | [ ] |
| 9 | Click user's display name | Navigates to /u/:handle profile | [ ] |
| 10 | User with avatar shows image | Round avatar image displayed | [ ] |
| 11 | User without avatar shows initial | Colored circle with first letter | [ ] |
| 12 | Resize to mobile width | Grid goes from 3 -> 2 -> 1 column | [ ] |
| 13 | Check entry count badge | Shows correct number of entries | [ ] |
| 14 | Backend: GET /api/users without auth | 401 Unauthorized | [ ] |
| 15 | Backend: GET /api/users?search=j | Returns matching users only | [ ] |

---

## What's Next

Step 39 adds viewer-aware feed queries -- the social feed will filter
entries based on visibility settings and friendship status, so users only
see content they are allowed to see.
