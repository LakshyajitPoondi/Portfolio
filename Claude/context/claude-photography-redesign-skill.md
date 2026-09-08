# Photography Portfolio Redesign Skill

## Purpose

Use this skill when working on Lakshyajit's photography portfolio website redesign. The goal is to preserve the accepted dark editorial redesign direction while safely continuing development in Claude / Claude Code.

This project is a photography portfolio, not a generic landing page, SaaS site, or agency website. The design must feel like a premium editorial photo book: black background, large typography, controlled spacing, sharp hierarchy, strong image-led composition, and minimal but intentional interaction.

## Current Project State

The project was moved from Codex work to Claude after a rollback.

The current branch is expected to be:

```bash
git branch
# feature/redesign
```

The project was rolled back to the first accepted redesign commit:

```text
c3cb2af Complete Website Redesign
```

A later commit named something like `Cards in Photography Portfolio` was rejected and rolled back because it damaged typography and the hero section. Do not recreate those bad changes blindly.

Before making any change, inspect the current repository state and verify where HEAD actually is.

## Non-Negotiable Safety Rules

### Photo Safety

Do not delete, rename, overwrite, recompress, resize, crop, edit, move, or regenerate any photograph.

This includes:

- original full-resolution images;
- optimized web images;
- `w8`, `w12`, `w16`, WebP, JPEG, JPG, PNG variants;
- category folders such as gallery, portraits, wildlife, cars, animals, automotive, or similar.

Only reference existing image files from code.

If an image is unused, leave it alone. If an image path looks wrong, fix the reference in code rather than modifying the image file unless explicitly instructed.

### Git Safety

Before editing, run:

```bash
git status
git log --oneline --decorate -5
```

If there are uncommitted user changes, stop and explain before editing.

Do not use destructive commands such as:

```bash
git reset --hard
git clean -fd
git checkout -- .
rm -rf
```

unless the user explicitly asks for them in the current Claude session.

### Scope Safety

Do not redesign unrelated sections unless requested.

Do not remove routes, categories, backend/database logic, contact behavior, image optimization logic, or deployment configuration unless explicitly instructed.

If something is broken, repair it carefully. Do not delete working features simply because they are inconvenient.

## Design Language

### Overall Visual Direction

The website should feel like:

- dark editorial photography portfolio;
- cinematic contact sheet;
- high-end independent photographer archive;
- black-and-white typographic system with selective full-color imagery;
- minimal but confident, not decorative.

Avoid:

- generic portfolio templates;
- SaaS gradients;
- glowing cards;
- bubbly rounded UI;
- overdesigned buttons;
- cliché photography copy like “capturing moments forever”;
- unnecessary animation clutter.

### Core References

The desired design language is close to the provided black editorial reference:

- black canvas;
- large bold hero identity text;
- restrained small uppercase metadata;
- documentary/editorial image treatment;
- thin dividers;
- sparse navigation;
- premium spacing;
- image-led storytelling.

The site should look designed, not generated.

### Typography

Typography must be consistent but not universally bold.

Important lesson from previous failed refinement:
The user asked for font-family consistency, not for every text element to become larger or bolder.

Use a strict hierarchy:

1. Giant display typography for major page/section titles.
2. Medium editorial headings for section titles and category names.
3. Small uppercase metadata/captions/nav text with lighter refined weight.
4. Body text should be readable, restrained, and not heavy.

Do not globally apply bold weights. Do not increase all small text size. Avoid broad CSS rules that affect every paragraph, link, span, nav item, caption, or metadata label.

Small UI text should feel elegant and editorial, not chunky.

### Layout

Use a strong grid.

Hero text and images must feel intentionally aligned. If the large name/title and the hero image share a layout region, their starting edges should usually align to the same grid unless a deliberate overlap is intended.

Spacing should be premium but not wasteful.

For gallery/category sections, keep the images/cards closer together than a generic spaced-out grid. The intended feeling is dense editorial contact sheet / magazine spread, not isolated cards floating far apart.

