/**
 * =============================================================
 *  Step 14 — Frontend Fetch: Testing API Utilities & Components
 * =============================================================
 *
 *  🎓 CONCEPT: Mocking the global `fetch()` function
 *
 *  When your React app calls fetch() to talk to the backend,
 *  you don't want real network calls in tests. Instead, you
 *  REPLACE fetch with a Vitest mock so you control what it returns.
 *
 *  Key techniques:
 *   - vi.fn()            → create a mock function
 *   - vi.mocked(fetch)   → get TypeScript-aware mock from the global
 *   - mockResolvedValue   → make the mock return a resolved Promise
 *   - waitFor / findBy    → wait for async React re-renders
 * =============================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Part A: Testing the API utility (pure functions, no React) ───────────

describe('api/entries — fetchEntries()', () => {
  /**
   * 💡 SETUP: Before each test, replace the global fetch with a fresh mock.
   *    This ensures tests don't leak state between each other.
   */
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('calls GET /api/entries', async () => {
    // Arrange — tell fetch what to return
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    // Act — dynamically import so the mock is in place
    const { fetchEntries } = await import('../src/api/entries');
    await fetchEntries();

    // Assert — fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/entries')
    );
  });

  it('returns the parsed JSON array', async () => {
    const fakeEntries = [
      { id: 1, title: 'Hello', content: 'World', mood: 'happy', tags: 'react,vitest', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => fakeEntries,
    } as Response);

    const { fetchEntries } = await import('../src/api/entries');
    const result = await fetchEntries();

    /**
     * 💡 The API returns "ApiEntry" objects (tags as a comma string).
     *    The utility function returns them as-is; the component converts them.
     */
    expect(result).toEqual(fakeEntries);
  });
});

describe('api/entries — createEntry()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('sends a POST request with JSON body', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 99, title: 'New' }),
    } as Response);

    const { createEntry } = await import('../src/api/entries');
    await createEntry({ title: 'New', content: 'Body', mood: 'happy', tags: 'test' });

    /**
     * 💡 ASSERTION: We verify BOTH the URL and the request options.
     *    expect.objectContaining lets you check a subset of properties
     *    without listing every single one.
     */
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/entries'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('includes the entry data in the request body', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 99 }),
    } as Response);

    const { createEntry } = await import('../src/api/entries');
    const body = { title: 'New', content: 'Body', mood: 'happy', tags: 'test' };
    await createEntry(body);

    /**
     * 💡 To check the body, we inspect the second argument to fetch().
     *    Since it's JSON.stringify'd, we parse it back.
     */
    const callArgs = vi.mocked(fetch).mock.calls[0];
    const requestInit = callArgs[1] as RequestInit;
    const sentBody = JSON.parse(requestInit.body as string);

    expect(sentBody).toEqual(body);
  });
});

// ─── Part B: Testing the component that USES fetch ────────────────────────

/**
 * 💡 CONCEPT: When testing a React component that calls fetch() on mount,
 *    you need to:
 *    1. Mock fetch BEFORE rendering
 *    2. Render the component
 *    3. Use waitFor() or findByText() to wait for the async update
 *
 *  This section shows the PATTERN — adapt the imports to match your
 *  actual component names.
 */

/*
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

describe('EntriesPage — displays fetched entries', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('shows a loading indicator while fetching', () => {
    // fetch never resolves → component stays in loading state
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/entries']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders entries after fetch resolves', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: 'My First Entry', content: '...', mood: 'happy', tags: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
    } as Response);

    render(
      <MemoryRouter initialEntries={['/entries']}>
        <App />
      </MemoryRouter>
    );

    // 💡 findByText = getByText + waitFor. It retries until found or timeout.
    expect(await screen.findByText('My First Entry')).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter initialEntries={['/entries']}>
        <App />
      </MemoryRouter>
    );

    // After the error, loading should stop and entries should be empty
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});
*/
