// =============================================================================
// 🧪 Step 02 — Your First Test: "Does It Render?"
// =============================================================================
//
// CONCEPT: Smoke Test / Render Test
// A smoke test checks that a component mounts without crashing.
// It's the simplest, most valuable test you can write.
//
// WHAT YOU'LL LEARN:
// - How to use render() to mount a component
// - How to use screen.getByRole() to find elements
// - How to use screen.getByText() to find text
// - The expect().toBeInTheDocument() matcher
//
// RUN THIS TEST:
//   npm test
//
// =============================================================================

import { render, screen } from '@testing-library/react'

// This is the component we're testing — your cleaned-up App from Step 2.
import App from './App'

// --------------------------------------------------------------------------
// describe() groups related tests together.
// Think of it as a chapter title in a book.
// --------------------------------------------------------------------------
describe('App', () => {

  // --------------------------------------------------------------------------
  // it() defines a single test case.
  // The string should read like a sentence: "it renders the heading"
  // --------------------------------------------------------------------------
  it('renders the DevLog heading', () => {
    // render() mounts the component into a fake browser DOM (jsdom).
    // After this line, the component's HTML exists in memory.
    render(<App />)

    // screen.getByRole() finds elements by their ARIA role.
    // <h1> has the implicit role "heading".
    // The { level: 1 } option targets <h1> specifically (level 2 = <h2>, etc.)
    const heading = screen.getByRole('heading', { level: 1 })

    // expect() + toBeInTheDocument() asserts that the element exists.
    // If the heading is missing, this line fails and tells you exactly why.
    expect(heading).toBeInTheDocument()
  })

  it('renders the Home section', () => {
    render(<App />)

    // screen.getByText() searches for visible text content.
    // This is useful for paragraphs and other non-semantic text.
    expect(
      screen.getByText(/Welcome to my DevLog/i)
    ).toBeInTheDocument()
    //
    // 💡 The /i flag makes the regex case-insensitive.
    //    Using a regex instead of an exact string makes your test
    //    less brittle — it won't break if you capitalize a word.
  })

  it('renders the About section', () => {
    render(<App />)

    // We check for the About heading. Since it's an <h2>, we use level: 2.
    expect(
      screen.getByRole('heading', { level: 2, name: /About/i })
    ).toBeInTheDocument()
    //
    // 💡 The `name` option filters by the element's accessible name.
    //    For headings, that's the text content.
  })

  it('renders the footer', () => {
    render(<App />)

    // Check for the copyright text in the footer.
    expect(
      screen.getByText(/© 2026 DevLog/i)
    ).toBeInTheDocument()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 4 passing tests. Run `npm test` to verify.
//
// 🤔 CHALLENGE: Can you add a test that checks for the <main> element?
//    Hint: screen.getByRole('main')
//
// 📖 NEXT STEP: In Step 03, you'll learn to test DOM attributes on images.
// =============================================================================
