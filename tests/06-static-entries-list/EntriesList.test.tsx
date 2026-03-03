// =============================================================================
// 🧪 Step 06 — Integration Test: Entries List Page
// =============================================================================
//
// CONCEPT: Integration Testing
// While EntryCard.test.tsx tests a single card in isolation, this test
// verifies that the ENTRIES PAGE renders ALL cards from the data file.
// This is an "integration" test because it tests multiple pieces together:
//   App → Router → Entries page → EntryCard × N
//
// WHAT YOU'LL LEARN:
// - getAllByRole() for finding multiple matching elements
// - Importing data files to assert against dynamic content
// - The difference between unit and integration tests
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import entries from './data/entries'

describe('Entries page', () => {

  // -------------------------------------------------------------------------
  // Render the full app starting on the /entries route
  // -------------------------------------------------------------------------
  function renderEntriesPage() {
    return render(
      <MemoryRouter initialEntries={['/entries']}>
        <App />
      </MemoryRouter>
    )
  }

  it('renders the correct number of entry cards', () => {
    renderEntriesPage()

    // getAllByRole('article') returns an array of all <article> elements.
    // If there are none, it throws an error (that's a test failure).
    const articles = screen.getAllByRole('article')

    // We compare against the actual data length — if someone adds
    // or removes an entry from entries.ts, this test adapts automatically.
    expect(articles).toHaveLength(entries.length)
  })

  it('renders the title of each entry', () => {
    renderEntriesPage()

    // Loop through each entry and verify its title appears on screen
    for (const entry of entries) {
      expect(screen.getByText(entry.title)).toBeInTheDocument()
    }
  })

  it('renders the "All Entries" heading', () => {
    renderEntriesPage()

    expect(
      screen.getByRole('heading', { name: /All Entries/i })
    ).toBeInTheDocument()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 7+ passing tests (EntryCard + Entries page).
//
// 🤔 CHALLENGE: What's the difference between testing "renders 5 articles"
//    vs "renders entries.length articles"? When would the first approach
//    be better? (Hint: when testing a paginated list with a fixed page size.)
//
// 📖 NEXT STEP: Step 07 — testing form interactions (typing, clicking)
// =============================================================================
