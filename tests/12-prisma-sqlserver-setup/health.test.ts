// =============================================================================
// 🧪 Step 12 — Testing Database Connectivity
// =============================================================================
//
// CONCEPT: Mocking External Dependencies
// The /api/health/ready endpoint talks to the database. In tests, we don't
// want to require a real database — so we MOCK the Prisma client.
//
// WHAT YOU'LL LEARN:
// - vi.mock() to replace entire modules
// - mockResolvedValue() for async functions that resolve
// - mockRejectedValue() for async functions that reject (error simulation)
// - Testing both success and failure paths
//
// =============================================================================

import request from 'supertest'

// --------------------------------------------------------------------------
// MOCK SETUP — must be BEFORE importing the app
// --------------------------------------------------------------------------
// vi.mock() intercepts the import of './lib/prisma' and replaces it
// with our fake object. The real Prisma client is never loaded.
//
// 💡 IMPORTANT: vi.mock() is "hoisted" — Vitest moves it to the top
//    of the file automatically. But for readability, put it early.
// --------------------------------------------------------------------------
vi.mock('./lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}))

import app from './app'
import { prisma } from './lib/prisma'

// Cast to a mock so TypeScript knows about .mockResolvedValue(), etc.
const mockQueryRaw = prisma.$queryRaw as ReturnType<typeof vi.fn>

describe('GET /api/health', () => {

  it('returns 200 with status ok (no DB needed)', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
  })

})

describe('GET /api/health/ready', () => {

  // -------------------------------------------------------------------------
  // Test: Database is reachable → returns "ready"
  // -------------------------------------------------------------------------
  it('returns 200 with status "ready" when DB is reachable', async () => {
    // mockResolvedValue() makes the function return a resolved Promise.
    // This simulates a successful database query.
    mockQueryRaw.mockResolvedValue([{ 1: 1 }])

    const res = await request(app).get('/api/health/ready')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'ready')
  })

  // -------------------------------------------------------------------------
  // Test: Database is DOWN → returns 503
  // -------------------------------------------------------------------------
  it('returns 503 when DB is unreachable', async () => {
    // mockRejectedValue() makes the function throw an error.
    // This simulates a database connection failure.
    mockQueryRaw.mockRejectedValue(new Error('Connection refused'))

    const res = await request(app).get('/api/health/ready')

    expect(res.status).toBe(503)
    expect(res.body).toHaveProperty('status', 'unavailable')
    //
    // 💡 CONCEPT: TESTING FAILURE PATHS
    // The happy path (DB is up) is obvious. But the failure path
    // (DB is down) is just as important. In production, databases
    // go down. Your health check should report it, not crash.
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 3 passing tests. Run `npm test` to verify.
//
// 📖 NEXT STEP: Step 13 — CRUD endpoint testing (the big one!)
// =============================================================================