### Color

Primary palette:

- true black or near-black background;
- off-white text;
- subtle grey captions/dividers;
- photography provides color.

Avoid adding accent colors unless they already exist in the design system or are directly pulled from imagery.

### Motion

Motion should be subtle and purposeful:

- slow reveals;
- slight image scale/parallax;
- clean hover states;
- image/card transitions that feel photographic/editorial.

Avoid excessive scroll hijacking, heavy animation, broken pinned sections, or effects that hurt performance.

Respect reduced-motion preferences.

## Navigation Requirements

Keep the existing nav/category structure unless the user explicitly changes it.

Expected categories include some or all of:

- Home
- Photography Gallery / Gallery
- Wildlife / Animals
- Cars / Automotive
- Portraits
- About
- Contact

Do not remove category routes.

If labels vary in the codebase, preserve the current site’s working labels and links unless the user gives a specific correction.

## Image Usage Rules

Use optimized web variants where available.

Prefer existing compressed/responsive image variants over full-resolution originals.

Expected optimized patterns may include:

- `800w`, `1200w`, `1600w`
- `w8`, `w12`, `w16`
- `.webp`
- compressed `.jpg` / `.jpeg`

Audit the actual folder structure before assuming exact paths.

When choosing card/front images:

- use visually strong images already present in that category;
- prioritize sharp composition, strong contrast, clear subject, and category representation;
- do not permanently crop or edit the file;
- use CSS object-fit/object-position if needed.

## Backend / Database Logic

The user mentioned that some backend/database logic may be broken.

Audit before touching it.

Identify:

- whether the site is static HTML/CSS/JS, Vite, React, Next.js, or another framework;
- whether any API routes exist;
- whether there is a database integration;
- whether contact forms, gallery metadata, image indexing, or admin/database features exist;
- whether environment variables are required.

Do not remove backend/database logic merely because it is broken.

Fix broken behavior if it is within scope and verifiable. If not fixable due to missing credentials or external services, document the issue clearly and leave safe fallbacks.

## Required Workflow

### Phase 1: Audit

Before editing, audit the project.

Run or inspect as applicable:

```bash
git status
git log --oneline --decorate -5
ls
find . -maxdepth 3 -type f | sed 's#^./##' | sort | head -200
```

Then inspect:

- framework and package scripts;
- routes/pages/components;
- CSS/global styling;
- image folders and optimized variants;
- nav implementation;
- gallery/category implementation;
- backend/database/contact logic;
- deployment assumptions.

Summarize the findings before making large changes.

### Phase 2: Plan

Create a short implementation plan.

The plan must identify:

- files likely to change;
- files that must not be touched;
- risks around images/assets;
- validation commands.

### Phase 3: Implement

Make targeted changes.

Prefer small, reviewable edits over broad rewrites.

Do not modify photo assets.

Do not introduce unnecessary dependencies.

Preserve responsive behavior.

### Phase 4: Verify

Run available checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Only run scripts that actually exist in `package.json`.

If the project is not Node-based, use the appropriate equivalent.

Fix errors introduced by the work.

### Phase 5: Report

Final report should include:

- what was changed;
- files changed;
- what was intentionally preserved;
- image safety confirmation;
- verification commands and results;
- unresolved issues, if any.

## Accepted Redesign State

The accepted state is the first completed redesign after rollback:

```text
c3cb2af Complete Website Redesign
```

The hero from this state should be treated as the safe baseline unless the user specifically requests further hero changes.

Do not repeat the failed typography regression where all text became bold/heavy.

## User Preferences

The user prefers direct, implementation-ready instructions and does not want vague design advice.

When making design decisions, be precise:

- what to change;
- why it fits the system;
- where to change it;
- how to verify it.

The user values a premium, cinematic, black editorial aesthetic and is sensitive to small layout/typography regressions.

