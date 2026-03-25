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
7. Run ID `22631922418` - `success`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22631922418
   - Result: workflow completed with machine-readable remediation categories, owner/token hints, and summary table artifact output.
8. Run ID `22633353020` - `success`
   - URL: https://github.com/KooshaPari/phenotypeActions/actions/runs/22633353020
   - Result: workflow completed with explicit rollout decision JSON/CSV and ranked next-repo rollout JSON/CSV outputs.

## Canary Outcomes (Run `22631922418`)

- `civ`: `repo_unreachable`, category `access_repo_unreachable`, owner hint `verify owner=KooshaPari`, token hint `contents:read + repo visibility`.
- `trash-cli`: `strictness_drift`, category `strictness_signal_alignment_required`, owner hint `owner=KooshaPari`, token hint `repo_read_required`.

Artifacts:
- `stage-gates-canary-readiness-matrix-22631922418-1.csv`
- `stage-gates-canary-remediation-22631922418-1.md`
- `stage-gates-canary-summary-table-22631922418-1.md`

## Outcome

- Canary dry-run lane now executes successfully in hosted GitHub Actions after checkout/dependency fixes.
- Remaining blockers are target-repo accessibility (`civ`) and template/contract drift in reachable repos (`trash-cli`).
- Rollout progression now uses objective phase criteria:
  - `hold` fail: analyzed coverage <100% or any `repo_unreachable`
  - `phase-1` pass: analyzed coverage =100% and >=50% canary-ready
  - `phase-2` pass: analyzed coverage =100% and >=80% canary-ready
  - `broad` pass: analyzed coverage =100% and 100% canary-ready for 2 consecutive runs

## Canary Outcomes (Run `22633353020`)

- Decision: `hold` (`decision_reason=insufficient_thresholds`)
- Coverage: `50%` (`1/2` repos analyzed)
- Canary-ready: `0%` (`0/1` analyzed repos ready)

Deterministic captured artifacts:
- `docs/stage-gates-canary-readiness-matrix-2026-03-03-run-22633353020.csv`
- `docs/stage-gates-canary-remediation-2026-03-03-run-22633353020.md`
- `docs/stage-gates-canary-summary-table-2026-03-03-run-22633353020.md`
- `docs/stage-gates-canary-decision-2026-03-03-run-22633353020.csv`
- `docs/stage-gates-canary-decision-2026-03-03-run-22633353020.json`
- `docs/stage-gates-next-repo-rollout-2026-03-03-run-22633353020.csv`
- `docs/stage-gates-next-repo-rollout-2026-03-03-run-22633353020.json`

Ranked next-repo rollout list (current thresholds/artifacts):
1. `trash-cli` (priority_score `10`, action `fix_then_retry`)
   - Next command: `rg -n "severity:[[:space:]]*info|comment_severity_threshold:[[:space:]]*LOW|STAGE_GATES_STRICT" trash-cli/.coderabbit.yaml trash-cli/.gemini/config.yaml trash-cli/.github/workflows/stage-gates.yml`
2. `civ` (priority_score `0`, action `fix_then_retry`)
   - Next command: `gh repo view KooshaPari/civ || gh auth refresh -h github.com -s repo`
