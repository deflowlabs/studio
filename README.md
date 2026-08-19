# DeFlow Labs Content Studio

The guided Sanity editorial workspace for content displayed on [deflowlabs.io](https://deflowlabs.io). It is separate from the Nuxt Content documentation site. This README is the single operating manual for editors, developers, migrations, preview, security and Vercel deployment.

**Runtime:** Node.js 24 LTS and npm 11+
**Local URL:** `http://localhost:3333`

## Responsibilities and architecture

Studio owns structured marketing content for blog posts, authors, categories, Labs projects, announcements and partners. Unused Testimonials were removed after confirming that the production dataset contained no testimonial drafts or published documents.

```text
Editor ──► Sanity Studio ──► Sanity dataset
               │                    │
               └─ Presentation ─────┴─► website authenticated draft perspective
                                             │
                                             └─ published public queries
```

Important files:

| File | Responsibility |
|---|---|
| `sanity.config.ts` | Validated environment, plugins, Presentation and document actions |
| `structure.ts` | Start Here and plain-language editorial navigation |
| `schemas/` | Document/object contracts, validation and sensible initial values |
| `validators.ts` | Safe URLs, uniqueness and cross-field rules |
| `permissions.ts` | Role-aware publishing/destructive action guidance |
| `migrations/` | Reproducible additive content changes |
| `schema.json` | Extracted schema consumed by TypeGen |

Application controls allow editors to create and preview drafts; only `administrator` and `developer` roles see publish, unpublish and delete. Sanity project roles and dataset permissions must enforce the same boundary—the UI guard is guidance, not server-side authorisation.

## Local setup

Requirements: Sanity project membership, a suitable editor/admin role, and sibling `studio` and `website` checkouts for TypeGen.

```bash
npm install
cp .env.example .env
npm run dev
```

PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Prefer a preview/test dataset for schema and migration work. Startup intentionally fails when project ID or dataset is missing.

## Environment variables

All `SANITY_STUDIO_*` values are embedded in the browser bundle. They configure the application and must never contain tokens or secrets.

| Variable | Local/example | Production | Required |
|---|---|---|---|
| `SANITY_STUDIO_PROJECT_ID` | `i34vbeac` | Approved project ID | Yes |
| `SANITY_STUDIO_DATASET` | Prefer `preview` | `production` | Yes |
| `SANITY_STUDIO_API_VERSION` | `2026-08-17` | Same pinned date | Yes |
| `SANITY_STUDIO_PREVIEW_URL` | `http://localhost:3000` | `https://deflowlabs.io` or stable protected staging | Yes |
| `SANITY_STUDIO_HOST` | `http://localhost:3333` | `https://studio.deflowlabs.io` | Yes |
| `SANITY_STUDIO_ENABLE_VISION` | `false` | `false` | Yes |

Never configure `SANITY_API_READ_TOKEN` in Studio. It belongs only to the website server environment. Enable Vision only in a temporary technical-administrator environment.

## Editor workflow

The **Start here** area surfaces drafts needing review, incomplete documents, recently edited documents and editor guidance. Content is grouped as:

- **Editorial:** posts, authors and categories.
- **Product:** Labs projects.
- **Marketing:** announcements and partners.

The **How to publish** screen provides the visual workflow, role boundaries, content-area guidance and final review checklist. Releases are disabled because DeFlow uses drafts plus administrator review rather than Sanity Releases.

To submit content:

1. Create the document in the appropriate group.
2. Complete required fields and resolve validation markers.
3. Add meaningful image alternatives and safe public links.
4. Preview through Presentation.
5. Leave the document as a draft and request administrator review.
6. An administrator checks dates, uniqueness, links, rendering and approval state, then publishes.

Do not duplicate documents to bypass a featured-post, active-announcement or slug conflict.

### Content contracts

**Post:** title, unique slug, excerpt, author, cover image/alt, Portable Text body, publication date and SEO are required. Categories are supported. Public queries exclude drafts and future dates. Only one post can be featured.

**Author/category:** use complete public names/descriptions and valid URLs. Deletion protection is reference-aware.

**Labs project:** set validated status/dates, explicit display order, Partner reference, structured CTA, Portable Text details and SEO. Display order—not edit time—controls the website.

**Announcement:** message and CTA form one unit. Use semantic tone, validate dates and keep only one active announcement.

**Partner:** provide a valid URL and meaningful logo alternative. Labs uses references, never a duplicated free-text partner name.

## Website draft preview

Presentation opens the website through `/preview/enable`. The official Nuxt Sanity integration validates the signed preview URL, stores random preview state in an `HttpOnly`, cross-site-safe production cookie and keeps its read token off the browser.

1. Start `/website` on `http://localhost:3000` with its README configuration.
2. Set `SANITY_STUDIO_PREVIEW_URL=http://localhost:3000`.
3. Add exact credentialed Sanity CORS origins for both local URLs.
4. Start Studio, open a post/announcement/Labs project and select Presentation.
5. Confirm drafts are visible only in the preview session.
6. End with website `/preview/disable`.

The website needs only the server-side `SANITY_API_READ_TOKEN` for draft access. Production framing also requires `NUXT_SANITY_STUDIO_ORIGIN=https://studio.deflowlabs.io`; no preview token or cookie secret belongs in Studio.

## Schema development and TypeGen

Prefer additive schema changes so existing documents remain readable.

1. Add/update a type in `schemas/` and export it from `schemas/index.ts`.
2. Add plain-language field descriptions, examples, groups, previews and initial values.
3. Add field and document-level validation.
4. Update schema initial values or Structure only when they improve the editor task.
5. Update tests.
6. Run:

```bash
npm run typecheck
npm test
npm run schema:extract
npm run typegen
```

7. Update the sibling website query and Portable Text renderer before editors rely on the field.
8. Build Studio and website.

TypeGen scans sibling website GROQ and writes `../website/app/types/sanity.generated.ts`. Keep generated types with their schema/query change.

| Command | Purpose |
|---|---|
| `npm run dev` | Start Studio |
| `npm run typecheck` | TypeScript check |
| `npm test` | Validator, permissions, editor-experience and schema tests |
| `npm run schema:extract` | Regenerate `schema.json` |
| `npm run typegen` | Regenerate website Sanity types |
| `npm run check` | Typecheck, test and schema extraction |
| `npm run build` | Production-equivalent Studio build |

Studio validation is client-side assistance. Dataset validation is a release gate and needs authorised network credentials:

```bash
npx sanity documents validate --dataset preview
npx sanity documents validate --dataset production
```

## Safe migration workflow

Never begin with production.

```bash
npx sanity dataset export production backups/production-YYYY-MM-DD.tar.gz
npx sanity migration list
npx sanity migration run 001-structured-content --dry-run --dataset preview
npx sanity migration run 001-structured-content --dataset preview
```

Review mutations, warnings, counts and reference choices; validate all preview documents; complete editor UAT; deploy backward-compatible website consumers; obtain administrator approval; export production again; then run and validate production. Preserve IDs, slugs, assets, drafts/published state and URLs. Never guess an ambiguous Partner reference from free text.

## CORS and security

In **sanity.io/manage → API settings → CORS origins**, allow only exact required origins:

- `http://localhost:3333` and `http://localhost:3000` for local work;
- the production Studio origin;
- the stable website origin used by Presentation;
- stable protected staging origins when required.

Enable credentials only where authenticated preview needs them. Do not use `*` or register every ephemeral Vercel URL. Keep tokens out of source and all browser-visible variables. Keep Vercel Deployment Protection enabled where available; Sanity authentication and dataset permissions remain mandatory.

## GitHub Actions

`.github/workflows/quality.yml` runs on every pull request and push to `main` with Node 24. It checks types, validators, schema extraction, tests, the production-equivalent Studio build and production dependencies, then publishes a concise run summary. When `SANITY_AUTH_TOKEN` is configured, it also validates documents and dry-runs the additive migration against the repository variable `SANITY_VALIDATION_DATASET` (use `preview`, never production, for routine CI).

| GitHub setting | Purpose | Required |
|---|---|---|
| Secret `SANITY_AUTH_TOKEN` | Least-privilege token for dataset validation and migration dry run | Recommended on protected branches |
| Variable `SANITY_VALIDATION_DATASET` | Isolated CI dataset; normally `preview` | Recommended when the token is set |

Fork pull requests do not receive the secret, so network dataset gates show as skipped while local schema/tests/build still run. Dependabot reviews npm and GitHub Actions updates weekly. Action dependencies are pinned to immutable SHAs and obsolete runs are cancelled.

## Vercel deployment

Studio is a static single-page application. `vercel.json` builds `dist` and supplies a history fallback after real-file checks.

| Setting | Value |
|---|---|
| Root Directory | `studio` in a parent repository; blank when standalone |
| Framework Preset | Other |
| Node.js | 24.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |
| Production Branch | `main` |
| Domain | Dedicated domain, e.g. `studio.deflowlabs.io` |

Configure all six `SANITY_STUDIO_*` variables separately for Vercel Development, Preview and Production. Use a preview dataset and stable protected website URL outside production.

Before deployment:

```bash
npm ci
npm run check
npm run typegen
npm run build
npm audit --omit=dev
```

Then verify direct nested routes (SPA fallback), editor draft/preview without destructive actions, administrator publish/unpublish/delete, Presentation against staging, CORS and role grants. `npm run deploy` targets Sanity-managed hosting and is not the Vercel workflow.

For UI defects, roll back the Vercel deployment. For content, use Sanity document history or a reviewed migration—never delete a dataset.

## Troubleshooting

- **Startup fails:** confirm `.env`, project ID and dataset; run from `/studio`.
- **Preview is blank/refuses framing:** align Preview URL, website `NUXT_SANITY_STUDIO_ORIGIN`, CSP and exact CORS origins; verify server-only preview secrets.
- **Editor sees publish/delete:** inspect `permissions.ts`, Sanity roles and dataset grants; treat it as an access-control defect.
- **TypeGen finds no queries:** verify `/website` is a sibling, extract schema first, and keep queries under website `app`/`server`.
- **Published content is absent:** check future dates, slug, approval, public query and consumer. Testimonials intentionally remain absent.

## Code and maintenance standard

Document exported schemas/utilities, non-obvious validators, role/security boundaries and migration invariants close to code. Comments should explain intent and trade-offs, not restate syntax. Update this README whenever environment, workflow, schema, deployment or recovery behaviour changes.

Proprietary © DeFlow Labs
