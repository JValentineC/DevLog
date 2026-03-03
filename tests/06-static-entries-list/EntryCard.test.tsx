// =============================================================================
// 🧪 Step 06 — Unit Test: EntryCard Component
// =============================================================================
//
// CONCEPT: Testing a Component with Props
// EntryCard receives an `entry` prop and renders its fields.
// In unit tests, we pass a FAKE entry object so we control exactly
// what the component receives — no dependency on the real data file.
//
// WHAT YOU'LL LEARN:
// - Creating test fixtures (fake data for tests)
// - Testing that props are rendered correctly
// - Using getByText() and getByRole() on a single component
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import EntryCard from './components/EntryCard'
import type { Entry } from './data/entries'

// --------------------------------------------------------------------------
// TEST FIXTURE
// A fixture is a piece of fake data created specifically for testing.
// We define it outside the tests so every test can reuse it.
// --------------------------------------------------------------------------
const mockEntry: Entry = {
  id: 99,
  title: 'Test Entry Title',
  date: '2026-01-15',
  summary: 'This is a test summary for our unit test.',
}

describe('EntryCard', () => {

  it('renders the entry title', () => {
    render(<EntryCard entry={mockEntry} />)

    // The title should appear as a heading inside the article
    expect(
      screen.getByRole('heading', { name: /Test Entry Title/i })
    ).toBeInTheDocument()
  })

  it('renders the entry date', () => {
    render(<EntryCard entry={mockEntry} />)

    // The <time> element should display the date
    expect(screen.getByText('2026-01-15')).toBeInTheDocument()
  })

  it('renders the entry summary', () => {
    render(<EntryCard entry={mockEntry} />)

    expect(
      screen.getByText(/This is a test summary/i)
    ).toBeInTheDocument()
  })

  it('wraps content in an <article> element', () => {
    render(<EntryCard entry={mockEntry} />)

    // <article> has the ARIA role "article"
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

})

// =============================================================================
// 💡 FIXTURE PATTERN
// Notice we created a mockEntry instead of using real data from entries.ts.
// This is intentional — unit tests should not depend on external data files.
// If entries.ts changes, this test still works because it uses its own data.
// =============================================================================
