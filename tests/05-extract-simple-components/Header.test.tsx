// =============================================================================
// 🧪 Step 05 — Unit Testing: Header Component
// =============================================================================
//
// CONCEPT: Unit Testing a Component in Isolation
// Instead of testing the whole App, we test JUST the Header.
// This makes the test faster, simpler, and easier to debug.
//
// WHAT YOU'LL LEARN:
// - Testing a single component instead of the whole app
// - Wrapping components that use <Link> in MemoryRouter
// - Using getAllByRole() when multiple elements match
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './components/Header'

// --------------------------------------------------------------------------
// Helper: Header uses <Link>, so it needs a Router wrapper
// --------------------------------------------------------------------------
function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
}

describe('Header', () => {

  it('renders the DevLog heading', () => {
    renderHeader()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('DevLog')
  })

  it('renders the profile image with alt text', () => {
    renderHeader()
    const img = screen.getByAltText(/profile/i)
    expect(img).toBeInTheDocument()
  })

  it('renders a navigation link to About', () => {
    renderHeader()

    // getByRole('link') finds <a> elements. The `name` option matches
    // the link's accessible name (its visible text).
    const aboutLink = screen.getByRole('link', { name: /about/i })
    expect(aboutLink).toBeInTheDocument()

    // We can also check where the link points to
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

})

// =============================================================================
// 💡 NOTICE: This test file is much shorter than the App tests.
//    That's the beauty of unit testing — small, focused, fast.
// =============================================================================
