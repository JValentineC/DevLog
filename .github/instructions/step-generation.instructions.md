---
description: "Use when creating a new tutorial step from changes in jvc-dev-log. Covers step folder creation, README generation, and file extraction for the DevLog step-by-step curriculum."
applyTo: "**/README.md"
---

# Step Generation from jvc-dev-log Changes

When the user adds a new feature to `jvc-dev-log/` and asks to create a new step, follow this workflow:

## 1. Determine the Next Step Number

- Look at existing folders (`01-getting-started`, `02-clean-homae-and-about`, etc.)
- The new folder is `NN-short-kebab-description/` where NN is the next sequential number

## 2. Copy Only Changed/New Files

- The step folder contains **only the files the user changed or added** for this feature, plus the structural files needed to run the app (`package.json`, `tsconfig*.json`, `vite.config.ts`, `index.html`, `eslint.config.js`)
- For frontend-only steps (01–10 pattern): `src/`, `public/`, config files
- For full-stack steps (11+ pattern): also include `server/`, `prisma/`, `.env.example`, `tsconfig.server.json`
- Always include `.gitignore`
- Never include `node_modules/`, `dist/`, `dist-server/`, `.env` (only `.env.example`)

## 3. Write the README

Every step README follows this exact outline:

```markdown
# Step NN — Title

## Goal
One sentence describing what this step accomplishes.

## What You'll Practice
- Bullet list of 4–6 concepts/skills practiced

## Prerequisites
- Previous step completed
- Any additional tools or knowledge needed

## Step-by-Step Instructions

### 1. Copy the previous step
(instructions to copy and rename)

### 2–N. Implementation steps
(one section per logical change, with code blocks showing the file path and content)

## Helpful Hints
- 2–4 tips relevant to this step

## Do / Don't
| Do | Don't |
|---|---|
| ... | ... |

## Check Your Work
- Numbered verification steps the learner can follow

## Stretch
- 1–2 optional challenges to go further
```

## 4. Code Blocks in README

- Use fenced code blocks with language identifiers (`tsx`, `ts`, `prisma`, `sql`, `bash`)
- Show the file path as a comment or heading before each block
- Only show the relevant parts of files — not entire files unless they're new

## 5. Commit Convention

Each step gets one commit: `feat(step-NN): short description`

## Conventions

- TypeScript everywhere (`.tsx`, `.ts`)
- React 19 + Vite + Express + Prisma + MySQL
- HashRouter for GitHub Pages compatibility
- Semantic HTML first, Tailwind/daisyUI only after step 23
- One concept per step — keep scope small and focused
