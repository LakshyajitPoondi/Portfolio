# Codex Prompt: Full Lakshyajit Photography Website Redesign

You are working inside my photography portfolio website repository. Act as a senior product designer, UI/UX designer, frontend engineer, full-stack engineer, and production reviewer.

Read and follow `AGENTS.md` as the persistent project instruction source. Treat `AGENTS.md` as the source of truth for design language, constraints, image handling, backend/database expectations, workflow, and final acceptance criteria.

This is a complete ground-up redesign and production hardening pass for:

`lakshyajitphotography.vercel.app`

The final site should feel like a premium cinematic editorial photography portfolio: black, minimal, image-first, typography-led, responsive, fast, and highly polished. It should feel closer to a luxury photography book, fashion/editorial magazine spread, or cinematic filmmaker portfolio than a generic photography template.

---

## Absolute non-negotiables

Do not violate these rules at any point:

1. Do not delete any existing photograph.
2. Do not rename any existing photograph.
3. Do not overwrite any existing photograph.
4. Do not modify, recompress, regenerate, crop, resize, or transform any existing photograph file.
5. Do not alter original full-resolution photos.
6. Do not alter existing optimized photo variants.
7. Use optimized web image variants wherever available, including `w8`, `w12`, `800w`, `1200w`, `1600w`, compressed WebP/JPEG variants, thumbnails, `srcset`, or equivalent responsive formats.
8. Preserve the existing navigation categories and information architecture labels. Categories such as Wildlife, Portraits, Cars/Automotive, Gallery, About, Contact, or their existing equivalents must remain available.
9. Do not remove backend/database features just because they are broken. Audit them, understand them, then fix them properly or document the exact blocker.
10. Do not hardcode secrets or credentials.
11. Do not make a generic SaaS-style or template-style portfolio.
12. Do not start rewriting before completing the audit phase.

---

## Context retention rule

Before each major phase, re-read the relevant parts of `AGENTS.md` and this prompt. Maintain a running implementation log in your final response or working notes so no requirement is dropped.

At every phase boundary, explicitly check these constraints again:

- existing photos untouched;
- optimized variants preferred;
- nav categories preserved;
- backend/database logic repaired or documented;
- design remains cinematic editorial, not generic;
- mobile and desktop both considered;
- production build remains the target.

---

## Required workflow

Work in phases. Do not skip phases. Do not jump straight into implementation.

### Phase 1 — Repository audit

First, inspect the project structure and understand how the site is built.

Start with safe discovery commands such as:

```bash
pwd
ls
find . -maxdepth 3 -type f | sed 's#^./##' | sort | head -250
cat package.json
```

Then inspect the actual source tree, including whichever directories exist:

- `app/`
- `pages/`
- `src/`
- `components/`
- `public/`
- `lib/`
- `data/`
- `styles/`
- `api/`
- `server/`
- `prisma/`
- `db/`
- route handlers;
- server actions;
- gallery/category data files;
- image optimization scripts;
- deployment config;
- environment variable examples;
- README or project notes.

Read `package.json` before running scripts. Run only scripts that actually exist.

Potential checks, only if present:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

If the repo uses another package manager, follow the lockfile and project convention.

Do not invent unavailable scripts. If `typecheck` or `test` is absent, say it is absent.

At the end of Phase 1, produce a concise audit report before editing. Include:

- current framework and version if discoverable;
- routing model;
- styling system;
- component structure;
- current pages/routes;
- current nav/category model;
- image folder structure;
- optimized image naming conventions;
- full-resolution image locations if present;
- backend/database files and purpose;
- broken imports/build errors;
- broken backend/database logic;
- likely redesign files;
- verification plan.

### Phase 2 — Implementation plan

Create a short but concrete plan before editing.

The plan must include:

- target site architecture;
- target component architecture;
- target design system primitives;
- asset/image mapping strategy;
- backend/database repair strategy;
- risk areas;
- exact verification commands to run later.

Do not edit yet until the plan is stated.

### Phase 3 — Design system foundation

Create or refactor the visual foundation first.

Establish:

- true black editorial base;
- monochrome/muted image-first palette;
- typography scale with oversized bold sans-serif display type;
- small uppercase metadata labels;
- thin hairline borders;
- responsive spacing system;
- section containers;
- image frame components;
- button/link primitives that do not look SaaS-like;
- reduced-motion defaults;
- focus states;
- reusable animation utilities if needed.

Avoid adding dependencies unless genuinely necessary.

### Phase 4 — Asset and data model cleanup

Audit image references and category mappings without touching the image files.

Required:

- identify optimized variants;
- prefer optimized variants in frontend rendering;
- use responsive image behavior;
- set dimensions or aspect ratios to reduce CLS;
- lazy-load below-fold images;
- priority-load only critical hero imagery;
- keep category semantics stable;
- create non-destructive mapping files if necessary.

Forbidden:

- deleting images;
- renaming images;
- overwriting images;
- recompressing images;
- running destructive image optimization scripts;
- moving image files unless explicitly approved by the user.

### Phase 5 — Backend/database repair

The repo may contain broken database or backend logic. Audit and repair it.

Check and fix where applicable:

