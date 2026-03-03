# Stage-Gates Canary Dry-Run Rollout (2026-03-03)

## Scope

- Target repos: `civ`, `trash-cli`
- Mode: dry-run (`no PR creation`)
- Lane: template-sync with stage-gates + strictness drift checks

## GitHub Actions Runs

1. Run ID `22606093007` - `failure`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22606093007
   - Failure: invalid checkout repository format (`Phenotype/repos/phenotypeActions`).
2. Run ID `22606109674` - `failure`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22606109674
   - Failure: `KooshaPari/template-commons` not found/accessible from runner.
3. Run ID `22606135354` - `failure`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22606135354
   - Failure: `KooshaPari/phenotype-config` not found/accessible from runner.

## Local Canary Matrix Output

From `docs/stage-gates-canary-readiness-matrix-2026-03-03.csv`:

- `civ`: governance drift=true, workflow drift=true, stage-gates drift=true, strictness drift=true, stage_gates_ready=false, canary_ready=false
- `trash-cli`: governance drift=true, workflow drift=true, stage-gates drift=true, strictness drift=true, stage_gates_ready=false, canary_ready=false

## Outcome

- Canary dry-run lane logic executed and produced drift/readiness artifacts.
- Hosted workflow execution remains blocked by repository visibility/resolution for external template sources.
