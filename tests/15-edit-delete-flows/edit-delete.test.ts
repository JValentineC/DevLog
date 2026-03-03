/**
 * =====================================================
 *  Step 15 — Edit & Delete Flows: Testing CRUD UI
 * =====================================================
 *
 *  🎓 CONCEPTS TAUGHT IN THIS FILE:
 *
 *  1. Mocking window.confirm()  — Control dialog responses
 *  2. Mocking multiple fetch()  — Different calls return different things
 *  3. Testing optimistic updates — UI changes before server responds
 *  4. Testing toast notifications — Feedback messages appear
 *  5. mockImplementation()      — Custom logic in a mock
 * =====================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Part A: Testing the API utility functions ────────────────────────────

describe('api/entries — updateEntry()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('sends a PUT request to /api/entries/:id', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 5, title: 'Updated' }),
    } as Response);

    const { updateEntry } = await import('../src/api/entries');
    await updateEntry(5, { title: 'Updated', content: 'New body', mood: 'proud', tags: 'edit' });

    /**
     * 💡 For PUT requests, check:
     *    - The URL contains the correct ID
     *    - The method is PUT
     *    - The Content-Type header is set
     */
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/entries/5'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

describe('api/entries — deleteEntry()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('sends a DELETE request to /api/entries/:id', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const { deleteEntry } = await import('../src/api/entries');
    await deleteEntry(3);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/entries/3'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});

// ─── Part B: Testing window.confirm() ─────────────────────────────────────

describe('EntryCard — delete confirmation', () => {
  it('demonstrates mocking window.confirm()', () => {
    /**
     * 💡 CONCEPT: Mocking browser APIs
     *
     *    window.confirm() shows a native dialog. In tests, we can't
     *    interact with native dialogs, so we MOCK it.
     *
     *    vi.spyOn(window, 'confirm') replaces it while preserving
     *    the ability to check if it was called.
     */

    // User clicks "OK" on the dialog
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    // Simulate what your delete handler does:
    const shouldDelete = window.confirm('Delete this entry?');

    expect(confirmSpy).toHaveBeenCalledWith('Delete this entry?');
    expect(shouldDelete).toBe(true);
  });

  it('prevents deletion when user cancels', () => {
    // User clicks "Cancel" on the dialog
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const shouldDelete = window.confirm('Delete this entry?');

    expect(shouldDelete).toBe(false);

    /**
     * 💡 TDD INSIGHT: Test BOTH paths!
     *    - User confirms → delete proceeds
     *    - User cancels → nothing happens
     *
     *    This is called "branch coverage" — ensuring every code path
     *    has at least one test.
     */
  });
});

// ─── Part C: Testing Optimistic Updates ───────────────────────────────────

describe('Optimistic update pattern', () => {
  /**
   * 💡 CONCEPT: Optimistic Updates
   *
   *    Instead of waiting for the server, update the UI immediately:
   *
   *    1. Save current state (for rollback)
   *    2. Update UI optimistically
   *    3. Send API request
   *    4. If it fails → rollback to saved state
   *
   *    This makes the app feel instant to the user.
   */

  it('demonstrates the optimistic pattern with rollback', async () => {
    // Simulate state
    let entries = [
      { id: 1, title: 'Keep Me' },
      { id: 2, title: 'Delete Me' },
    ];

    // Step 1: Save previous state
    const previous = [...entries];

    // Step 2: Optimistically remove
    entries = entries.filter(e => e.id !== 2);
    expect(entries).toHaveLength(1);

    // Step 3: Simulate API failure
    const apiFailed = true;

    // Step 4: Rollback on failure
    if (apiFailed) {
      entries = previous;
    }

    expect(entries).toHaveLength(2);
    expect(entries[1].title).toBe('Delete Me');
  });
});

// ─── Part D: Testing Toast Notifications ──────────────────────────────────

describe('Toast component', () => {
  /**
   * 💡 CONCEPT: Testing time-based behavior
   *
   *    Toasts auto-dismiss after a delay. To test this without waiting
   *    real seconds, use vi.useFakeTimers().
   */

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('demonstrates fake timers for auto-dismiss', () => {
    const onDismiss = vi.fn();

    // Simulate a setTimeout like Toast uses
    setTimeout(onDismiss, 3000);

    // Time hasn't passed yet
    expect(onDismiss).not.toHaveBeenCalled();

    // Fast-forward 3 seconds
    vi.advanceTimersByTime(3000);

    /**
     * 💡 vi.useFakeTimers() replaces setTimeout/setInterval with
     *    controllable versions. vi.advanceTimersByTime() moves the
     *    clock forward without actually waiting.
     */
    expect(onDismiss).toHaveBeenCalledTimes(1);

    // Clean up
    vi.useRealTimers();
  });
});
