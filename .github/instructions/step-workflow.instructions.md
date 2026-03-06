---
description: "Workflow for implementing a new step: code in jvc-dev-log, create step folder, update demo data, deploy GitHub Pages, commit & push."
applyTo: "**"
---

# Step Implementation Workflow

When the user asks to "do step NN", follow these phases in order.

## Phase 1 — Implement in jvc-dev-log

1. **Read the root README** to confirm the step title and description.
2. **Identify the files** that need to change (backend, frontend, types, tests).
3. **Make the code changes** in `jvc-dev-log/`.
4. **Run `npm run build`** inside `jvc-dev-log/` to verify zero TypeScript errors.

## Phase 2 — Update Demo Layer (jvc-dev-log only)

All demo/dummy data updates happen **only inside `jvc-dev-log/`** — dummy data files are never copied into step folders.

If the step adds or changes data shapes:

1. **Update `jvc-dev-log/src/data/demo-data.ts`** — keep DemoData functions in sync with real API shapes.
2. **Add an entry to `jvc-dev-log/public/data/dummy-logs.json`** for this step. Every step gets its own log entry following the existing format:
   - `id`: next sequential integer
   - `title`: `"Step NN – Step Title"`
   - `summary`: 3–5 sentence recap of the step written in JV's voice — casual, encouraging, includes a dad/programming joke, ends with `Keep coding, keep reading ~jv`
   - `mood`: one of `"happy"`, `"curious"`, `"frustrated"`, `"proud"` (vary across steps)
   - `tags`: 3–4 lowercase kebab-case keywords relevant to the step's concepts
   - `createdAt` / `updatedAt`: ISO timestamp, one day after the previous entry, at `T09:00:00.000Z`
   - `author`: `"jv"` (or `null` for pre-step-31 entries that lack the field)
3. **Update `jvc-dev-log/public/data/dummy-users.json`** — only if User model changes.
4. **Rebuild** to confirm demo-data compiles.

> **Important:** Dummy data files (`dummy-logs.json`, `dummy-users.json`) and `demo-data.ts` are **not included** in step folders. They live exclusively in `jvc-dev-log/`.

## Phase 3 — Create Step Folder

1. **Copy only changed/new files** into `NN-step-name/` (see `step-generation.instructions.md` for README template).
2. The step folder contains **only the diff** — files the learner would modify — plus structural files (`package.json`, configs, `index.html`). **Do not include dummy data files** (`dummy-logs.json`, `dummy-users.json`) or `demo-data.ts`.
3. **Write the step README** following the standard template.

## Phase 4 — Create Test Folder

Every step gets a corresponding test folder at `tests/NN-step-name/`.

1. **Create `tests/NN-step-name/README.md`** — educational README covering:
   - New testing concept introduced in this step
   - Code examples showing how to test the step's features
   - A manual QA checklist table
   - A "What's Next" pointer to the next step
2. **Create a test script** (if the step has testable code):
   - Frontend steps: `*.test.tsx` using Vitest + @testing-library/react + userEvent
   - Backend steps: `*.test.ts` using Vitest + supertest
   - Config/deployment/styling-only steps: README only (no test script)
3. **Style rules for test READMEs:**
   - No emojis or Unicode symbols — use plain text (Yes/No, [x]/[ ])
   - No em dashes — use `--` instead
   - No Unicode arrows — use `->`, `<-`, `<->` instead
   - Heavily commented test code to walk interns through each concept
4. **Test scripts should include educational comments** explaining testing patterns, assertions, and why each test matters.

## Phase 5 — Create Learning Design

Every step gets a corresponding learning design document at `Docs/LearningDesigns/step_name` (snake_case, no number prefix — e.g., `basic_routing_one_link` for Step 04).

Use the template at `Docs/LEARNING_DESIGN_TEMPLATE.md` and fill in every section:

1. **Set Intention** — Session purpose, 2–4 learning objectives, explicit narrative of learning goals.
2. **Start With Why** — Explicit narrative connecting the step's skills to learners' current/future work.
3. **Emotional or Experiential Hook** — Learner knowledge to integrate and a story/experience to reference.
4. **Key/Core Content** — Up to 3 core concepts that need to be explained or modeled.
5. **Application** — Guided, partner, and/or independent practice activities with explicit narration.
6. **Assessment and/or Debrief** — Performance task with checklist, facilitated dialogue questions with **instructor-ready answers**, and/or written reflection.
7. **How Will the Learner Know How They Did?** — Clear success criteria.
8. **Retrieval Practice** — A follow-up task within one week (often tied to the next step).
9. **Extension and Support** — At least 3 extension opportunities and at least 2 support opportunities (learner chooses).

### Style & Content Rules

- **Learning objectives** must be measurable ("Learners will be able to...").
- **Facilitated dialogue questions** must include full instructor-ready answers — detailed enough that any instructor can lead the discussion without extra preparation.
- **Checklist items** in the Assessment section should align with the step README's "Check Your Work" section.
- **Tone**: Professional but accessible — written for an instructor audience at i.c. stars.
- **No emojis or Unicode symbols** — plain text only.
- The file is plain text (not Markdown) following the structure in the template.

### Reference

See `Docs/LearningDesigns/basic_routing_one_link` for a completed example (Step 04).

## Phase 6 — Deploy GitHub Pages

```powershell
cd C:\Users\JonathanRamirez\Documents\Applications\DevLog\jvc-dev-log
npm run deploy
```

This builds with `.env.production` (no `VITE_API_URL` → demo mode) and publishes to GitHub Pages.

> **NFSN deploy** is handled manually by the user:
>
> ```powershell
> & "C:\Program Files\Git\bin\bash.exe" deploy-nfsn.sh
> ```

## Phase 7 — Git Commit & Push

```powershell
cd C:\Users\JonathanRamirez\Documents\Applications\DevLog
git add -A
git commit -m "Step NN: short description"
git push origin main
```

## Key Rules

- **Always build before deploying** — `npm run build` must pass clean.
- **Demo data stays in sync** — every type change must be reflected in `demo-data.ts`.
- **One step = one commit** — bundle step folder + jvc-dev-log changes + README updates together.
- **`.env.production`** must NOT contain `VITE_API_URL` (that activates demo mode for GH Pages).
- **`deploy-nfsn.sh`** sets `VITE_API_URL=https://icstarslog.nfshost.com` at build time for the live version.
- **Author field** — new entries created in demo mode should use the logged-in demo user's username.
- **dummy-logs.json entry** for each step follows the JVC dad-joke format with `~jv` sign-off.
