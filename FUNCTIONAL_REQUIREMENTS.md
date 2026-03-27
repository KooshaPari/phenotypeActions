# Functional Requirements - phenotypeActions

## Review Wave Orchestration

### FR-RW-001: Multi-Wave Sequential Bot Triggering
The `review-wave-orchestrator.yml` reusable workflow SHALL execute review bots in two configurable sequential waves on PR events (`opened`, `reopened`, `synchronize`, `ready_for_review`).
Traces to: E1.1

### FR-RW-002: Wave Bot Configuration via Inputs
The workflow SHALL accept `wave1_bots` and `wave2_bots` as comma-separated bot handle strings; defaults SHALL be `coderabbitai,gemini-code-assist` and `augment,codex` respectively.
Traces to: E1.1

### FR-RW-003: PR Comment Trigger Mechanism
The `review-orchestrator` composite action SHALL post a PR comment in the format `@<bot> review\n\nbot-review-trigger: <bot> <timestamp> <wave>` to trigger each bot.
Traces to: E1.1

### FR-RW-004: Cooldown Guard
The action SHALL read existing PR comments and skip triggering a bot if the most recent trigger marker for that bot is less than `cooldown_minutes` minutes old.
Log output on skip: `[skip] <bot>: cooldown active (<age>m < <cooldown>m)`.
Traces to: E1.2

### FR-RW-005: Retry Budget Enforcement
The action SHALL skip triggering a bot if the count of existing trigger markers for that bot meets or exceeds `retry_budget`.
Log output on skip: `[skip] <bot>: retry budget reached (<count>/<budget>)`.
Traces to: E1.2

### FR-RW-006: Concurrency Control
The reusable workflow SHALL define a concurrency group `review-orchestrator-<pr_number>` with `cancel-in-progress: true` to prevent overlapping executions.
Traces to: E1.1

### FR-RW-007: Required Permissions
The `review-wave-orchestrator.yml` workflow SHALL declare permissions `contents: read`, `pull-requests: write`, `issues: write`.
Traces to: E1.1

---

## Policy Gate

### FR-PG-001: Namespace Ownership Check
When `allowed_namespace` is set, the `policy-gate` action SHALL reject PRs where `pr_author` does not match the namespace and is not in `allowed_bots`, exiting with `::error::PR must come from namespace '<namespace>.'`.
Traces to: E2.1

### FR-PG-002: Bot Author Exemption
Authors present in the `allowed_bots` comma-separated list SHALL be exempt from namespace ownership checks.
Traces to: E2.1

### FR-PG-003: Layered Fix Enforcement
When `require_layered_fix=true`, the action SHALL reject PRs where `head_ref` matches `fix/*` and `base_branch` is `main` or `master`, unless the PR has the `layered-pr-exception` label.
Error message: `fix/* PRs must target a layered branch, not main/master.`
Traces to: E2.2

### FR-PG-004: Merge Commit Detection
When `block_merge_commits=true` (default), the action SHALL run `git rev-list --merges origin/<base>..<HEAD>` and exit non-zero if any merge commit SHAs are found.
Traces to: E2.3

### FR-PG-005: Policy Pass Output
On successful completion of all enabled checks, the action SHALL set `passed=true` on `GITHUB_OUTPUT`.
Traces to: E2.1, E2.2, E2.3

### FR-PG-006: Bazel Matrix Output
When `matrix_type=bazel` and `enable_billed_runners=false`, the action SHALL output a `bazel_matrix` JSON with Linux targets `x86_64-unknown-linux-gnu` and `x86_64-unknown-linux-musl` on `ubuntu-24.04`.
When `enable_billed_runners=true`, the matrix SHALL additionally include macOS `aarch64-apple-darwin` and `x86_64-apple-darwin` targets.
Traces to: E2.4

### FR-PG-007: Rust CI Matrix Output
When `matrix_type=rust-ci`, the action SHALL output `lint_build_matrix` (dev + release profiles, Linux targets) and `tests_matrix` (dev profile, Linux only by default).
Traces to: E2.4

### FR-PG-008: Rust Release Matrix Output
When `matrix_type=rust-release`, the action SHALL output `build_matrix` covering `x86_64-unknown-linux-musl`, `x86_64-unknown-linux-gnu`, `aarch64-unknown-linux-musl`, `aarch64-unknown-linux-gnu` on Ubuntu runners.
Traces to: E2.4

