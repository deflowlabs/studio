---
name: release-audit
description: Run the full release audit of the DeFlow Labs Sanity content studio — content model, real access control, dataset visibility, CORS and tokens, content claims against the Core ledger, the schema contract with the website, migrations and backups, editorial experience, Vercel delivery, integrations, documentation and onboarding — against the single audit pack in audit/. Optional argument names the gate (private-testnet, public-testnet, mainnet). Use when the founder asks for a full audit or a pre-launch review of this repository; not for reviewing one change or one issue.
---

# Release audit — the DeFlow Labs content studio (Sanity)

The audit charter is `PROMPT.md` in this folder. Read it completely and execute it as written; it is self-contained and needs no other repository on disk. Do not paraphrase it into a shorter checklist. The gate assessed is the argument given (`private-testnet` when none is).

Standing rules that outlive any single run:

1. There is one audit pack, `audit/` at the root of this repository, updated in place and never bundled into the Studio. A new run reconciles every item of the previous run (charter section 5) before writing new findings; finding IDs keep the `STU-` prefix and their numbers.
2. GitHub Issues in this repository are its only backlog, and `docs/PRODUCT_FACTS.yaml` in `deflowlabs/core` is the only source of product truth, read through `gh api`. The pack proposes; it does not own status. The audit never writes to a Sanity dataset.
3. The charter holds no snapshot facts. Every count, type, workflow, variable, role and origin is derived at run time; where the repository or the Sanity project disagrees with the charter, they win — record the difference in `audit/baseline.json` and continue.
4. Charter section 1 records the founder's decisions on authority. Changing them is the founder's call, made in a reviewed pull request, not by an agent mid-run.
5. Section 7 of the charter is the audit's memory of what earlier runs missed. Whoever finds a defect outside an audit that this method should have caught adds its probe to the end of that list in the pull request that fixes it, as its own commit.
6. This audit is standalone. The Core repository's `/release-audit` is the umbrella for DeFlow Labs and reads this pack, including `docs-inventory.json` and `claims.json`; keep their shape stable.
7. Start with the preflight (charter section 3). Update `audit/PROGRESS.md` at every phase so a later session can resume, and finish with the founder handoff in charter section 14.
