// =============================================================================
// 🧪 Step 05 — Unit Testing: Footer Component
// =============================================================================
//
// CONCEPT: Testing Components Without Dependencies
// Footer doesn't use react-router, context, or any external libraries.
// This makes it the EASIEST type of component to unit test.
// No wrappers needed — just render() and assert.
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import Footer from './components/Footer'

describe('Footer', () => {

  it('renders the copyright text', () => {
    render(<Footer />)

    // We check for the current year dynamically so the test
    // doesn't break on January 1st!
    const year = new Date().getFullYear()
    expect(
      screen.getByText(new RegExp(`© ${year} DevLog`, 'i'))
    ).toBeInTheDocument()
  })

  it('is wrapped in a <footer> element', () => {
    render(<Footer />)

    // getByRole('contentinfo') is the ARIA role for <footer>.
    // This ensures the component uses semantic HTML.
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

})

// =============================================================================
// 💡 TIP: Simple components deserve simple tests. Don't overthink it.
//    If the component renders static content, 2-3 assertions are enough.
// =============================================================================
