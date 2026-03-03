/**
 * =====================================================
 *  Step 17 — Pagination & Sorting: Testing Parameterized APIs
 * =====================================================
 *
 *  🎓 CONCEPTS TAUGHT IN THIS FILE:
 *
 *  1. Parameterized tests (it.each / test.each)
 *  2. Testing URL parameter building
 *  3. Testing sort order validation (whitelist)
 *  4. Testing pagination math (totalPages, boundary pages)
 *  5. Testing the API response envelope
 * =====================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Part A: Testing fetchEntries() with pagination params ────────────────

describe('api/entries — fetchEntries(params)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('builds URLSearchParams from the params object', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], page: 2, limit: 5, total: 0, totalPages: 0 }),
    } as Response);

    const { fetchEntries } = await import('../src/api/entries');
    await fetchEntries({ page: 2, limit: 5, sort: 'title', order: 'asc' });

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;

    /**
     * 💡 CONCEPT: When testing URL construction, verify EACH parameter
     *    is present. The order may vary, so check each one individually.
     */
    expect(calledUrl).toContain('page=2');
    expect(calledUrl).toContain('limit=5');
    expect(calledUrl).toContain('sort=title');
    expect(calledUrl).toContain('order=asc');
  });

  it('omits undefined params', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], page: 1, limit: 10, total: 0, totalPages: 0 }),
    } as Response);

    const { fetchEntries } = await import('../src/api/entries');
    await fetchEntries({ page: 1 }); // only page, no sort/order/tag

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;

    expect(calledUrl).toContain('page=1');
    expect(calledUrl).not.toContain('sort=');
    expect(calledUrl).not.toContain('order=');
    expect(calledUrl).not.toContain('tag=');
  });
});

// ─── Part B: Parameterized tests with it.each() ──────────────────────────

describe('Pagination math — totalPages', () => {
  /**
   * 💡 CONCEPT: Parameterized Tests with it.each()
   *
   *    When you have many inputs that should produce predictable outputs,
   *    don't write a separate `it()` for each. Use `it.each()`:
   *
   *    it.each([ [input1, expected1], [input2, expected2] ])
   *      ('description with %i', (input, expected) => { ... })
   *
   *    The %i, %s, %o placeholders format the description:
   *      %i = integer, %s = string, %o = object, %j = JSON
   */

  // This is the formula the server uses:
  const calcTotalPages = (total: number, limit: number): number =>
    Math.ceil(total / limit);

  it.each([
    // [total, limit, expectedPages]
    [0,   10, 0],    // No items → 0 pages
    [1,   10, 1],    // 1 item → 1 page
    [10,  10, 1],    // Exactly 1 page
    [11,  10, 2],    // 1 extra → needs page 2
    [100, 10, 10],   // Clean division
    [47,  10, 5],    // 47 items / 10 per page = 5 pages
    [1,   1,  1],    // Minimum: 1 per page
    [100, 100, 1],   // Maximum: all on one page
  ])('total=%i, limit=%i → %i pages', (total, limit, expectedPages) => {
    expect(calcTotalPages(total, limit)).toBe(expectedPages);
  });
});

// ─── Part C: Testing sort field whitelist (security!) ─────────────────────

describe('Sort field validation', () => {
  /**
   * 💡 CONCEPT: Whitelist Validation (Security!)
   *
   *    The server only allows sorting by specific fields:
   *    createdAt, title, mood
   *
   *    If someone sends ?sort=password or ?sort=email, the server
   *    should DEFAULT to 'createdAt' — never expose sensitive data!
   *
   *    This is a SECURITY TEST. Always whitelist user input.
   */

  const ALLOWED_SORTS = ['createdAt', 'title', 'mood'];

  const validateSort = (input: string): string =>
    ALLOWED_SORTS.includes(input) ? input : 'createdAt';

  it.each([
    ['createdAt', 'createdAt'],  // Valid
    ['title',     'title'],      // Valid
    ['mood',      'mood'],       // Valid
    ['password',  'createdAt'],  // ⚠️ REJECTED → falls back to default
    ['email',     'createdAt'],  // ⚠️ REJECTED
    ['',          'createdAt'],  // Empty string → default
    ['id; DROP TABLE entries', 'createdAt'],  // 🛡️ SQL injection attempt → rejected
  ])('sort="%s" → "%s"', (input, expected) => {
    expect(validateSort(input)).toBe(expected);
  });
});

// ─── Part D: Testing pagination boundary conditions ───────────────────────

describe('Pagination boundaries', () => {
  /**
   * 💡 CONCEPT: Boundary Testing
   *
   *    Pagination has many edge cases. Good tests cover:
   *    - First page (page=1, no "Previous")
   *    - Last page (page=totalPages, no "Next")
   *    - Only one page (hide pagination entirely)
   *    - Page beyond total (redirect to last page)
   *    - Negative page numbers
   *    - limit=0 or limit=-1
   */

  const clampPage = (page: number, totalPages: number): number =>
    Math.max(1, Math.min(page, totalPages || 1));

  const clampLimit = (limit: number): number =>
    Math.max(1, Math.min(limit, 100)); // 1-100 range

  it.each([
    [1,  5,  1],   // First page → stays at 1
    [5,  5,  5],   // Last page → stays at 5
    [6,  5,  5],   // Beyond last → clamped to 5
    [0,  5,  1],   // Zero → clamped to 1
    [-1, 5,  1],   // Negative → clamped to 1
    [3,  0,  1],   // No pages (0 total) → page 1
  ])('page=%i, totalPages=%i → %i', (page, totalPages, expected) => {
    expect(clampPage(page, totalPages)).toBe(expected);
  });

  it.each([
    [10,  10],
    [0,   1],    // Zero → minimum of 1
    [-5,  1],    // Negative → minimum of 1
    [200, 100],  // Over max → capped at 100
    [100, 100],  // At max → allowed
    [1,   1],    // At minimum → allowed
  ])('limit=%i → %i', (input, expected) => {
    expect(clampLimit(input)).toBe(expected);
  });
});

// ─── Part E: Testing the API response envelope ───────────────────────────

describe('PaginatedResponse shape', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('returns data array + pagination metadata', async () => {
    const mockResponse = {
      data: [
        { id: 1, title: 'Entry 1' },
        { id: 2, title: 'Entry 2' },
      ],
      page: 1,
      limit: 10,
      total: 47,
      totalPages: 5,
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { fetchEntries } = await import('../src/api/entries');
    const result = await fetchEntries({ page: 1 });

    /**
     * 💡 CONCEPT: Testing response shape
     *
     *    When the API response changes from a simple array to an
     *    envelope object, existing code WILL break. This is exactly
     *    why we write tests — they catch breaking changes!
     *
     *    Your tests should verify:
     *    - data is an array (not the root object)
     *    - page is a number (not a string from the URL)
     *    - totalPages is calculated correctly
     */
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('totalPages');
    expect(Array.isArray(result.data)).toBe(true);

    // Type check: page should be a number, not a string
    expect(typeof result.page).toBe('number');
  });
});
