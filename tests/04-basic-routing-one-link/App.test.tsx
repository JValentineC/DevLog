// =============================================================================
// 🧪 Step 04 — Testing Client-Side Routing
// =============================================================================
//
// CONCEPT: MemoryRouter for Test Navigation
// In tests, we can't use a real browser URL bar. MemoryRouter keeps the
// navigation history in memory so we can test route changes.
//
// WHAT YOU'LL LEARN:
// - Wrapping components in MemoryRouter for tests
// - Using initialEntries to start on a specific page
// - Simulating clicks with userEvent
// - Async tests for user interactions
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// --------------------------------------------------------------------------
// Helper: render the App inside a MemoryRouter
// --------------------------------------------------------------------------
// We need MemoryRouter because App uses <Routes> and <Route> from
// react-router-dom. Without a router wrapper, the test would crash.
//
// 💡 In your actual app, main.tsx wraps <App /> in <HashRouter>.
//    In tests, we swap HashRouter for MemoryRouter so we can control
//    the starting URL.
// --------------------------------------------------------------------------
function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  )
}

describe('Routing', () => {

  // -------------------------------------------------------------------------
  // Test 1: Home page renders at "/"
  // -------------------------------------------------------------------------
  it('renders the Home page at /', () => {
    renderApp('/')

    expect(
      screen.getByRole('heading', { name: /Welcome/i })
    ).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 2: About page renders at "/about"
  // -------------------------------------------------------------------------
  it('renders the About page at /about', () => {
    // We start directly on /about using initialEntries
    renderApp('/about')

    expect(
      screen.getByRole('heading', { name: /About/i })
    ).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 3: Clicking a link navigates between pages
  // -------------------------------------------------------------------------
  it('navigates from Home to About when the link is clicked', async () => {
    // userEvent.setup() creates a "user" that can type, click, etc.
    // Always call it BEFORE render().
    const user = userEvent.setup()

    renderApp('/')

    // Find the link by its role and accessible name
    const aboutLink = screen.getByRole('link', { name: /about/i })

    // Simulate a click — this is ASYNC because real clicks are async.
    // That's why the test function is marked `async` above.
    await user.click(aboutLink)

    // After clicking, the About page should be visible
    expect(
      screen.getByRole('heading', { name: /About/i })
    ).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 4: Navigate back from About to Home
  // -------------------------------------------------------------------------
  it('navigates from About back to Home', async () => {
    const user = userEvent.setup()

    renderApp('/about')

    const homeLink = screen.getByRole('link', { name: /home|back/i })
    await user.click(homeLink)

    expect(
      screen.getByRole('heading', { name: /Welcome/i })
    ).toBeInTheDocument()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 4 passing tests. Run `npm test` to verify.
//
// 🤔 CHALLENGE: Add a test that starts on a non-existent route like "/xyz".
//    What happens? Does React Router show anything? (This question foreshadows
//    the 404 page you'll build in Step 22.)
//
// 📖 NEXT STEP: In Step 05, you'll test individual components in isolation.
// =============================================================================
