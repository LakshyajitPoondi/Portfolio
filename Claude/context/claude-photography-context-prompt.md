# Claude / Claude Code Context Prompt

Use this prompt when shifting the photography portfolio project from ChatGPT Codex to Claude / Claude Code.

---

You are taking over an existing photography portfolio website redesign project.

First, read and follow the project skill/instruction file:

```text
SKILL.md
```

Treat it as the standing project instruction source for design language, image safety, typography rules, workflow, verification, and rollback context.

## Project Context

This is Lakshyajit's photography portfolio website. The desired design language is a premium dark editorial photography portfolio: black canvas, oversized identity typography, restrained metadata text, thin dividers, strong image-led layout, and cinematic/editorial composition.

This is not a SaaS landing page, agency site, or generic photography template. The photos are the product.

The site contains photo categories such as:

- Photography Gallery / Gallery
- Wildlife / Animals
- Cars / Automotive
- Portraits
- About
- Contact

Preserve the existing nav/category structure unless I explicitly ask to change it.

## Current Git State

The project was previously worked on in Codex, but the later refinements damaged typography and the hero section.

I rolled the repo back to the first accepted redesign commit:

```text
c3cb2af Complete Website Redesign
```

The current working branch should be:

```text
feature/redesign
```

Before doing anything, verify this with:

```bash
git status
git log --oneline --decorate -5
```

If the working tree is not clean, stop and tell me before editing.

## Important History

A later commit after the accepted redesign was rejected because:

- it made too many text elements bold;
- it increased font sizes unintentionally;
- it damaged the hero page;
- it misunderstood my instruction about font consistency.

Do not recreate that mistake.

When I say font consistency, I mean consistent font-family/design system. I do not mean making all text bold, large, or heavy.

Small labels, metadata, captions, nav links, and support text should stay refined and editorial.

## Critical Image Safety Rules

Do not delete, rename, move, overwrite, recompress, resize, crop, edit, or regenerate any existing photograph.

The repo has optimized photo variants for web use, plus full-resolution originals. Use optimized variants for frontend display wherever possible.

You may reference existing images in code. You may adjust CSS object-fit/object-position. You may not modify the actual image files.

## First Task: Audit Only

Do not immediately start redesigning.

First audit the repository and report:

1. framework/build system;
2. route/page structure;
3. nav/category implementation;
4. image folder structure and optimized image variants;
5. gallery/category implementation;
6. CSS/global typography system;
7. backend/database/contact logic, if present;
8. available verification scripts in package.json;
9. files that look risky to modify.

Only after that, propose a short plan.

## Redesign / Refinement Direction

Preserve the accepted dark editorial redesign baseline.

Use the accepted hero from the rolled-back commit as the starting point. Do not redesign the hero again unless I specifically ask.

Future refinements should be targeted and careful:

- align layout using a clean grid;
- keep typography hierarchy controlled;
- keep gallery/category layouts editorial and image-led;
- avoid generic card UI;
- avoid broad global CSS changes;
- keep animations subtle and performant;
- maintain responsive behavior.

## Development Rules

When implementing:

- make small, reviewable changes;
- inspect before editing;
- avoid unnecessary dependencies;
- do not touch photo files;
- do not remove backend/database logic just because it is broken;
- do not remove routes or categories;
- run available checks before finishing.

Use only commands/scripts that exist in the project.

Common verification commands may include:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Check `package.json` first.

## Final Report Format

At the end of every implementation pass, report:

- files changed;
- design/layout changes made;
- backend/database changes made, if any;
- photo safety confirmation;
- checks run and results;
- remaining issues or risks.

## Start Now

Begin by auditing the repo. Do not edit files until the audit is complete and you have given me the plan.
