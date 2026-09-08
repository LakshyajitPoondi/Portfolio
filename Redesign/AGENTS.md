# AGENTS.md — Lakshyajit Photography Redesign

## Project mission

You are working on the `lakshyajitphotography.vercel.app` portfolio website for Lakshyajit Photography / LXY Visuals. Treat this as a complete ground-up redesign and production hardening pass, not a small cosmetic tweak.

The target result is a premium cinematic editorial photography portfolio: black, minimal, image-first, typography-led, responsive, fast, and highly polished. The redesign should feel like a luxury photography book, a fashion/editorial magazine spread, and a cinematic filmmaker portfolio combined.

The visual reference direction is a dark monochrome photographer/filmmaker layout with large image panels, oversized bold sans-serif typography, small uppercase labels, thin hairline borders, subtle grain, negative space, and restrained cinematic motion.

## Critical non-negotiables

1. **Do not delete, rename, overwrite, recompress, regenerate, or modify any existing photograph.**
2. **Do not alter original full-resolution image files.**
3. **Do not alter existing web-optimized image variants unless the user explicitly asks.**
4. Use optimized web image variants wherever available, including `w8`, `w12`, `800w`, `1200w`, `1600w`, compressed WebP/JPEG variants, thumbnails, `srcset`, or equivalent responsive formats.
5. Preserve the existing navigation categories and information architecture labels. Existing categories such as Wildlife, Portraits, Cars/Automotive, Gallery, About, Contact, or any current equivalent nav items must remain available.
6. Redesign the site visually from the ground up, but do not destroy useful existing logic, data, routes, or assets.
7. Audit the project before implementation. Do not start rewriting before understanding the current stack, routing, assets, backend/database logic, and broken areas.
8. Fix broken backend/database logic discovered during the audit instead of ignoring it or deleting it.
9. Keep the final website fast, responsive, accessible, and production-ready.
10. Do not create a generic photography template. The output must feel custom, editorial, cinematic, minimal, and premium.

## Required workflow

Work in phases. Do not skip the audit.

### Phase 1 — Audit and diagnosis

Before making changes, inspect the project thoroughly.

Run only commands appropriate to the actual repo. Start with checks like:

```bash
pwd
ls
find . -maxdepth 3 -type f | sed 's#^./##' | sort | head -200
cat package.json
```

Then inspect:

- framework and routing model;
- `app/`, `pages/`, `src/`, or equivalent directories;
- component structure;
- global styles;
- Tailwind config if present;
- public/static assets;
- image optimization scripts;
- gallery/category data sources;
- database files;
- API routes or server actions;
- contact form logic;
- environment variable requirements;
- deployment config;
- README or project notes.

Read `package.json` before running verification commands. Use only scripts that actually exist.

Potential verification commands:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

If a command does not exist, do not invent it. Report that it is absent.

At the end of the audit, produce a short implementation plan covering:

- current stack;
- current route structure;
- current asset/image structure;
- optimized image naming conventions;
- backend/database functionality;
- broken areas discovered;
- redesign strategy;
- risks and constraints.

### Phase 2 — Design system foundation

Create or refactor the visual foundation before building pages.

Establish:

- color tokens;
- typography scale;
- spacing rhythm;
- layout containers;
- image treatment conventions;
- reusable section primitives;
- animation utilities;
- responsive breakpoints;
- accessibility defaults.

Avoid introducing unnecessary dependencies. Use existing stack conventions where possible.

### Phase 3 — Asset and data model cleanup

Audit image usage and data mappings without modifying photo files.

You may edit code/data files that reference images, but not the image files themselves.

Required behavior:

- identify original full-resolution files versus optimized display variants;
- prefer optimized variants for frontend rendering;
- use responsive images, `srcset`, `sizes`, width/height, lazy loading, and decoding hints;
- priority-load only critical hero images;
- avoid loading full-resolution files in normal page rendering unless there is no optimized alternative and this is documented;
- preserve category semantics.

Never run destructive image scripts on the existing image library unless the user explicitly instructs you to do so.

### Phase 4 — Backend/database repair

The project may contain broken or partially wired backend/database logic. Audit and repair it.

Check:

- database connection setup;
- environment variable expectations;
- schema/migration assumptions;
- API routes;
- server actions;
- contact form submission flow;
- validation;
- error handling;
- gallery/category data loading;
- build-time versus runtime assumptions;
- Vercel deployment compatibility;
- broken imports;
- dead code;
- missing seed or migration assumptions if present.

Do not remove backend/database features merely because they are broken. Understand them first. If a feature is genuinely unused or impossible to fix without secrets/environment values, document the limitation clearly and make the app fail gracefully.

### Phase 5 — Full frontend redesign

Redesign the full site, not just the hero.

Required areas:

- homepage;
- hero;
- nav/menu;
- selected work/category entry points;
- gallery/category pages;
- about section/page;
- contact section/page;
- footer;
- mobile navigation;
- responsive gallery behavior;
- loading/error states where relevant.

Keep the existing nav categories available.

### Phase 6 — Responsive, performance, accessibility pass

Before finalizing, polish:

