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
4. Run ID `22606248982` - `failure`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22606248982
   - Failure: composite action manifest parse error (input description YAML quoting).
5. Run ID `22606294391` - `failure`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22606294391
   - Failure: composite action manifest parse error (multiline shell snippet indentation).
6. Run ID `22606340304` - `success`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22606340304
   - Result: workflow completed with dependency checkout fallback logic and produced readiness matrix output.

## Canary Outcomes (Run `22606340304`)

- `civ`: clone/access failed from runner token context (`Repo not found/unreachable`), no drift row emitted.
- `trash-cli`: analyzed successfully; drift detected (workflow/stage-gates/strictness), canary readiness remains `false`.

Matrix artifact path logged by run:
- `/home/runner/work/phenotypeActions/phenotypeActions/phenotypeActions/docs/stage-gates-canary-readiness-matrix-20260303T030430Z.csv`

## Outcome

- Canary dry-run lane now executes successfully in hosted GitHub Actions after checkout/dependency fixes.
- Remaining blockers are target-repo accessibility (`civ`) and template/contract drift in reachable repos (`trash-cli`).
- Rollout progression now uses objective phase criteria:
  - `hold`: <80% analyzed or any `repo_unreachable`
  - `phase-1`: 100% analyzed and >=50% canary-ready
  - `phase-2`: 100% analyzed and >=80% canary-ready
  - `broad`: 100% analyzed and 100% canary-ready for 2 consecutive runs
