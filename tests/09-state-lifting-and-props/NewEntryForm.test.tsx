// =============================================================================
// 🧪 Step 09 — Testing State Lifting & Props
// =============================================================================
//
// CONCEPT: Mock Functions & Component Communication
// When a child calls a prop callback (like onAddEntry), we need to verify
// the callback was called with the right data. vi.fn() lets us do this.
//
// WHAT YOU'LL LEARN:
// - vi.fn() — creating mock functions
// - toHaveBeenCalledWith() — checking callback arguments
// - Testing the flow: user types → submits → callback fires
// - The difference between mocking and spying
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewEntryForm from './components/NewEntryForm'

describe('NewEntryForm — with onAddEntry prop', () => {

  // -------------------------------------------------------------------------
  // Test 1: Calls onAddEntry with the form data on valid submit
  // -------------------------------------------------------------------------
  it('calls onAddEntry with title and content when submitted', async () => {
    const user = userEvent.setup()

    // vi.fn() creates a "mock function" — a fake function that records
    // every call made to it. Think of it as a spy with a notebook.
    //
    // 💡 CONCEPT: MOCK FUNCTIONS
    // Instead of testing the REAL onAddEntry (which would need the full App),
    // we give the component a FAKE one. After the test, we check what it
    // was called with. This isolates the component from its parent.
    const mockOnAddEntry = vi.fn()

    // Pass the mock as the onAddEntry prop
    render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

    // Fill in the form
    await user.type(screen.getByLabelText(/title/i), 'State Lifting')
    await user.type(screen.getByLabelText(/content/i), 'Props flow down, callbacks flow up')

    // Submit
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Verify the mock was called with the right data
    // toHaveBeenCalledWith() checks the EXACT arguments
    expect(mockOnAddEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'State Lifting',
        content: 'Props flow down, callbacks flow up',
      })
    )
    //
    // 💡 expect.objectContaining() is a partial matcher.
    // It allows extra properties (like id, date) to exist without failing.
    // This is useful when the function adds properties we don't control.
  })

  // -------------------------------------------------------------------------
  // Test 2: Does NOT call onAddEntry when form is invalid
  // -------------------------------------------------------------------------
  it('does NOT call onAddEntry when form is invalid', async () => {
    const user = userEvent.setup()
    const mockOnAddEntry = vi.fn()

    render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

    // Submit without filling in anything
    await user.click(screen.getByRole('button', { name: /save/i }))

    // The mock should NOT have been called — validation prevented it
    expect(mockOnAddEntry).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // Test 3: Clears the form after successful submit
  // -------------------------------------------------------------------------
  it('clears fields after a successful submit', async () => {
    const user = userEvent.setup()
    const mockOnAddEntry = vi.fn()

    render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

    await user.type(screen.getByLabelText(/title/i), 'Will be cleared')
    await user.type(screen.getByLabelText(/content/i), 'Also cleared')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Fields should be empty after submit
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
    expect(screen.getByLabelText(/content/i)).toHaveValue('')
  })

  // -------------------------------------------------------------------------
  // Test 4: Verify the mock was called exactly once
  // -------------------------------------------------------------------------
  it('calls onAddEntry exactly once per submission', async () => {
    const user = userEvent.setup()
    const mockOnAddEntry = vi.fn()

    render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

    await user.type(screen.getByLabelText(/title/i), 'Once')
    await user.type(screen.getByLabelText(/content/i), 'Only once')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // toHaveBeenCalledTimes(1) ensures no double-submit
    expect(mockOnAddEntry).toHaveBeenCalledTimes(1)
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 4 passing tests. Run `npm test` to verify.
//
// 💡 MOCK vs SPY:
//    vi.fn()    = mock — a brand new fake function
//    vi.spyOn() = spy — wraps a REAL function to record calls
//    Use mocks for props/callbacks, spies for existing functions.
//
// 📖 NEXT STEP: Step 10 — testing select dropdowns and tag input parsing.
// =============================================================================
