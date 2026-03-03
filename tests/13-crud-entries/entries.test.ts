// =============================================================================
// 🧪 Step 13 — CRUD API Testing with supertest
// =============================================================================
//
// CONCEPT: Full CRUD Endpoint Testing
// This is the most comprehensive API test file in the curriculum.
// You'll test every endpoint, every status code, and every edge case.
//
// WHAT YOU'LL LEARN:
// - POST with .send() for creating resources
// - PUT with .send() for updating resources
// - DELETE requests
// - Testing 201, 200, 204, 400, 404 status codes
// - vi.clearAllMocks() to reset between tests
// - beforeEach() lifecycle hook
// - Mocking Prisma for all CRUD operations
//
// =============================================================================

import request from 'supertest'

// --------------------------------------------------------------------------
// MOCK the Prisma client
// --------------------------------------------------------------------------
vi.mock('./lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
    entry: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import app from './app'
import { prisma } from './lib/prisma'

// Cast to mocks for TypeScript
const mockFindMany = prisma.entry.findMany as ReturnType<typeof vi.fn>
const mockFindUnique = prisma.entry.findUnique as ReturnType<typeof vi.fn>
const mockCreate = prisma.entry.create as ReturnType<typeof vi.fn>
const mockUpdate = prisma.entry.update as ReturnType<typeof vi.fn>
const mockDelete = prisma.entry.delete as ReturnType<typeof vi.fn>

// --------------------------------------------------------------------------
// TEST FIXTURE — fake entry data
// --------------------------------------------------------------------------
const fakeEntry = {
  id: 1,
  title: 'Test Entry',
  summary: 'A test summary',
  mood: 'happy',
  tags: 'testing',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// --------------------------------------------------------------------------
// beforeEach() runs before EVERY test in this file.
// We use it to reset all mocks so tests don't leak state.
// --------------------------------------------------------------------------
beforeEach(() => {
  vi.clearAllMocks()
})

// =========================================================================
// CREATE — POST /api/entries
// =========================================================================
describe('POST /api/entries', () => {

  it('returns 201 and the created entry on success', async () => {
    // Tell the mock what to return when Prisma creates an entry
    mockCreate.mockResolvedValue(fakeEntry)

    const res = await request(app)
      .post('/api/entries')
      .send({
        title: 'Test Entry',
        summary: 'A test summary',
        mood: 'happy',
        tags: 'testing',
      })

    // 201 = "Created" — the standard response for successful POST
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('title', 'Test Entry')
    expect(res.body).toHaveProperty('mood', 'happy')

    // Verify Prisma was called
    expect(mockCreate).toHaveBeenCalledTimes(1)
  })

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/entries')
      .send({ summary: 'No title', mood: 'happy' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')

    // Prisma should NOT have been called — validation rejected first
    expect(mockCreate).not.toHaveBeenCalled()
    //
    // 💡 CONCEPT: VALIDATION BEFORE DATABASE
    // Always validate input before calling the database. This test
    // verifies that pattern by checking the DB mock was NOT called.
  })

  it('returns 400 when summary is missing', async () => {
    const res = await request(app)
      .post('/api/entries')
      .send({ title: 'No summary', mood: 'happy' })

    expect(res.status).toBe(400)
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('returns 400 when mood is missing', async () => {
    const res = await request(app)
      .post('/api/entries')
      .send({ title: 'No mood', summary: 'Missing mood' })

    expect(res.status).toBe(400)
    expect(mockCreate).not.toHaveBeenCalled()
  })

})

// =========================================================================
// READ ALL — GET /api/entries
// =========================================================================
describe('GET /api/entries', () => {

  it('returns 200 and an array of entries', async () => {
    mockFindMany.mockResolvedValue([fakeEntry])

    const res = await request(app).get('/api/entries')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(1)
  })

  it('returns an empty array when no entries exist', async () => {
    mockFindMany.mockResolvedValue([])

    const res = await request(app).get('/api/entries')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

})

// =========================================================================
// READ ONE — GET /api/entries/:id
// =========================================================================
describe('GET /api/entries/:id', () => {

  it('returns 200 and the entry when found', async () => {
    mockFindUnique.mockResolvedValue(fakeEntry)

    const res = await request(app).get('/api/entries/1')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('title', 'Test Entry')
  })

  it('returns 404 when entry does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    const res = await request(app).get('/api/entries/999')

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 400 when id is not a number', async () => {
    const res = await request(app).get('/api/entries/abc')

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'id must be a number')
    //
    // 💡 CONCEPT: INPUT VALIDATION TESTING
    // Passing "abc" as an ID tests that the server validates input
    // before trying to use it. Without this check, the database
    // would receive an invalid query and might throw an ugly error.
  })

})

// =========================================================================
// UPDATE — PUT /api/entries/:id
// =========================================================================
describe('PUT /api/entries/:id', () => {

  it('returns 200 and the updated entry', async () => {
    mockFindUnique.mockResolvedValue(fakeEntry)
    mockUpdate.mockResolvedValue({ ...fakeEntry, title: 'Updated Title' })

    const res = await request(app)
      .put('/api/entries/1')
      .send({
        title: 'Updated Title',
        summary: 'Updated summary',
        mood: 'curious',
        tags: 'updated',
      })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('title', 'Updated Title')
  })

  it('returns 404 when entry does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    const res = await request(app)
      .put('/api/entries/999')
      .send({
        title: 'Nope',
        summary: 'Not found',
        mood: 'frustrated',
      })

    expect(res.status).toBe(404)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .put('/api/entries/1')
      .send({ title: 'Only title' })

    expect(res.status).toBe(400)
  })

})

// =========================================================================
// DELETE — DELETE /api/entries/:id
// =========================================================================
describe('DELETE /api/entries/:id', () => {

  it('returns 204 No Content on success', async () => {
    mockFindUnique.mockResolvedValue(fakeEntry)
    mockDelete.mockResolvedValue(fakeEntry)

    const res = await request(app).delete('/api/entries/1')

    // 204 = "No Content" — the standard response for successful DELETE.
    // The body should be empty (no JSON to return when something is deleted).
    expect(res.status).toBe(204)
  })

  it('returns 404 when entry does not exist', async () => {
    mockFindUnique.mockResolvedValue(null)

    const res = await request(app).delete('/api/entries/999')

    expect(res.status).toBe(404)
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it('returns 400 when id is not a number', async () => {
    const res = await request(app).delete('/api/entries/abc')

    expect(res.status).toBe(400)
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 15 passing tests. Run `npm test` to verify.
//
// 📊 COVERAGE SUMMARY:
//    POST  → 201 success, 400 missing title, 400 missing summary, 400 missing mood
//    GET / → 200 with entries, 200 empty array
//    GET /:id → 200 found, 404 not found, 400 invalid id
//    PUT /:id → 200 updated, 404 not found, 400 missing fields
//    DELETE /:id → 204 success, 404 not found, 400 invalid id
//
// 💡 TESTING PATTERN: For each endpoint, test:
//    1. Success (happy path)
//    2. Validation error (bad input)
//    3. Not found (missing resource)
//    4. Invalid input type
//
// 📖 NEXT STEP: Step 14 — testing frontend fetch() calls
// =============================================================================
