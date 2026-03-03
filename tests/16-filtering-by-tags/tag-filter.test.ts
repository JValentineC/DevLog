/**
 * =====================================================
 *  Step 16 — Filtering by Tags: Testing URL State
 * =====================================================
 *
 *  🎓 CONCEPTS TAUGHT IN THIS FILE:
 *
 *  1. Testing URL query parameters (?tag=react)
 *  2. encodeURIComponent for safe URLs
 *  3. Testing server-side Prisma `contains` filtering
 *  4. Testing the tags endpoint (dedup + sort)
 *  5. Testing user-driven filter interactions
 * =====================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Part A: Testing the API utility with query params ────────────────────

describe('api/entries — fetchEntries(tag)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('calls /api/entries without query params when no tag', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const { fetchEntries } = await import('../src/api/entries');
    await fetchEntries();

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;

    /**
     * 💡 CONCEPT: When no filter is active, the URL should NOT have ?tag=
     *    This is a "negative assertion" — checking something is ABSENT.
     */
    expect(calledUrl).not.toContain('tag=');
  });

  it('appends ?tag= when a tag is provided', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const { fetchEntries } = await import('../src/api/entries');
    await fetchEntries('react');

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;

    expect(calledUrl).toContain('tag=react');
  });

  it('encodes special characters in tag names', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const { fetchEntries } = await import('../src/api/entries');
    await fetchEntries('c# basics');

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;

    /**
     * 💡 CONCEPT: URL encoding
     *
     *    Special characters in URLs must be encoded:
     *    - Space → %20       (or + in some formats)
     *    - # → %23           (# has special meaning in URLs!)
     *
     *    encodeURIComponent() handles this automatically.
     *    Without it, "c# basics" would break the URL because
     *    # starts a "fragment" in URLs.
     */
    expect(calledUrl).not.toContain(' ');
    expect(calledUrl).toContain('tag=');
  });
});

describe('api/entries — fetchTags()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('calls GET /api/entries/tags', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ['react', 'typescript', 'vitest'],
    } as Response);

    const { fetchTags } = await import('../src/api/entries');
    const tags = await fetchTags();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/entries/tags')
    );
    expect(tags).toEqual(['react', 'typescript', 'vitest']);
  });
});

// ─── Part B: Testing server-side tag filtering (supertest) ────────────────

/**
 * 💡 These tests would run against your Express app using supertest.
 *    They demonstrate how to test Prisma's `contains` filter.
 *
 *    In your actual test file, you'd import your `app` and use:
 *      import request from 'supertest';
 *      import app from '../src/app';
 */

describe('GET /api/entries?tag= (server-side pattern)', () => {
  it('demonstrates testing tag filtering logic', () => {
    /**
     * 💡 CONCEPT: Testing Prisma's `contains` filter
     *
     *    The server uses: where: { tags: { contains: tag } }
     *
     *    This means searching for "react" in tags like "react,typescript".
     *    But it also means "react" would match "react-native"!
     *
     *    This is a real-world gotcha you should think about:
     *    - "react" matches: "react", "react,ts", "react-native"
     *    - Consider whether this is acceptable for your use case.
     *
     *    Possible fixes:
     *    - Store tags as a JSON array column
     *    - Use a separate tags table (many-to-many)
     *    - Add comma boundaries: contains: `,${tag},`
     */
    const tags = 'react,typescript,vitest';

    // Prisma's `contains` is a substring match:
    expect(tags).toContain('react');
    expect(tags).toContain('typescript');
    expect(tags).not.toContain('angular');
  });
});

// ─── Part C: Testing the Tags endpoint (dedup + sort) ─────────────────────

describe('GET /api/entries/tags (server logic pattern)', () => {
  it('deduplicates and sorts tags', () => {
    /**
     * 💡 CONCEPT: Testing data transformation logic
     *
     *    The /tags endpoint:
     *    1. Fetches all entries' tag strings
     *    2. Splits by comma
     *    3. Deduplicates using Set
     *    4. Sorts alphabetically
     *    5. Returns the array
     *
     *    You can test this logic independently of the database.
     */

    // Simulate what the server does:
    const rawEntries = [
      { tags: 'react,typescript' },
      { tags: 'vitest,react' },        // "react" is duplicated
      { tags: 'typescript,express' },
    ];

    // Step 1: Split all tag strings
    const allTags = rawEntries
      .flatMap(entry => entry.tags.split(','))
      .map(tag => tag.trim())
      .filter(Boolean);

    // Step 2: Deduplicate
    const unique = [...new Set(allTags)];

    // Step 3: Sort
    const sorted = unique.sort();

    expect(sorted).toEqual(['express', 'react', 'typescript', 'vitest']);

    /**
     * 💡 TDD PRACTICE: Write this test FIRST, then implement the
     *    /tags endpoint to make it pass. That's Red-Green-Refactor!
     */
  });
});
