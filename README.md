# DeFlow Labs Content Studio

The guided Sanity editorial workspace for content displayed on [deflowlabs.io](https://deflowlabs.io). It is separate from the Nuxt Content documentation site. This README is the single operating manual for editors, developers, migrations, preview, security and Vercel deployment.

**Runtime:** Node.js 24 LTS and npm 11+
**Local URL:** `http://localhost:3333`

## Responsibilities and architecture

Studio owns structured marketing content for blog posts, authors, categories, Labs projects, website banners and partners. Unused Testimonials were removed after confirming that the production dataset contained no testimonial drafts or published documents.

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
| `SANITY_STUDIO_PREVIEW_URL` | `http://localhost:3000` | `https://preview.deflowlabs.io` | Yes |
| `SANITY_STUDIO_HOST` | `http://localhost:3333` | `https://studio.deflowlabs.io` | Yes |
| `SANITY_STUDIO_ENABLE_VISION` | `false` | `false` | Yes |

Never configure `SANITY_API_READ_TOKEN` in Studio. It belongs only to the website server environment. Enable Vision only in a temporary technical-administrator environment.

## Editor workflow

The **Start here** area surfaces drafts needing review, incomplete documents, recently edited documents and editor guidance. Content is grouped as:

- **Editorial:** posts, authors and categories.
- **Product:** Labs projects.
- **Marketing:** website banners and partners.

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

**Post:** title, unique slug, excerpt, author, cover image/alt, Portable Text body, publication date and SEO are required. The first category is the card badge; filters match every category. Category slug `announcements` enables the leading story. Only an explicit `Featured post` value creates a featured placement.

**Author/category:** use complete public names/descriptions and valid URLs. Deletion protection is reference-aware.

**Labs project:** set a concise card summary, cover, validated status/dates, explicit display order and Partner reference. Display order—not edit time—controls the website. Former detail-page fields remain preserved but hidden because projects now appear only on the Labs index.

**Website banner:** message and CTA form one unit. Use semantic tone and keep only one active, published banner.

**Partner:** provide a valid URL and meaningful logo alternative. Labs uses references; unapproved Partners remain internal and are never returned to the public website.

### CMS-to-website field contract

| Content | Field | Classification | Public result |
|---|---|---|---|
| Post | title, slug, excerpt, body, publication date, reading time | Rendered | Blog listing and article page |
| Post | category order / category slug | Behavioural | First badge, all-category filtering and `announcements` placement |
| Post | Featured post | Behavioural | One explicit featured story; announcement placement wins conflicts |
| Post | cover crop/hotspot/alt | Rendered | Responsive image; 1600×900 recommended, 1200×675 minimum |
| Post | SEO title, description, sharing image, noIndex | Behavioural | Metadata, 1200×630 sharing image, robots and sitemap |
| Author | portrait, role, biography, links | Rendered | Article attribution and author page; square 400×400 minimum |
| Labs | title, summary, cover, status, tags, partner | Rendered | Non-interactive `/labs` cards |
| Labs | dates, displayOrder | Behavioural | Date validation and stable ordering; the dates are not displayed |
| Labs | slug, details, publication URL, CTA, SEO | Legacy | Preserved read-only in existing documents; hidden and not queried publicly |
| Partner | isPublic | Behavioural | Gates name, logo and URL; internal note is never queried |
| Website banner | active, tone, CTA style and revision | Rendered + behavioural | Visibility, accessible treatment and dismissal reset |
| Legacy/read-only fields | old SEO, partner text, old banner colours/links | Legacy | Preserved for migration history; not a public fallback |

## Website draft preview

Presentation opens only the dedicated preview website through `/preview/enable`. The public `deflowlabs.io` deployment rejects preview configuration and has no Sanity read token, Visual Editing endpoint or stega output.

1. Start `/website` on `http://localhost:3000` with its README configuration.
2. Set `SANITY_STUDIO_PREVIEW_URL=http://localhost:3000`.
3. Add exact credentialed Sanity CORS origins for both local URLs.
4. Start Studio, open a post/announcement/Labs project and select Presentation.
5. Confirm drafts are visible only in the preview session.
6. End with website `/preview/disable`.

The dedicated preview website needs the server-side `SANITY_API_READ_TOKEN` and `NUXT_SANITY_PREVIEW_ENABLED=true`. Its Studio origin must be exact. No preview token or cookie secret belongs in Studio or the public website.

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
npx sanity migration run 001-structured-content --dry-run --project i34vbeac --dataset preview
npx sanity migration run 001-structured-content --project i34vbeac --dataset preview
```

Review mutations, warnings, counts and reference choices; validate all preview documents; complete editor UAT; deploy backward-compatible website consumers; obtain administrator approval; export production again; then run and validate production. Preserve IDs, slugs, assets, drafts/published state and URLs. Never guess an ambiguous Partner reference from free text.

## CORS and security

In **sanity.io/manage → API settings → CORS origins**, allow only exact required origins:

- `http://localhost:3333` and `http://localhost:3000` for local work;
- the production Studio origin;
- `https://preview.deflowlabs.io`, the stable website origin used by Presentation;
- stable protected staging origins when required.

Enable credentials only where authenticated preview needs them. Do not use `*` or register every ephemeral Vercel URL. Keep tokens out of source and all browser-visible variables. Keep Vercel Deployment Protection enabled where available; Sanity authentication and dataset permissions remain mandatory.

## GitHub Actions

`.github/workflows/quality.yml` runs on every pull request and push to `main` with Node 24. Its stable required check is `Studio / Required`, aggregating:

- types, validators, tests, deterministic checked-in schema extraction, production build and production dependency audit;
- schema extraction and TypeGen against a fresh read-only checkout of the website, followed by the website's unit, type and production-build checks;
- authenticated dataset validation and additive-migration dry run on trusted branches;
- actionlint, zizmor, Semgrep, Trivy secret/misconfiguration checks and a CycloneDX SBOM.

| GitHub setting | Purpose | Required |
|---|---|---|
| Secret `SANITY_AUTH_TOKEN` | Least-privilege token for dataset validation and migration dry run | Recommended on protected branches |
| Variable `SANITY_VALIDATION_DATASET` | Existing dataset used by read-only validation and migration dry-runs; defaults to `production` | Optional |
| Variable `DEFLOW_CI_APP_CLIENT_ID` | Organisation GitHub App client ID used to mint a short-lived website read token | Required for trusted branches |
| Secret `DEFLOW_CI_APP_PRIVATE_KEY` | GitHub App private key | Required for trusted branches |

Fork pull requests receive neither Sanity nor organisation credentials, so cross-repository and dataset jobs are skipped while local schema/tests/build and security gates still run. Trusted branches fail closed when the required credential is absent. Grant the GitHub App read-only Contents access to `deflowlabs/website` only; never replace it with a personal access token.

Repository workflow permissions can remain read-only. Studio workflows do not require **Allow GitHub Actions to create and approve pull requests**; that permission is needed only by the core repository's reviewed product-governance sync.

The v3 token action prefers the App client ID and temporarily falls back to the legacy App ID so the migration does not interrupt CI. Add `DEFLOW_CI_APP_CLIENT_ID`, confirm a successful default-branch run uses the client-ID step, then remove `DEFLOW_CI_APP_ID`; the fallback and its deprecation warning can be removed in the same reviewed cleanup. Dependabot checks run on Mondays at 06:00 Europe/Lisbon. npm uses 3-, 7- and 30-day patch/minor/major cooldowns, while Actions use GitHub's supported seven-day default cooldown; security updates are not delayed. After `Studio Quality` succeeds, `dependabot-queue.yml` enables native squash auto-merge, but one maintainer approval and all protected-branch requirements remain mandatory.

`@deflowlabs/engineering` owns the repository through `.github/CODEOWNERS`. Protect `main`, require code-owner review, conversation resolution and `Studio / Required`, and prevent force pushes. Dependabot surfaces all update levels for review, while action dependencies remain pinned to immutable SHAs.

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

Configure all six `SANITY_STUDIO_*` variables separately for Vercel Development, Preview and Production. Production Studio must point to `https://preview.deflowlabs.io`; configuration intentionally rejects `https://deflowlabs.io` as its Presentation target.

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
