# Test Plan -- Step 33: Social Schema Migrations

## New Concept: Testing Complex Schema Changes

This step adds **three major changes** to the database:
1. User profile fields (handle, displayName, bio, avatarUrl)
2. Entry visibility (PUBLIC, FRIENDS_ONLY, PRIVATE)
3. Friendship model (many-to-many with status)

### Testing Auto-Generated Fields

The `handle` is auto-generated from the username on registration:

```ts
// "Jonathan Ramirez" -> "jonathan-ramirez"
const slugify = (name: string) =>
 name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

expect(slugify('Jonathan Ramirez')).toBe('jonathan-ramirez');
expect(slugify('JV the Dev!')).toBe('jv-the-dev');
expect(slugify(' spaces ')).toBe('spaces');
```

### Testing Visibility Defaults

```ts
// New entries should default to 'PUBLIC'
const res = await request(app)
 .post('/api/entries')
 .set('Authorization', `Bearer ${token}`)
 .send({ title: 'Public Post', content: '...', mood: 'happy', tags: '' })

expect(res.body.visibility).toBe('PUBLIC');
```

### Testing the Friendship Model

```ts
// Friendships are bidirectional with status tracking
interface Friendship {
 id: number;
 userAId: number; // Requester
 userBId: number; // Recipient
 status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
 createdAt: string;
 updatedAt: string;
}

// Unique constraint: [userAId, userBId]
// -> Can't send duplicate friend requests
```

### Testing Backward Compatibility

When adding new fields, old data must still work:

```ts
// Old entries without 'visibility' should default to 'PUBLIC'
const oldEntry = { id: 1, title: 'Old Post' };
const withDefaults = { visibility: 'PUBLIC', ...oldEntry };
expect(withDefaults.visibility).toBe('PUBLIC');
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Register new user | Handle auto-generated | [ ] |
| 2 | Login response includes profile fields | handle, displayName, etc. | [ ] |
| 3 | Create entry | `visibility: 'PUBLIC'` default | [ ] |
| 4 | Old entries load | No errors from missing fields | [ ] |
| 5 | DB migration applies | New columns exist | [ ] |
| 6 | Friendship table created | Schema valid | [ ] |
| 7 | `npm run build` | 0 errors | [ ] |
| 8 | `npm test` | All tests pass Yes | [ ] |