- database client setup;
- schema assumptions;
- migration assumptions;
- API routes;
- route handlers;
- server actions;
- contact form flow;
- validation;
- error handling;
- gallery/category data loading;
- build-time versus runtime assumptions;
- Vercel compatibility;
- environment variable handling;
- missing or unsafe fallbacks;
- broken imports;
- dead code only after proving it is unused.

If secrets or external credentials are missing:

- do not hardcode them;
- add clear env var documentation if needed;
- make the app fail gracefully;
- document exactly what remains blocked.

### Phase 6 — Full frontend redesign

Redesign the complete site, not only the hero.

Required areas:

- homepage;
- hero;
- navigation/menu;
- selected work/category entry section;
- gallery/category pages;
- about page or section;
- contact page or section;
- footer;
- mobile navigation;
- loading states;
- error states where relevant.

Keep all existing navigation categories available.

The design language must follow the reference direction:

- true black background;
- large cinematic images;
- monochrome or muted image treatment where appropriate;
- oversized bold display typography;
- small uppercase labels;
- editorial asymmetry;
- thin borders;
- generous negative space;
- subtle grain/noise if performant;
- confident minimal copy;
- restrained cinematic motion.

Avoid:

- neon gradients;
- glassmorphism cards;
- bouncy animation;
- generic CTA buttons;
- stock-template photography copy;
- SaaS landing-page structure;
- cluttered hero text;
- hover-only UX on mobile.

### Phase 7 — Homepage requirements

The homepage should immediately impress.

Build a cinematic editorial hero using the existing optimized photo assets. Preferred concepts can include:

- cinematic contact sheet;
- editorial magazine cover;
- minimal full-screen featured photograph;
- interactive category reveal;
- horizontal film-strip inspired intro.

Choose the version that best fits the actual image library.

The hero should include only restrained identity elements such as:

- `LXY VISUALS`;
- `LAKSHYAJIT`;
- `PHOTOGRAPHY`;
- `CHENNAI, INDIA`;
- `SELECTED WORK`;
- `FRAME 01 / 05`;
- subtle scroll affordance.

If the current site has a repeating `LAKSHYAJIT PHOTOGRAPHY` marquee, do not make that the first hero experience. Reuse it later as an identity strip or transition divider if it fits.

### Phase 8 — Category/gallery pages

Every category page must feel redesigned, not merely restyled.

For each existing category:

- use a strong editorial top section;
- show images in a premium asymmetric grid;
- use optimized variants;
- preserve category route semantics;
- maintain good mobile behavior;
- avoid layout shift;
- keep navigation consistent.

### Phase 9 — About/contact/footer

About:

- concise, confident, personal, not over-written;
- avoid cliché photographer language;
- make it feel like an editorial artist note.

Contact:

- minimal and functional;
- repair existing backend/contact/database/email logic if present;
- provide clear success/error states;
- do not fake form success if submission fails.

Footer:

- black editorial footer;
- category links;
- social/contact links if available;
- minimal identity text;
- no clutter.

### Phase 10 — Responsive, performance, and accessibility pass

Before finalizing, polish:

- desktop layout;
- tablet layout;
- mobile layout;
- mobile menu behavior;
- keyboard navigation;
- visible focus states;
- alt text strategy;
- reduced motion;
- image loading strategy;
- bundle size;
- layout shift;
- build warnings;
- Vercel compatibility.

The mobile experience must feel intentionally designed, not a compressed desktop layout.

### Phase 11 — Verification

Run all verification commands that exist in the project.

At minimum, attempt available equivalents of:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Only run scripts that exist. If a command is absent, report it as absent.

Fix all errors that are in scope. Do not leave the project in a broken state.

### Phase 12 — Final report

When complete, provide a final report with:

- audit summary;
- pages redesigned;
- files changed;
- design system decisions;
- hero concept chosen and why;
- image handling decisions;
- backend/database fixes;
- env vars required, if any;
- verification commands run;
- exact pass/fail results;
- remaining caveats;
- explicit confirmation that no existing photographs were deleted, renamed, overwritten, recompressed, regenerated, or modified.

---

## Design copy guidance

Use concise, premium copy.

Acceptable style:

- `Selected Work`
- `Portraits`
- `Wildlife`
- `Automotive`
- `Visuals by Lakshyajit`
- `Chennai, India`
- `Frame 01 / 05`
- `Available for selected shoots`
- `Stories in still frames`

Avoid:

- `Capturing memories forever`
- `Every moment is magical`
- `Professional photography services for every occasion`
- generic filler text;
- long paragraphs in the hero.

---

## Technical quality bar

The implementation should be clean enough for production.

Requirements:

- use reusable components;
- avoid huge monolithic files;
- preserve useful existing data models;
- remove dead code only after confirming it is unused;
- keep route names stable unless there is a strong reason;
- use semantic HTML;
- use accessible links/buttons;
- respect reduced motion;
- avoid unnecessary dependencies;
- avoid direct full-res image loads;
- avoid broken responsive behavior;
- ensure production build passes.

---

## Final instruction

Begin now by reading `AGENTS.md`, then perform Phase 1 audit. Do not implement until the audit and implementation plan are complete.
