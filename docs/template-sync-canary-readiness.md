# Template Sync Canary Readiness Matrix

Date: 2026-03-03
Scope: `civ,trash-cli` dry-run canary for `template-sync.yml`

## Run Log

| Run ID | Ref | Inputs | Result | Key Output |
|---|---|---|---|---|
| `22607517305` | `fix/canary-civ-access` | `target_repos=civ,trash-cli`, `dry_run=true` | `failure` | `Invalid repository 'Phenotype/repos/phenotypeActions'. Expected format {owner}/{repo}.` |
| `22607532579` | `fix/canary-civ-access` | `target_repos=civ,trash-cli`, `dry_run=true` | `failure` | `Checkout template-commons` failed with `Not Found` for `KooshaPari/template-commons`. |
| `22608060864` | `fix/canary-civ-access` | `target_repos=civ,trash-cli`, `dry_run=true` | `success` | Preflight emitted deterministic skip classification artifact (`template-sync-preflight-skip-classification`, id `5734400996`). |
| `22608129942` | `fix/canary-civ-access` | `target_repos=civ,trash-cli`, `dry_run=true` | `success` | Same deterministic skip path with explicit namespace fallback message (`KooshaPari` then `Phenotype`), artifact id `5734412719`. |

## Readiness Matrix

| Dimension | Status | Evidence |
|---|---|---|
| Slug format handling | Improved | Run `22607517305` failed on invalid hardcoded slug; follow-up changes now generate `<owner>/<repo>` slugs. |
| Token/visibility checks | Implemented | Composite action validates primary + fallback namespace access and keeps per-target skip behavior for inaccessible repos. |
| Required preflight gates | Implemented | Workflow resolves dependencies via primary+fallback namespace and no longer hard-fails; it emits deterministic preflight skip classification when blocked. |
| Canary execution for `civ` + `trash-cli` | Reachable (classified skip) | Runs `22608060864` and `22608129942` completed successfully and produced explicit classification rows for `civ` and `trash-cli` instead of aborting. |

## Rollout Recommendation

Current recommendation: **hold rollout for PR creation, continue canary dry-runs**.

1. Keep deterministic preflight classification as the canary gate until workflow token access to `template-commons` and `phenotype-config` is granted.
2. After dependency access is available, require one successful `civ,trash-cli` dry-run with real drift analysis (not skip classification).
3. Only then run a full default-target dry-run and promote to non-dry-run PR creation.
