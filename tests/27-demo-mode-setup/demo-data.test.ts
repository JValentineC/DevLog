/**
 * =====================================================
 *  Step 27 — Demo Mode: Testing the DemoData Layer
 * =====================================================
 *
 *  🎓 CONCEPTS TAUGHT IN THIS FILE:
 *
 *  1. Testing localStorage interactions
 *  2. Testing in-memory pagination / sorting / filtering
 *  3. Mocking static JSON file fetching
 *  4. Testing the strategy pattern (DEMO vs real API)
 *  5. beforeEach / afterEach cleanup for localStorage
 * =====================================================
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Part A: Testing localStorage helpers ─────────────────────────────────

describe('localStorage interactions', () => {
  /**
   * 💡 CONCEPT: Testing localStorage
   *
   *    jsdom (vitest's browser environment) provides a working
   *    localStorage. But you MUST clean it between tests!
   *    Otherwise tests leak state into each other.
   */

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves data', () => {
    const entries = [{ id: 1, title: 'Test' }];
    localStorage.setItem('jvc_demo_logs', JSON.stringify(entries));

    const stored = JSON.parse(localStorage.getItem('jvc_demo_logs') || '[]');
    expect(stored).toEqual(entries);
  });

  it('returns empty array when nothing stored', () => {
    const stored = JSON.parse(localStorage.getItem('jvc_demo_logs') || '[]');
    expect(stored).toEqual([]);
  });

  it('overwrites previous data', () => {
    localStorage.setItem('jvc_demo_logs', JSON.stringify([{ id: 1 }]));
    localStorage.setItem('jvc_demo_logs', JSON.stringify([{ id: 2 }]));

    const stored = JSON.parse(localStorage.getItem('jvc_demo_logs') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(2);
  });
});

// ─── Part B: Testing in-memory pagination ─────────────────────────────────

describe('In-memory pagination logic', () => {
  /**
   * 💡 CONCEPT: Testing Business Logic Without the UI
   *
   *    DemoData implements pagination in JavaScript:
   *    - Sort the array
   *    - Slice for the current page
   *    - Calculate totalPages
   *
   *    You can test this logic directly without React!
   */

  const paginate = <T>(items: T[], page: number, limit: number) => {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);
    return { data, page, limit, total, totalPages };
  };

  const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

  it('returns correct first page', () => {
    const result = paginate(items, 1, 10);
    expect(result.data).toHaveLength(10);
    expect(result.data[0].id).toBe(1);
    expect(result.totalPages).toBe(3);
  });

  it('returns correct last page (partial)', () => {
    const result = paginate(items, 3, 10);
    expect(result.data).toHaveLength(5); // Only 5 left on page 3
    expect(result.data[0].id).toBe(21);
  });

  it('returns empty data for page beyond total', () => {
    const result = paginate(items, 99, 10);
    expect(result.data).toHaveLength(0);
  });
});

// ─── Part C: Testing in-memory tag filtering ──────────────────────────────

describe('In-memory tag filtering logic', () => {
  const entries = [
    { id: 1, title: 'React Basics', tags: ['react', 'frontend'] },
    { id: 2, title: 'Express Setup', tags: ['express', 'backend'] },
    { id: 3, title: 'Full Stack', tags: ['react', 'express'] },
  ];

  const filterByTag = (items: typeof entries, tag?: string) => {
    if (!tag) return items;
    return items.filter(e => e.tags.includes(tag));
  };

  it('returns all entries when no tag specified', () => {
    expect(filterByTag(entries)).toHaveLength(3);
  });

  it('returns only matching entries', () => {
    const result = filterByTag(entries, 'react');
    expect(result).toHaveLength(2);
    expect(result.every(e => e.tags.includes('react'))).toBe(true);
  });

  it('returns empty array for unknown tag', () => {
    expect(filterByTag(entries, 'unknown')).toHaveLength(0);
  });
});

// ─── Part D: Testing the strategy pattern ─────────────────────────────────

describe('API strategy pattern (DEMO vs real)', () => {
  /**
   * 💡 CONCEPT: The Strategy Pattern
   *
   *    Your API functions choose between two strategies:
   *    - DEMO mode: Use DemoData (localStorage + JSON)
   *    - Real mode: Use fetch() to call the backend
   *
   *    This pattern makes your app work anywhere:
   *    - GitHub Pages (no backend) → demo mode
   *    - Local dev (with backend) → real mode
   *    - Production (with backend) → real mode
   *
   *    Testing strategy: Test EACH path independently.
   */

  it('demonstrates environment-based branching', () => {
    const fetchEntries = (demo: boolean) => {
      if (demo) return { source: 'localStorage' };
      return { source: 'fetch' };
    };

    expect(fetchEntries(true).source).toBe('localStorage');
    expect(fetchEntries(false).source).toBe('fetch');
  });
});
