# Stage-Gates Canary Summary Table (22633353020-1)

| repo | run_outcome | remediation_category | owner_hint | token_hint | stage_gates_ready | canary_ready | next_command |
| --- | --- | --- | --- | --- | --- | --- | --- |
| civ | repo_unreachable | access_repo_unreachable | verify owner=KooshaPari | ensure token has contents:read and repo visibility for KooshaPari/civ | false | false | `gh repo view KooshaPari/civ || gh auth refresh -h github.com -s repo` |
| trash-cli | strictness_drift | strictness_signal_alignment_required | owner=KooshaPari | token=repo_read_required | false | false | `rg -n "severity:[[:space:]]*info|comment_severity_threshold:[[:space:]]*LOW|STAGE_GATES_STRICT" trash-cli/.coderabbit.yaml trash-cli/.gemini/config.yaml trash-cli/.github/workflows/stage-gates.yml` |
