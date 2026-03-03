# Template Sync Canary Readiness Matrix

Date: 2026-03-03
Scope: `civ,trash-cli` dry-run canary for `template-sync.yml`

## Run Log

| Run ID | Ref | Inputs | Result | Key Output |
|---|---|---|---|---|
| `22607517305` | `fix/canary-civ-access` | `target_repos=civ,trash-cli`, `dry_run=true` | `failure` | `Invalid repository 'Phenotype/repos/phenotypeActions'. Expected format {owner}/{repo}.` |
| `22607532579` | `fix/canary-civ-access` | `target_repos=civ,trash-cli`, `dry_run=true` | `failure` | `Checkout template-commons` failed with `Not Found` for `KooshaPari/template-commons`. |

## Readiness Matrix

| Dimension | Status | Evidence |
|---|---|---|
| Slug format handling | Improved | Run `22607517305` failed on invalid hardcoded slug; follow-up changes now generate `<owner>/<repo>` slugs. |
| Token/visibility checks | Implemented | Composite action now validates target repo access/visibility before sync and skips inaccessible targets with explicit logs. |
| Required preflight gates | Implemented | Workflow includes explicit preflight checks for `template-commons` and `phenotype-config` before sync execution. |
| Canary execution for `civ` + `trash-cli` | Blocked | Run `22607532579` failed before sync due to missing access/ownership for template source repo in this fork context. |

## Rollout Recommendation

Current recommendation: **hold rollout**.

1. Re-run canary from the environment that has access to `<owner>/template-commons` and `<owner>/phenotype-config` for the intended owner namespace.
2. Once preflight passes, require one successful dry-run for `civ,trash-cli` and one full target list dry-run before enabling non-dry-run PR creation.
3. Keep preflight as a hard gate; do not bypass template-source or phenotype-config accessibility checks.
