/**
 * =====================================================
 *  Step 33 — Social Schema: Testing Data Transformations
 * =====================================================
 *
 *  🎓 CONCEPTS TAUGHT IN THIS FILE:
 *
 *  1. Testing slug/handle generation
 *  2. Testing default values for new fields
 *  3. Testing unique constraint behavior
 *  4. Testing backward compatibility
 * =====================================================
 */

import { describe, it, expect } from 'vitest';

// ─── Part A: Testing Handle Generation ────────────────────────────────────

describe('Handle (slug) generation', () => {
  /**
   * 💡 CONCEPT: Testing Pure Functions
   *
   *    The handle/slug generator is a PURE FUNCTION:
   *    - Same input always produces same output
   *    - No side effects
   *    - Easy to test!
   *
   *    Pure functions are the easiest things to test in software.
   */

  const slugify = (name: string): string =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  it('converts spaces to hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('lowercases everything', () => {
    expect(slugify('JVtheDev')).toBe('jvthedev');
  });

  it('removes special characters', () => {
    expect(slugify('user@name!')).toBe('user-name');
  });

  it('collapses multiple separators', () => {
    expect(slugify('too   many   spaces')).toBe('too-many-spaces');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('  padded  ')).toBe('padded');
    expect(slugify('---test---')).toBe('test');
  });

  it('handles emoji and unicode', () => {
    /**
     * 💡 EDGE CASE: What happens with emoji usernames?
     *    The regex strips them because they're not a-z0-9.
     *    This is fine for URL slugs!
     */
    const result = slugify('cool🎉dev');
    expect(result).toBe('cool-dev');
  });
});

// ─── Part B: Testing Default Values ───────────────────────────────────────

describe('Entry visibility defaults', () => {
  /**
   * 💡 CONCEPT: Default Value Testing
   *
   *    When adding new fields to existing models, you MUST handle
   *    old records that don't have the new field. Defaults solve this.
   */

  const applyDefaults = (entry: Record<string, unknown>) => ({
    visibility: 'PUBLIC',
    author: null,
    ...entry,
  });

  it('adds visibility=PUBLIC when missing', () => {
    const old = { id: 1, title: 'Old Entry' };
    expect(applyDefaults(old).visibility).toBe('PUBLIC');
  });

  it('preserves existing visibility', () => {
    const entry = { id: 2, title: 'Private', visibility: 'PRIVATE' };
    expect(applyDefaults(entry).visibility).toBe('PRIVATE');
  });

  it('adds author=null when missing', () => {
    const old = { id: 1, title: 'No Author' };
    expect(applyDefaults(old).author).toBeNull();
  });

  it('preserves existing author', () => {
    const entry = { id: 2, title: 'Has Author', author: 'jv' };
    expect(applyDefaults(entry).author).toBe('jv');
  });
});

// ─── Part C: Testing Unique Constraints ───────────────────────────────────

describe('Friendship unique constraint', () => {
  /**
   * 💡 CONCEPT: Testing Business Rules
   *
   *    The Friendship model has a unique constraint on [userAId, userBId].
   *    This prevents duplicate friend requests. You can test the
   *    logic even without a database.
   */

  type Friendship = {
    userAId: number;
    userBId: number;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  };

  const friendships: Friendship[] = [];

  const addFriendship = (userAId: number, userBId: number): boolean => {
    // Check for existing (either direction)
    const exists = friendships.some(
      f =>
        (f.userAId === userAId && f.userBId === userBId) ||
        (f.userAId === userBId && f.userBId === userAId)
    );

    if (exists) return false; // Duplicate!

    friendships.push({ userAId, userBId, status: 'PENDING' });
    return true;
  };

  it('allows new friendship', () => {
    expect(addFriendship(1, 2)).toBe(true);
  });

  it('rejects duplicate request (same direction)', () => {
    expect(addFriendship(1, 2)).toBe(false);
  });

  it('rejects duplicate request (reverse direction)', () => {
    /**
     * 💡 EDGE CASE: If user 1→2 exists, should 2→1 also be blocked?
     *    In this implementation, YES — friendships are bidirectional.
     */
    expect(addFriendship(2, 1)).toBe(false);
  });
});
