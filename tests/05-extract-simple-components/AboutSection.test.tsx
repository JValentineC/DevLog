// =============================================================================
// 🧪 Step 05 — Unit Testing: AboutSection Component
// =============================================================================
//
// CONCEPT: Testing Content-Focused Components
// AboutSection renders text content. We test that the text is present
// and the HTML structure uses the correct semantic elements.
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import AboutSection from './components/AboutSection'

describe('AboutSection', () => {

  it('renders the About heading', () => {
    render(<AboutSection />)

    expect(
      screen.getByRole('heading', { name: /About/i })
    ).toBeInTheDocument()
  })

  it('mentions the SERN stack', () => {
    render(<AboutSection />)

    // Testing for key content ensures the component
    // actually displays meaningful information.
    expect(
      screen.getByText(/SERN stack/i)
    ).toBeInTheDocument()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// Between Header, Footer, and AboutSection, you should have 7 passing tests.
//
// 🤔 CHALLENGE: Try writing an integration test that renders <App /> and
//    verifies that Header, Footer, AND AboutSection all appear on the
//    About page. That's the difference between unit and integration tests!
//
// 📖 NEXT STEP: Step 06 — testing data-driven lists.
// =============================================================================
