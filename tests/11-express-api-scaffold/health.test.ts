// =============================================================================
// 🧪 Step 11 — API Testing with supertest
// =============================================================================
//
// CONCEPT: HTTP Request Testing
// supertest sends real HTTP requests to your Express app WITHOUT starting
// a server. This makes tests fast and doesn't need a port to be free.
//
// WHAT YOU'LL LEARN:
// - Using supertest to make GET/POST/PUT/DELETE requests
// - Testing HTTP status codes
// - Testing response body (JSON)
// - Testing response headers (CORS)
//
// SETUP: You need to export `app` from a separate file:
//   src/app.ts  → export default app  (used by tests)
//   src/index.ts → import app; app.listen(PORT)  (used to start)
//
// INSTALL:
//   npm install -D supertest @types/supertest vitest
//
// =============================================================================

import request from 'supertest'
import app from './app'  // Import the app, NOT the server

describe('GET /api/health', () => {

  // -------------------------------------------------------------------------
  // Test 1: Health endpoint returns 200
  // -------------------------------------------------------------------------
  it('returns status 200', async () => {
    // request(app) creates a supertest instance that sends requests
    // to your Express app. .get('/api/health') sends a GET request.
    const response = await request(app).get('/api/health')

    // .status is the HTTP status code
    expect(response.status).toBe(200)
  })

  // -------------------------------------------------------------------------
  // Test 2: Health endpoint returns the correct JSON
  // -------------------------------------------------------------------------
  it('returns { status: "ok" } in the body', async () => {
    const response = await request(app).get('/api/health')

    // .body is the parsed JSON response
    expect(response.body).toHaveProperty('status', 'ok')
    //
    // 💡 We use toHaveProperty() instead of toEqual() because the
    //    response might include extra fields like `timestamp`.
    //    toHaveProperty() checks for ONE specific field.
  })

  // -------------------------------------------------------------------------
  // Test 3: Response is JSON content type
  // -------------------------------------------------------------------------
  it('returns Content-Type application/json', async () => {
    const response = await request(app).get('/api/health')

    // .headers contains all response headers
    // Content-Type should include 'application/json'
    expect(response.headers['content-type']).toMatch(/json/)
    //
    // 💡 We use toMatch() with a regex because the full header is
    //    "application/json; charset=utf-8" — we just need the json part.
  })

})

describe('Non-existent routes', () => {

  // -------------------------------------------------------------------------
  // Test 4: Unknown routes return 404
  // -------------------------------------------------------------------------
  it('returns 404 for unknown path', async () => {
    const response = await request(app).get('/api/nonexistent')

    expect(response.status).toBe(404)
  })

})

// =============================================================================
// ✅ CHECKPOINT
// You should have 4 passing tests. Run `npm test` to verify.
//
// 💡 PATTERN: REQUEST → RESPONSE → ASSERT
// Every API test follows this pattern:
//   1. Send a request (GET, POST, PUT, DELETE)
//   2. Receive the response
//   3. Assert status code, body, and/or headers
//
// 📖 NEXT STEP: Step 12 — testing database connectivity with /api/health/ready
// =============================================================================
