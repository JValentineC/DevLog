# Test Plan -- Step 01: Getting Started

## Learning Objective

Welcome to the **DevLog Testing Curriculum**! Before you write a single test, you need
to understand *why* testing matters and what you'll learn as you progress through these
folders.

### What Is Testing?

Testing is the practice of writing **code that checks your other code**. Instead of
manually opening a browser and clicking around every time you make a change, you write
small programs (tests) that do the checking for you -- automatically, in seconds.

### Why Should You Care?

1. **Confidence** -- Tests let you change code without fear of breaking something.
2. **Documentation** -- A test suite describes what your app is *supposed* to do.
3. **Employability** -- Employers look for engineers who can write and maintain tests.
 It's a career differentiator.
4. **Speed** -- Running 50 tests takes seconds. Manually testing 50 features takes hours.

### What Is TDD (Test-Driven Development)?

TDD flips the normal workflow:

```
Traditional: Write code -> Write tests -> Fix bugs
TDD: Write a failing test -> Write code to pass -> Refactor
```

This is called the **Red-Green-Refactor** cycle:

| Phase | What Happens |
|------------|-----------------------------------------------|
| **Red** | Write a test that fails (it *should* fail -- the feature doesn't exist yet) |
| **Green** | Write the minimum code to make the test pass |
| **Refactor**| Clean up the code while keeping tests green |

You'll practice this starting in Step 8.

### What Is Regression Testing?

A **regression** is when something that *used to work* breaks because of a new change.
Regression testing means re-running your full test suite after every change to catch
regressions early. This is what CI/CD pipelines do automatically (you'll set one up in
Step 21).

### What Tools Will We Use?

| Tool | Purpose |
|------|---------|
| **Vitest** | Fast test runner built for Vite projects |
| **React Testing Library** | Renders components and queries the DOM the way a user would |
| **@testing-library/user-event** | Simulates real user interactions (typing, clicking) |
| **@testing-library/jest-dom** | Extra matchers like `toBeInTheDocument()`, `toBeDisabled()` |
| **supertest** (Step 11+) | Tests Express API endpoints without starting a server |

### What About This Step?

Step 1 scaffolds a brand-new Vite project. There's nothing custom to test yet -- you're
just verifying the toolchain works. But this is your chance to **install the testing
tools** so they're ready for Step 2:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Then add to your `vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
 plugins: [react()],
 test: {
 environment: 'jsdom', // Simulate a browser DOM
 globals: true, // Use describe/it/expect without imports
 setupFiles: './src/test-setup.ts',
 },
})
```

Create `src/test-setup.ts`:

```ts
import '@testing-library/jest-dom' // Adds custom matchers to expect()
```

And add a script to `package.json`:

```json
"scripts": {
 "test": "vitest run",
 "test:watch": "vitest"
}
```

---

## Manual Testing Checklist

| # | Step | Expected Result | Pass? |
|----|------|-----------------|-------|
| 1 | Run `npm create vite@latest` and choose React + TypeScript | Project scaffolded without errors | [ ] |
| 2 | Run `npm install` | All dependencies installed | [ ] |
| 3 | Run `npm run dev` | Dev server starts on `http://localhost:5173` | [ ] |
| 4 | Open the URL in a browser | Vite + React splash page appears | [ ] |
| 5 | Click the **count** button | Counter increments on each click | [ ] |
| 6 | Edit `src/App.tsx` and save | Page hot-reloads without manual refresh (HMR) | [ ] |
| 7 | Run `npm run build` | Build completes with 0 errors | [ ] |
| 8 | Run `npm test` (after installing test tools above) | Vitest runs, 0 tests found (that's fine!) | [ ] |

---

## What's Next?

In **Step 2**, you'll write your **very first test** -- a simple "does the page render?"
check. Every step after that builds on the last, teaching you a new testing concept.

> **Pro tip:** Keep a testing journal. Each time you learn a new testing technique,
> write a one-sentence note. By Step 35 you'll have a personal reference guide.
