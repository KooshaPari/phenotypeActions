# Stage-Gates Canary Adopter Readiness Matrix (2026-03-03)

Canary-first dry-run scope: `civ`, `trash-cli`.
Primary evidence run: `22606340304` (successful workflow execution).

| repo | run_outcome | governance_drift | workflow_drift | stage_gates_drift | strictness_drift | stage_gates_ready | canary_ready | remediation_hint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| civ | repo_unreachable | false | false | false | false | false | false | verify `KooshaPari/civ` visibility and token read scope |
| trash-cli | strictness_drift | false | true | true | true | false | false | apply stage-gates contract template and strictness policy wiring |

## Rollout Recommendation

Use phase gates with objective thresholds:

- `hold`: fewer than 80% canary repos analyzed, or any `repo_unreachable` outcome.
- `phase-1`: 100% canary repos analyzed and at least 50% `canary_ready=true`.
- `phase-2`: 100% canary repos analyzed and at least 80% `canary_ready=true`.
- `broad`: 100% canary repos analyzed and 100% `canary_ready=true` for 2 consecutive runs.

Current state (2026-03-03): `hold` because `civ` is `repo_unreachable` and 0/2 repos are `canary_ready=true`.
