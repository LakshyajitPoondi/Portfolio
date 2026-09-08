# LXY Visuals / Lakshyajit Photography

Static editorial photography portfolio. Node 22+; no production packages or frontend framework. Root `AGENTS.md` is the permanent project instruction source.

## Working on the site

- `npm run generate` regenerates the six root HTML files from `scripts/templates.mjs`.
- `npm run dev` starts the local preview at `http://127.0.0.1:4173`.
- `npm run check` verifies asset hashes, measured WebP dimensions, links, landmarks, displayed-image coverage and JavaScript syntax.
- `npm test` runs 12 contact-handler tests with mocked email transport. No real messages are sent.
- `npm run build` generates `dist/` with static HTML, CSS, JavaScript and byte-for-byte copies of existing optimized images. It does not run image processing or copy originals.

No lint or typecheck scripts are configured. This is plain JavaScript; `check` supplies syntax and static site validation. No install step is required. `scripts/browser-check.mjs` is an optional Playwright runner; set `PLAYWRIGHT_MODULE` to an installed Playwright module URL and optionally `BROWSER_CHANNEL`. Start the local server first. Browser QA writes ignored `artifacts/` output.

## Source of truth

Shared page/shell/image functions: `scripts/templates.mjs`. Visual system: `styles/main.css`. Interactivity: `js/main.js`. Generated root HTML is checked in for direct static previews; regenerate after template edits.

`data/images.json` contains exact case-sensitive paths, actual pixel dimensions, stable photo IDs and alt text. All 276 collection originals remain catalogued. `data/presentation.json` holds explicit frontend exclusions: `gallery_002` was removed from display at the user's request; its original and variants remain untouched. Current visible collections: Gallery 83, Wildlife 51, Cars 82, Portraits 59. Gallery reading/lightbox order follows the masonry columns top-to-bottom, then left-to-right; mobile becomes one column.

Curated photos have descriptive alt text from visual inspection. Remaining photos use honest collection/frame descriptions; no invented names, locations, species, dates or EXIF. Additional descriptive captions can be authored in the catalog later.

Do not run legacy root Python utilities. Some are historical rename/optimization scripts that can modify photographs or overwrite the current HTML. They remain preserved for history, outside the build and deployed output. Do not regenerate `docs/asset-baseline.json` to hide an integrity failure: investigate the asset change.

## Contact and deployment

`vercel.json` configures the static build plus `api/contact.js` as a Vercel Node function. Existing `.html` routes remain stable, with About at `index.html#about` and the contact CTA at `index.html#contact`.

The old forms had no delivery backend or database. The contact handler now validates requests, restricts browser origins, rejects a honeypot, bounds payload sizes, uses a provider timeout, and deduplicates retries. It sends plain text to the configured inbox. No database or migrations are needed. The old newsletter signup was a placeholder explicitly saying no newsletter existed, so its misleading form was removed.

Set these **server-only** environment variables in Vercel before enabling real delivery:

- `RESEND_API_KEY`: email provider API key.
- `CONTACT_FROM`: sender address on a domain verified in Resend.
- `CONTACT_TO`: the photographer's destination inbox.
- `CONTACT_ORIGIN`: optional exact custom-domain origin (no trailing slash). The existing production domain and Vercel preview host are already allowed.

The implementation follows the [Resend email API](https://resend.com/docs/api-reference/emails/send-email) and [Vercel Node function interface](https://vercel.com/docs/functions/runtimes/node-js). An accepted provider response is not proof of inbox delivery. Without configuration the endpoint returns 503 and the form retains the enquiry, displays an honest error and offers the existing Instagram contact link. The site does not fake newsletter subscriptions or email success. Credentials and live delivery were unavailable during verification. No deployment or real email was performed.

For local configured testing, export environment values before starting the server (the preview server does not automatically read `.env.local`). Origin checks and the honeypot provide basic protection, not distributed rate limiting; configure provider quotas and deployment firewall rules if public form traffic requires them.

## Verification record

See `docs/implementation-log.md` for the audit and phased work, and `docs/redesign-report.md` for final results. `docs/asset-baseline.json` covers all 1,120 original asset files with byte lengths and SHA-256 checksums.