### FR-PG-009: Shell Tool MCP Matrix Output
When `matrix_type=shell-tool-mcp`, the action SHALL output `bash_darwin_matrix` and `zsh_darwin_matrix`. Both SHALL be empty when `enable_billed_runners=false`; populated with macOS-15-xlarge and macOS-14 runners when `enable_billed_runners=true`.
Traces to: E2.4

---

## Security Guard

### FR-SG-001: Pre-Commit Hook Execution
`security-guard.yml` SHALL invoke `pre-commit/action@v3.0.1` with `--hook-stage pre-commit` and `--show-diff-on-failure` on all PRs targeting `main` or `master`.
Traces to: E3.1

### FR-SG-002: Full Checkout
The security guard workflow SHALL perform `actions/checkout@v4` with `fetch-depth: 0` to support diff-sensitive hooks.
Traces to: E3.1

### FR-SG-003: Workflow Dispatch Support
Both `security-guard.yml` and `security-guard-hook-audit.yml` SHALL support `workflow_dispatch` for manual execution.
Traces to: E3.1, E3.2

### FR-SG-004: Hook Audit Shellcheck
The `security-guard-hook-audit.yml` workflow SHALL run `shellcheck` against hook scripts in `.github/hooks/` and `.github/scripts/`.
Traces to: E3.2

---

## Template Synchronization

### FR-TS-001: Repository Dispatch Trigger
`template-sync.yml` SHALL execute on `repository_dispatch` events of type `template-commons-updated` to support push-based synchronization from the template source repo.
Traces to: E4.1

### FR-TS-002: Manual Dispatch Inputs
The workflow SHALL accept `workflow_dispatch` inputs: `target_repos` (string, default empty = all), `template_repo` (string, default `template-commons`), `stage_gates_repo` (string, default `phenotype-config`), `dry_run` (choice `true`/`false`, default `false`).
Traces to: E4.1

### FR-TS-003: Preflight Repo Resolution
The workflow SHALL resolve repo slugs by attempting `gh repo view <REPO_OWNER>/<name>` then `gh repo view Phenotype/<name>`. On failure to resolve `template-commons` or `phenotype-config`, the workflow SHALL emit a preflight skip classification CSV artifact and exit with status 0 (not failure).
Traces to: E4.1

### FR-TS-004: PR Creation in Target Repos (Live Mode)
When `dry_run=false`, the `template-sync` composite action SHALL create PRs in each target repo containing the updated governance files.
Traces to: E4.1

### FR-TS-005: Drift Report (Dry-Run Mode)
When `dry_run=true`, the action SHALL report drift per target repo without creating PRs or modifying any repo.
Traces to: E4.1

### FR-TS-006: Canary Artifact Upload
The workflow SHALL upload per-run artifacts on `always()`: readiness matrix CSV, decision CSV, decision JSON, remediation report MD, summary table MD, next-rollout CSV, next-rollout JSON.
Artifact name pattern: `stage-gates-canary-<run_id>-<run_attempt>`.
Traces to: E4.2

---

## Action Packaging Validation

### FR-VP-001: Required Metadata Fields
`validate-packaging.yml` SHALL verify every `action.yml` in `actions/*/` contains `name`, `description`, `inputs`, and `outputs` top-level keys.
Traces to: E5.1

### FR-VP-002: Shellcheck Compliance
All shell scripts in `.github/scripts/*.sh` and `.github/hooks/*.sh` SHALL pass `shellcheck` with no errors.
Traces to: E5.1

### FR-VP-003: YAML Syntax Validation
All workflow YAML files in `.github/workflows/` and all `action.yml` files SHALL pass `yamllint` with no errors.
Traces to: E5.1

### FR-VP-004: Merge Blocking on Failure
`validate-packaging.yml` SHALL block PR merge when any of FR-VP-001, FR-VP-002, or FR-VP-003 fails.
Traces to: E5.1

---

## Self-Governance

### FR-SG-010: Self-Merge Gate Policy Application
`self-merge-gate.yml` SHALL apply policy-gate checks to bot-authored PRs to this repo before permitting auto-merge.
Traces to: E6.1

### FR-SG-011: Release Draft Generation
`release-drafter.yml` SHALL auto-draft releases from merged PR titles on push to `main`.
Traces to: E6.2

### FR-SG-012: Floating Tag Automation
`tag-automation.yml` SHALL move floating major tags (`v0`, `v1`) on each tagged release commit.
Traces to: E6.2
