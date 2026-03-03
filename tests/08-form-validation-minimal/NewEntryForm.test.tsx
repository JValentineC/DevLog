// =============================================================================
// 🧪 Step 08 — TDD Showcase: Form Validation Testing
// =============================================================================
//
// 🔴🟢🔵 THIS IS THE TDD STEP!
//
// These tests are designed to be written BEFORE the validation code.
// If you're following TDD:
//   1. Copy this file into your project
//   2. Run `npm test` — see failures (RED)
//   3. Implement validation in NewEntryForm.tsx
//   4. Run `npm test` — see passes (GREEN)
//   5. Clean up the code (REFACTOR)
//
// WHAT YOU'LL LEARN:
// - Negative testing (testing error states)
// - Accessibility testing (aria-invalid, role="alert")
// - queryByText() vs getByText()
// - Testing disabled states
// - Testing conditional rendering
// - The full TDD Red-Green-Refactor cycle
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewEntryForm from './components/NewEntryForm'

describe('NewEntryForm — Validation', () => {

  // =========================================================================
  // SECTION 1: ERROR MESSAGES
  // These tests verify that error messages appear when fields are empty.
  // =========================================================================

  // -------------------------------------------------------------------------
  // Test 1: Title error appears when submitted empty
  // -------------------------------------------------------------------------
  it('shows "Title is required" when submitted with an empty title', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    // Submit the form without filling in any fields
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Now the error message should be visible.
    //
    // 💡 CONCEPT: NEGATIVE TESTING
    // We're testing what happens when things go WRONG — empty fields.
    // Most bugs live in error paths because developers focus on the happy path.
    // Good testers write tests for both success AND failure scenarios.
    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 2: Content error appears when submitted empty
  // -------------------------------------------------------------------------
  it('shows "Content is required" when submitted with empty content', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByText(/content is required/i)).toBeInTheDocument()
  })

  // =========================================================================
  // SECTION 2: ERRORS DISAPPEAR
  // After the user fixes an invalid field, the error should go away.
  // =========================================================================

  // -------------------------------------------------------------------------
  // Test 3: No errors shown before the first submit attempt
  // -------------------------------------------------------------------------
  it('does NOT show errors before the form is submitted', () => {
    render(<NewEntryForm />)

    // queryByText() returns null if no match is found (instead of throwing).
    // This is what you use when you want to assert something DOESN'T exist.
    //
    // 💡 CONCEPT: queryBy vs getBy
    //    getByText('...')   → throws error if not found (great for "must exist")
    //    queryByText('...') → returns null if not found (great for "must NOT exist")
    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/content is required/i)).not.toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 4: Title error disappears when user types a title
  // -------------------------------------------------------------------------
  it('hides title error after user types a title', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    // First, trigger the errors
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByText(/title is required/i)).toBeInTheDocument()

    // Now fix the title field
    await user.type(screen.getByLabelText(/title/i), 'A valid title')

    // The title error should disappear
    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
  })

  // =========================================================================
  // SECTION 3: ACCESSIBILITY (a11y)
  // Screen readers need extra attributes to announce errors properly.
  // =========================================================================

  // -------------------------------------------------------------------------
  // Test 5: aria-invalid is set on invalid fields
  // -------------------------------------------------------------------------
  it('sets aria-invalid="true" on the title input when invalid', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    // aria-invalid tells screen readers "this field has an error."
    // It's an HTML attribute, so we use toHaveAttribute() to check it.
    //
    // 💡 CONCEPT: ACCESSIBILITY TESTING
    // Automated tests can catch missing ARIA attributes that would make
    // your form unusable for people who rely on screen readers.
    // This is one of the highest-value things you can test!
    expect(screen.getByLabelText(/title/i)).toHaveAttribute(
      'aria-invalid', 'true'
    )
  })

  it('sets aria-invalid="true" on the content textarea when invalid', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByLabelText(/content/i)).toHaveAttribute(
      'aria-invalid', 'true'
    )
  })

  // -------------------------------------------------------------------------
  // Test 6: Error messages use role="alert"
  // -------------------------------------------------------------------------
  it('error messages have role="alert" for screen reader announcement', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    // role="alert" causes screen readers to IMMEDIATELY announce the text.
    // This is critical — otherwise a blind user wouldn't know something went wrong.
    const alerts = screen.getAllByRole('alert')
    expect(alerts.length).toBeGreaterThanOrEqual(1)
  })

  // =========================================================================
  // SECTION 4: BUTTON STATE
  // The submit button should be disabled when validation fails.
  // =========================================================================

  // -------------------------------------------------------------------------
  // Test 7: Button is disabled after a failed submit
  // -------------------------------------------------------------------------
  it('disables the submit button when validation fails', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    await user.click(screen.getByRole('button', { name: /save/i }))

    // toBeDisabled() checks the `disabled` HTML attribute.
    // A disabled button can't be clicked — it prevents double-submits
    // and tells the user "fix the errors first."
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  // -------------------------------------------------------------------------
  // Test 8: Button is re-enabled after fixing all errors
  // -------------------------------------------------------------------------
  it('re-enables the button when all fields are valid', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm />)

    // Trigger validation
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()

    // Fill in both fields
    await user.type(screen.getByLabelText(/title/i), 'A title')
    await user.type(screen.getByLabelText(/content/i), 'Some content')

    // Button should be enabled again
    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled()
  })

  // =========================================================================
  // SECTION 5: HAPPY PATH (still important!)
  // Even though we're focused on errors, we should verify the form
  // still WORKS correctly when everything is valid.
  // =========================================================================

  // -------------------------------------------------------------------------
  // Test 9: Valid form submits and clears
  // -------------------------------------------------------------------------
  it('submits successfully and clears fields when valid', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(<NewEntryForm />)

    await user.type(screen.getByLabelText(/title/i), 'Valid Title')
    await user.type(screen.getByLabelText(/content/i), 'Valid Content')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Verify submission happened
    expect(consoleSpy).toHaveBeenCalled()

    // Verify fields are cleared
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
    expect(screen.getByLabelText(/content/i)).toHaveValue('')

    // Verify no error messages after successful submit
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  // -------------------------------------------------------------------------
  // Test 10: Form does NOT submit when invalid
  // -------------------------------------------------------------------------
  it('does NOT call console.log when form is invalid', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(<NewEntryForm />)

    // Submit without filling in anything
    await user.click(screen.getByRole('button', { name: /save/i }))

    // console.log should NOT have been called — the form rejected the submit
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 10 passing tests. Run `npm test` to verify.
//
// 📊 TEST COVERAGE SUMMARY:
//    ✓ Error messages appear when fields are empty
//    ✓ Errors disappear when fields are filled
//    ✓ No errors before first submit attempt
//    ✓ aria-invalid set on invalid fields
//    ✓ Error messages use role="alert"
//    ✓ Button disabled when invalid, enabled when valid
//    ✓ Valid form submits and clears
//    ✓ Invalid form does NOT submit
//
// 🎉 CONGRATULATIONS!
// If you followed the TDD workflow (write tests → see red → implement →
// see green → refactor), you just completed your first TDD cycle!
//
// 💡 WHY THIS MATTERS FOR YOUR CAREER:
// In technical interviews, employers ask about TDD. You can now say:
// "I've practiced TDD — I've written failing tests first and used them
// to drive my implementation. For example, I test-drove form validation
// with accessibility attributes like aria-invalid and role=alert."
//
// 📖 NEXT STEP: Step 09 — testing state lifting and component communication.
// =============================================================================
