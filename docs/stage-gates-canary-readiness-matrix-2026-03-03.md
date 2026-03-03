# Stage-Gates Canary Adopter Readiness Matrix (2026-03-03)

Canary-first dry-run scope: `civ`, `trash-cli`.
Primary evidence run: `22631922418` (successful workflow execution).

| repo | run_outcome | remediation_category | owner_hint | token_hint | governance_drift | workflow_drift | stage_gates_drift | strictness_drift | stage_gates_ready | canary_ready | remediation_hint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| civ | repo_unreachable | access_repo_unreachable | verify owner=KooshaPari | contents:read + repo visibility | false | false | false | false | false | false | verify `KooshaPari/civ` visibility and token read scope |
| trash-cli | strictness_drift | strictness_signal_alignment_required | owner=KooshaPari | repo_read_required | false | true | true | true | false | false | apply stage-gates contract template and strictness policy wiring |

## Phase-Gate Rollout Criteria

Pass/fail thresholds (deterministic):

- `hold` fail conditions: analyzed coverage `< 100%`, or any `run_outcome=repo_unreachable`.
- `phase-1` pass conditions: analyzed coverage `= 100%` and `canary_ready=true` for at least `50%` of canary repos.
- `phase-2` pass conditions: analyzed coverage `= 100%` and `canary_ready=true` for at least `80%` of canary repos.
- `broad` pass conditions: analyzed coverage `= 100%` and `canary_ready=true` for `100%` of canary repos across `2` consecutive runs.

Current state (2026-03-03): `hold` (fail) because `civ` is `repo_unreachable`, analyzed coverage is below `100%`, and readiness is `0/2`.

Next candidate repos (only after phase-1 pass):

- `parpour`
- `phenodocs`
- `tokenledger`
