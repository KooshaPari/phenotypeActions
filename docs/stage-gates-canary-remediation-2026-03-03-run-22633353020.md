# Stage-Gates Canary Remediation Summary (22633353020-1)

| repo | run_outcome | remediation_hint | next_command |
| --- | --- | --- | --- |
| civ | repo_unreachable | repo_unreachable: verify KooshaPari/civ exists and token has repo read access | `gh repo view KooshaPari/civ || gh auth refresh -h github.com -s repo` |
| trash-cli | strictness_drift | set CodeRabbit severity=info, Gemini threshold=LOW, and include STAGE_GATES_STRICT wiring | `rg -n "severity:[[:space:]]*info|comment_severity_threshold:[[:space:]]*LOW|STAGE_GATES_STRICT" trash-cli/.coderabbit.yaml trash-cli/.gemini/config.yaml trash-cli/.github/workflows/stage-gates.yml` |
