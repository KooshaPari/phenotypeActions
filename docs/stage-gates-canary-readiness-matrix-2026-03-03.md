# Stage-Gates Canary Adopter Readiness Matrix (2026-03-03)

Canary-first dry-run scope: `civ`, `trash-cli`.
Primary evidence run: `22606340304` (successful workflow execution).

| repo | run_outcome | governance_drift | workflow_drift | stage_gates_drift | strictness_drift | stage_gates_ready | canary_ready | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| civ | failed_access | n/a | n/a | n/a | n/a | n/a | n/a | runner token could not clone `KooshaPari/civ` |
| trash-cli | analyzed | false | true | true | true | false | false | drift detected in workflow wiring, stage-gates contract, and strictness signal |

## Rollout Recommendation

- Keep rollout canary-scoped.
- Unblock workflow token access to `civ`.
- Remediate `trash-cli` drift before expanding rollout.
