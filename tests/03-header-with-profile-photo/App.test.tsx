// =============================================================================
// 🧪 Step 03 — Testing DOM Attributes (Images & Accessibility)
// =============================================================================
//
// CONCEPT: Attribute Assertions
// You can check that elements have the right HTML attributes — this is
// especially important for accessibility (alt text, ARIA attributes).
//
// WHAT YOU'LL LEARN:
// - getByAltText() to find images by their alt text
// - getByRole('img') to find images by their ARIA role
// - toHaveAttribute() to check HTML attributes
// - Why testing accessibility attributes matters
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {

  // -------------------------------------------------------------------------
  // Test 1: The profile image renders
  // -------------------------------------------------------------------------
  it('renders the profile image', () => {
    render(<App />)

    // getByAltText() finds any element with a matching alt attribute.
    // If no element has this alt text, the test FAILS immediately —
    // which means you'll know right away if someone removes the alt.
    const img = screen.getByAltText(/profile photo/i)

    expect(img).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 2: The image has required accessibility attributes
  // -------------------------------------------------------------------------
  it('profile image has width and height attributes', () => {
    render(<App />)

    const img = screen.getByAltText(/profile photo/i)

    // toHaveAttribute() checks for a specific HTML attribute.
    // Width and height prevent "layout shift" — that annoying jump
    // you see when images load and push content around.
    expect(img).toHaveAttribute('width', '96')
    expect(img).toHaveAttribute('height', '96')
  })

  // -------------------------------------------------------------------------
  // Test 3: The image points to the right file
  // -------------------------------------------------------------------------
  it('profile image src points to profile.jpg', () => {
    render(<App />)

    const img = screen.getByAltText(/profile photo/i)

    // We check that src contains "profile.jpg" rather than an exact match
    // because Vite may prepend a base path in production builds.
    expect(img).toHaveAttribute('src', '/profile.jpg')
  })

  // -------------------------------------------------------------------------
  // Test 4: The header still contains the DevLog heading
  // -------------------------------------------------------------------------
  it('renders the DevLog heading', () => {
    render(<App />)

    // 💡 REGRESSION TEST: This is the same check from Step 02.
    // By keeping it, we make sure adding the image didn't break the heading.
    // This is regression testing in action!
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toBeInTheDocument()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 4 passing tests. Run `npm test` to verify.
//
// 🤔 CHALLENGE: What happens if you remove the alt attribute from the <img>?
//    Try it! The test should fail with a helpful error message.
//
// 📖 NEXT STEP: In Step 04, you'll test routing — navigation between pages.
// =============================================================================