- mobile layout;
- tablet layout;
- desktop layout;
- keyboard navigation;
- visible focus states;
- alt text strategy;
- reduced motion behavior;
- image loading strategy;
- layout shift;
- bundle size where possible;
- build warnings.

### Phase 7 — Verification and final report

Run all available verification commands from `package.json`.

The final report must include:

- what changed;
- changed files;
- design decisions;
- backend/database fixes;
- asset handling decisions;
- commands run;
- build/lint/typecheck/test results;
- remaining caveats;
- confirmation that no existing photographs were modified.

## Design language

### Core direction

The visual system is **cinematic editorial minimalism**.

Use:

- true black or near-black backgrounds;
- grayscale, muted, or naturally colored photographs;
- oversized bold sans-serif display typography;
- compact uppercase metadata labels;
- large negative space;
- thin low-opacity borders;
- asymmetrical editorial grids;
- image-first hierarchy;
- restrained motion;
- subtle grain/noise texture if lightweight;
- mobile compositions that feel deliberately designed.

Avoid:

- generic portfolio templates;
- neon SaaS gradients;
- glassmorphism cards;
- stock-looking buttons;
- cliché photography slogans;
- excessive animation;
- bouncy transitions;
- cluttered navs;
- default-looking typography;
- uniform image grids everywhere.

### Color palette

Use a restrained monochrome palette.

Recommended values:

```css
--bg: #000000;
--bg-soft: #050505;
--bg-elevated: #080808;
--text: #f4f4f0;
--text-muted: #9a9a94;
--text-subtle: #777771;
--line: rgba(255, 255, 255, 0.12);
--line-strong: rgba(255, 255, 255, 0.22);
```

Color should mostly come from the photographs, not the interface.

### Typography

Use bold editorial sans-serif typography.

Preferred style:

- huge uppercase display titles;
- tight but controlled tracking;
- clean readable body text;
- small uppercase labels;
- disciplined line-height;
- strong hierarchy.

Good text patterns:

- `LXY VISUALS`
- `LAKSHYAJIT`
- `PHOTOGRAPHY`
- `SELECTED WORK`
- `PORTRAITS`
- `WILDLIFE`
- `AUTOMOTIVE`
- `CHENNAI, INDIA`
- `FRAME 01 / 05`
- `AVAILABLE FOR SELECTED SHOOTS`

Avoid text like:

- `Capturing memories forever`
- `Where moments become magic`
- `Professional photography services for all occasions`
- generic marketing copy.

### Layout principles

Use confident editorial compositions:

- one dominant visual idea per viewport;
- large black framing around images;
- asymmetric text placement;
- large section titles;
- varied gallery rhythm;
- not every image should sit in the same card/grid treatment;
- whitespace is part of the design;
- mobile should not be a collapsed afterthought.

### Motion principles

Motion should feel cinematic and minimal.

Allowed patterns:

- slow image reveal;
- masked wipe;
- subtle parallax;
- gentle image scale, e.g. `1.04` to `1.0`;
- opacity fades with refined easing;
- scroll-linked transitions where meaningful;
- hover/tap image previews;
- small cursor or metadata interactions if lightweight.

Avoid:

- bouncy animation;
- excessive cursor gimmicks;
- heavy scroll hijacking;
- animation that breaks mobile;
- motion that hurts performance.

Always respect `prefers-reduced-motion`.

### Texture

A subtle grain/noise overlay is allowed if it is:

- lightweight;
- barely visible;
- not applied destructively to image files;
- not strong enough to degrade the photography.

Do not fake a heavy vintage filter over every photo.

## Hero direction

The hero must be immediately impressive and image-led.

Recommended composition:

- near full-viewport black stage;
- one large featured photograph selected from existing optimized assets;
- minimal top navigation;
- small brand mark: `LXY`, `LXY VISUALS`, or `LAKSHYAJIT`;
- large name lockup: `LAKSHYAJIT` / `PHOTOGRAPHY`;
- tiny metadata: `CHENNAI, INDIA`, `SELECTED WORK`, `2022—2026`, `FRAME 01 / 05`;
- small scroll affordance;
- responsive mobile crop that feels intentional.

The hero should not lead with a repeating marquee. If a marquee exists, reuse it lower on the page as an identity divider.

Possible hero models:

1. **Cinematic Contact Sheet** — one central image, large black margins, tiny metadata, slow frame changes.
2. **Editorial Cover** — oversized name typography partly intersecting the image.
3. **Interactive Categories** — large category words that reveal matching images on hover/tap.
4. **Minimal Full-screen Photograph** — one strong image with minimal type.
5. **Film Strip** — horizontal sequence of frames with subtle scroll or cursor parallax.

Choose the strongest option based on available images and project constraints.

## Recommended homepage structure

Build a homepage with this kind of hierarchy:

1. **Hero** — cinematic image-first introduction.
2. **Identity strip** — optional repeating typography/marquee used as a separator, not the main hero.
3. **Selected Work** — category-based entry points using existing nav categories.
4. **Featured Gallery Preview** — curated mix of strong images from existing optimized assets.
5. **About Preview** — short confident intro to Lakshyajit / LXY Visuals.
6. **Contact CTA** — minimal, premium, direct.
7. **Footer** — black editorial footer with category links and contact/social links.

