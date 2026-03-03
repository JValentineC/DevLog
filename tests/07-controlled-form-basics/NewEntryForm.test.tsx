// =============================================================================
// 🧪 Step 07 — Testing Controlled Form Inputs
// =============================================================================
//
// CONCEPT: User Interaction Testing
// We simulate typing and clicking to verify that React controlled inputs
// update their values correctly and the form submits as expected.
//
// WHAT YOU'LL LEARN:
// - userEvent.setup() for creating a virtual user
// - user.type() to simulate typing into inputs
// - user.click() to simulate button clicks
// - getByLabelText() to find inputs by their label
// - toHaveValue() to check input values
// - vi.spyOn() to intercept console.log calls
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewEntryForm from './components/NewEntryForm'

describe('NewEntryForm', () => {

  // -------------------------------------------------------------------------
  // Test 1: The form renders with empty fields
  // -------------------------------------------------------------------------
  it('renders title and content fields', () => {
    render(<NewEntryForm />)

    // getByLabelText() finds an input connected to a <label>.
    // This only works if your HTML is accessible — <label htmlFor="...">
    // must match <input id="...">.
    const titleInput = screen.getByLabelText(/title/i)
    const contentInput = screen.getByLabelText(/content/i)

    expect(titleInput).toBeInTheDocument()
    expect(contentInput).toBeInTheDocument()

    // Both should start empty (controlled inputs initialized to '')
    expect(titleInput).toHaveValue('')
    expect(contentInput).toHaveValue('')
  })

  // -------------------------------------------------------------------------
  // Test 2: Typing updates the input value (controlled input)
  // -------------------------------------------------------------------------
  it('updates title when user types', async () => {
    // Always call userEvent.setup() BEFORE render()
    const user = userEvent.setup()

    render(<NewEntryForm />)

    const titleInput = screen.getByLabelText(/title/i)

    // user.type() simulates real keystrokes: focus → keydown → input → keyup
    // for EACH character. This is why it must be awaited.
    await user.type(titleInput, 'My First Entry')

    // toHaveValue() checks the input's current value attribute
    expect(titleInput).toHaveValue('My First Entry')
  })

  it('updates content when user types', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    const contentInput = screen.getByLabelText(/content/i)
    await user.type(contentInput, 'Learned about testing today')

    expect(contentInput).toHaveValue('Learned about testing today')
  })

  // -------------------------------------------------------------------------
  // Test 3: Submitting the form logs data and clears fields
  // -------------------------------------------------------------------------
  it('logs form data and clears fields on submit', async () => {
    const user = userEvent.setup()

    // vi.spyOn() intercepts calls to console.log so we can verify
    // what was logged without it actually printing to the terminal.
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(<NewEntryForm />)

    // Fill in the form
    await user.type(screen.getByLabelText(/title/i), 'Test Title')
    await user.type(screen.getByLabelText(/content/i), 'Test Content')

    // Submit the form by clicking the button
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Verify console.log was called with the form data
    expect(consoleSpy).toHaveBeenCalledWith('Submitted:', {
      title: 'Test Title',
      content: 'Test Content',
    })

    // Verify fields are cleared after submission
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
    expect(screen.getByLabelText(/content/i)).toHaveValue('')

    // Clean up the spy so it doesn't affect other tests
    consoleSpy.mockRestore()
  })

  // -------------------------------------------------------------------------
  // Test 4: The form has a submit button
  // -------------------------------------------------------------------------
  it('renders a Save Entry button', () => {
    render(<NewEntryForm />)

    expect(
      screen.getByRole('button', { name: /save entry/i })
    ).toBeInTheDocument()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 5 passing tests. Run `npm test` to verify.
//
// 💡 vi.spyOn() EXPLAINED:
//    Normally console.log actually prints to the terminal. spyOn() replaces
//    it with a fake function that records calls. After the test, we call
//    mockRestore() to put the real console.log back.
//
// 🤔 CHALLENGE: What happens if you remove the event.preventDefault() from
//    handleSubmit? Does the test still pass? (Hint: yes, but the page would
//    reload in a real browser — tests don't catch everything!)
//
// 📖 NEXT STEP: Step 08 — TDD with form validation
// =============================================================================
