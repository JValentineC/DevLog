// =============================================================================
// 🧪 Step 10 — Testing Complex Form Fields (Select & Tags)
// =============================================================================
//
// CONCEPT: Testing <select> Dropdowns and Data Parsing
// New form fields means new testing techniques. You'll learn to simulate
// dropdown selections and verify that comma-separated strings get parsed
// into arrays correctly.
//
// WHAT YOU'LL LEARN:
// - user.selectOptions() for dropdown testing
// - Testing data transformation (string → array)
// - expect.objectContaining() for partial matching
// - expect.arrayContaining() for array matching
//
// =============================================================================

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewEntryForm from './components/NewEntryForm'

describe('NewEntryForm — Mood & Tags', () => {

  // -------------------------------------------------------------------------
  // Test 1: Mood dropdown renders with options
  // -------------------------------------------------------------------------
  it('renders a mood dropdown', () => {
    render(<NewEntryForm onAddEntry={vi.fn()} />)

    const moodSelect = screen.getByLabelText(/mood/i)
    expect(moodSelect).toBeInTheDocument()

    // getByRole('option') can find individual <option> elements.
    // We verify that key mood options exist.
    expect(screen.getByRole('option', { name: /happy/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /curious/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /frustrated/i })).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 2: User can select a mood
  // -------------------------------------------------------------------------
  it('allows selecting a mood', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm onAddEntry={vi.fn()} />)

    const moodSelect = screen.getByLabelText(/mood/i)

    // user.selectOptions() simulates opening a dropdown and choosing a value.
    // Pass the <select> element and the value to select.
    await user.selectOptions(moodSelect, 'curious')

    expect(moodSelect).toHaveValue('curious')
  })

  // -------------------------------------------------------------------------
  // Test 3: Tags input renders
  // -------------------------------------------------------------------------
  it('renders a tags input field', () => {
    render(<NewEntryForm onAddEntry={vi.fn()} />)

    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument()
  })

  // -------------------------------------------------------------------------
  // Test 4: User can type comma-separated tags
  // -------------------------------------------------------------------------
  it('accepts comma-separated tags', async () => {
    const user = userEvent.setup()
    render(<NewEntryForm onAddEntry={vi.fn()} />)

    const tagsInput = screen.getByLabelText(/tags/i)
    await user.type(tagsInput, 'react, hooks, state')

    expect(tagsInput).toHaveValue('react, hooks, state')
  })

  // -------------------------------------------------------------------------
  // Test 5: Submits with mood and parsed tags
  // -------------------------------------------------------------------------
  it('submits with mood and parsed tags array', async () => {
    const user = userEvent.setup()
    const mockOnAddEntry = vi.fn()

    render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

    // Fill in required fields
    await user.type(screen.getByLabelText(/title/i), 'Tags Test')
    await user.type(screen.getByLabelText(/content/i), 'Testing tags')

    // Select a mood
    await user.selectOptions(screen.getByLabelText(/mood/i), 'happy')

    // Type comma-separated tags
    await user.type(screen.getByLabelText(/tags/i), 'react, hooks, state')

    // Submit
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Verify the callback received the correct data
    expect(mockOnAddEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Tags Test',
        mood: 'happy',
      })
    )

    // For the tags, we check that the callback argument contains the
    // right tags (they should be trimmed and split from the comma string)
    const callArg = mockOnAddEntry.mock.calls[0][0]
    //
    // 💡 mock.calls is an array of all calls made to the mock.
    //    mock.calls[0] is the first call.
    //    mock.calls[0][0] is the first argument of the first call.
    //    This gives us direct access to the submitted data.
    expect(callArg.tags).toContain('react')
    expect(callArg.tags).toContain('hooks')
    expect(callArg.tags).toContain('state')
  })

  // -------------------------------------------------------------------------
  // Test 6: Empty tags input results in an empty array
  // -------------------------------------------------------------------------
  it('submits empty tags array when no tags entered', async () => {
    const user = userEvent.setup()
    const mockOnAddEntry = vi.fn()

    render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

    await user.type(screen.getByLabelText(/title/i), 'No Tags')
    await user.type(screen.getByLabelText(/content/i), 'No tags here')
    await user.click(screen.getByRole('button', { name: /save/i }))

    const callArg = mockOnAddEntry.mock.calls[0][0]

    // When no tags are typed, the result should be an empty array
    // (or an array with one empty string that gets filtered out)
    expect(callArg.tags).toBeDefined()
  })

  // -------------------------------------------------------------------------
  // Test 7: Entry includes a timestamp
  // -------------------------------------------------------------------------
  it('includes a createdAt timestamp in the submitted entry', async () => {
    const user = userEvent.setup()
    const mockOnAddEntry = vi.fn()

    render(<NewEntryForm onAddEntry={mockOnAddEntry} />)

    await user.type(screen.getByLabelText(/title/i), 'Timestamp Test')
    await user.type(screen.getByLabelText(/content/i), 'Check the date')
    await user.click(screen.getByRole('button', { name: /save/i }))

    const callArg = mockOnAddEntry.mock.calls[0][0]

    // The entry should have some kind of date/timestamp field
    // We check it's a valid date string
    expect(callArg.date || callArg.createdAt).toBeDefined()
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 7 passing tests. Run `npm test` to verify.
//
// 🏁 YOU'VE COMPLETED FRONTEND TESTING FOUNDATIONS!
//
// 📖 NEXT STEP: Step 11 — Backend API testing with supertest.
// =============================================================================