The hierarchy should be:

```text
photography → identity → selected work → photographer → contact
```

not:

```text
branding → biography → photos
```

## Category and gallery pages

Each category page should feel designed, not like a dumped image folder.

Direction by category:

- **Portraits**: intimate, editorial, human-focused, strong crops, quieter pacing.
- **Wildlife**: observational, spacious, patient, image-led.
- **Cars / Automotive**: sharper, more dynamic, more angular rhythm.
- **Gallery / All Work**: curated overview with filtering or sections if already supported.

Preserve the existing category labels and routes unless the audit reveals aliases that need to be supported with redirects.

## Navigation

Keep the current nav contents/categories available.

Nav style:

- minimal;
- uppercase;
- small but readable;
- high contrast;
- no bulky navbar box;
- strong mobile menu;
- active states where useful;
- keyboard accessible.

The desktop nav may be split, corner-aligned, or editorially arranged, but it must remain usable.

## Image and asset rules

Before referencing any image, understand the existing asset structure.

Required image behavior:

- use optimized assets by default;
- use correct aspect ratios;
- avoid layout shift with dimensions/aspect-ratio;
- use lazy loading below the fold;
- avoid unnecessary eager loading;
- use priority/fetch priority only for hero-critical images;
- use meaningful alt text where content-specific alt text is feasible;
- use empty alt only for purely decorative duplicates;
- avoid making up EXIF metadata unless it is already present in the project.

Forbidden:

- deleting photo files;
- renaming photo files;
- modifying photo files;
- recompressing photo files;
- overwriting photo files;
- moving photo files;
- using destructive scripts on the image library;
- using full-resolution images for normal display when optimized versions exist.

## Backend/database rules

Fix backend/database logic carefully.

Do:

- preserve intended functionality;
- validate inputs;
- handle missing env variables gracefully;
- make build/deployment behavior predictable;
- document required environment variables;
- avoid leaking secrets;
- keep Vercel constraints in mind;
- repair broken contact/data/gallery routes if present.

Do not:

- delete broken backend/database code just to make the build pass;
- remove contact form logic without replacing it;
- hardcode secrets;
- require local-only services in production without documenting them;
- silently disable features.

If a backend/database fix cannot be fully verified because credentials or environment variables are unavailable, implement graceful failure and document the exact missing requirement.

## Code quality rules

- Use clean component boundaries.
- Avoid giant single-file pages if components are supported.
- Separate data definitions from presentation where reasonable.
- Use semantic HTML.
- Keep animation code isolated.
- Keep image data centralized where practical.
- Do not introduce unnecessary packages.
- Do not hardcode fragile paths without understanding conventions.
- Prefer static rendering where possible.
- Use client components only where interactivity requires them.
- Keep the implementation understandable for future edits.

## Accessibility rules

- Use semantic landmarks.
- Ensure keyboard navigation works.
- Provide visible focus states.
- Do not rely only on hover.
- Provide tap alternatives for mobile.
- Respect `prefers-reduced-motion`.
- Maintain sufficient contrast.
- Use descriptive alt text for meaningful images.
- Avoid scroll traps.

## Performance rules

The website is image-heavy, so performance is critical.

Prioritize:

- optimized hero image selection;
- responsive image loading;
- lazy loading below the fold;
- stable dimensions/aspect ratios;
- low animation cost;
- minimal JavaScript;
- static generation where possible;
- avoiding unnecessary dependencies;
- checking production build output.

Do not accidentally load the full-resolution image library on the homepage.

## Mobile rules

The mobile design must be intentional.

Mobile requirements:

- large but non-overflowing typography;
- tall cinematic image compositions;
- clean menu pattern;
- readable nav/menu items;
- designed image crops;
- easy gallery scrolling;
- no hover-only category reveal;
- no tiny text blocks copied directly from desktop;
- no broken horizontal overflow.

## Final acceptance criteria

The task is complete only when all of the following are true:

1. The site has a new cinematic editorial visual system.
2. The existing navigation categories remain available.
3. Existing photographs are preserved untouched.
4. Optimized photo variants are used correctly.
5. The homepage is fully redesigned.
6. Gallery/category pages are redesigned coherently.
7. About/contact/footer areas fit the new design language.
8. Desktop and mobile layouts are polished.
9. Backend/database issues found during audit are fixed or documented with graceful fallback.
10. Build passes.
11. Lint/typecheck/tests pass where scripts exist.
12. No full-resolution images are accidentally used for normal page loads unless documented and justified.
13. No existing photo file was modified, moved, renamed, deleted, or overwritten.
14. A final report is provided.

## Final response format after implementation

When the work is complete, report:

```md
# Final Report

## Summary
- ...

## Major Design Changes
- ...

## Backend / Database Fixes
- ...

## Image Handling
- ...

## Files Changed
- ...

## Verification
- `npm run ...`: passed/failed/not available

## Photo Preservation
- Confirm whether any photo files were modified.

## Remaining Caveats
- ...
```

Be explicit about failures or unverifiable items. Do not claim success for commands that were not run.
