# PRD - phenotypeActions

## Overview

phenotypeActions is the centralized GitHub Actions library for the Phenotype organization. It provides reusable composite actions and reusable workflows that standardize CI/CD quality gates, automated code-review orchestration, security scanning, PR policy enforcement, and governance template distribution across all Phenotype repositories. Consumer repos reference this library by floating major tag (`@v0`, `@v1`) to receive patches without manual ref updates.

---

## E1: Review Wave Orchestration

### E1.1: Multi-Wave Code Review Triggering

As a repository maintainer, I want incoming pull requests to automatically trigger multi-wave AI code-review bots so that reviews from multiple tools (CodeRabbit, Gemini Code Assist, Augment, Codex) happen in a coordinated sequence without redundant triggers.

**Acceptance Criteria**:
- Wave 1 bots (default: `coderabbitai`, `gemini-code-assist`) are triggered first via PR comments of the form `@<bot> review\n\n<marker>`.
- Wave 2 bots (default: `augment`, `codex`) are triggered after wave 1.
- The reusable workflow `review-wave-orchestrator.yml` fires on `pull_request` events (`opened`, `reopened`, `synchronize`, `ready_for_review`) and supports `workflow_call` for programmatic dispatch.
- Concurrency is managed per PR number; in-progress orchestration is cancelled on new pushes.
- Required permissions: `contents: read`, `pull-requests: write`, `issues: write`.

### E1.2: Cooldown and Retry Guard

As a CI system, I want redundant bot triggers suppressed so that review bots are not spammed by rapid PR updates.

**Acceptance Criteria**:
- The `review-orchestrator` composite action reads existing PR comments to detect prior trigger markers (pattern: `bot-review-trigger: <bot>`).
- If a bot has been triggered within `cooldown_minutes` (default: 15), the trigger is skipped with log: `[skip] <bot>: cooldown active`.
- If a bot has reached `retry_budget` (default: 2) triggers, the trigger is skipped with log: `[skip] <bot>: retry budget reached`.
- Only the `gh` CLI is required; no external services.

---

## E2: Policy Gate Enforcement

### E2.1: Namespace Ownership Enforcement

As an org admin, I want PRs originating outside the allowed namespace automatically blocked so that only authorized contributors can merge to protected repos.

**Acceptance Criteria**:
- The `policy-gate` composite action accepts `allowed_namespace`, `allowed_bots`, `pr_author`, and `head_owner` inputs.
- If `allowed_namespace` is set and the PR author is not in the bot allowlist and does not match the namespace, the action exits non-zero with a `::error::` annotation.
- Bot authors listed in `allowed_bots` (comma-separated) are always exempt.

### E2.2: Layered Fix Policy

As a release engineer, I want `fix/*` branches blocked from targeting `main`/`master` directly so that hotfixes are always staged through layered branches.

**Acceptance Criteria**:
- When `require_layered_fix=true` and a PR head ref matches `fix/*` targeting `main` or `master`, the action exits with an error unless the PR carries the `layered-pr-exception` label.
- Default is `require_layered_fix=false`; the check is skipped unless explicitly enabled.

### E2.3: Merge Commit Detection

As a project maintainer, I want merge commits in PR diff ranges detected and blocked so that the commit history remains linear.

**Acceptance Criteria**:
- The action uses `git rev-list --merges origin/<base>..<HEAD_SHA>` to find merge commits.
- If any are found and `block_merge_commits=true` (default), the action exits non-zero listing the offending SHAs.

### E2.4: Build Matrix Generation

As a CI workflow author, I want pre-defined billing-aware build matrices so that I do not maintain platform lists in every consumer repo.

**Acceptance Criteria**:
- When `matrix_type` is one of `bazel`, `rust-ci`, `rust-release`, or `shell-tool-mcp`, the action outputs valid JSON matrices via `GITHUB_OUTPUT`.
- With `enable_billed_runners=false` (default): matrices include only standard Linux runners (`ubuntu-24.04`, `ubuntu-24.04-arm`).
- With `enable_billed_runners=true`: matrices expand to include `macos-latest`, `macos-15-xlarge`, `windows-latest`.
- Output keys per type: `bazel_matrix`; `lint_build_matrix` + `tests_matrix`; `build_matrix`; `bash_darwin_matrix` + `zsh_darwin_matrix`.

---

## E3: Security Guard

### E3.1: Pre-Commit Hook Scanning on PRs

As a security engineer, I want every PR to run pre-commit security hooks so that secrets, unsafe shell patterns, and lint violations are caught before merge.

**Acceptance Criteria**:
- `security-guard.yml` triggers on `pull_request` to `main`/`master` and `workflow_dispatch`.
- Uses `pre-commit/action@v3.0.1` with the repo's `.pre-commit-config.yaml` and `--show-diff-on-failure`.
- Full checkout (`fetch-depth: 0`) ensures diff-based hooks have full history.
- Workflow fails on any hook violation.

### E3.2: Hook Installation Audit

As a DevOps engineer, I want an audit workflow that verifies security-guard hooks are installed correctly in consumer repos.

**Acceptance Criteria**:
- `security-guard-hook-audit.yml` is callable and produces a report of installed vs expected hooks per repo.
- The audit runs `shellcheck` against hook scripts.

---

## E4: Template Synchronization

### E4.1: Org-Wide Governance Template Distribution

As an org admin, I want to push governance files (CI workflows, CODEOWNERS, `.pre-commit-config.yaml`) from `template-commons` to all Phenotype repos via automated PRs so that governance drift is eliminated.

**Acceptance Criteria**:
- `template-sync.yml` triggers via `repository_dispatch` (type: `template-commons-updated`) and `workflow_dispatch`.
- `workflow_dispatch` inputs: `target_repos` (comma-separated, default: all known Phenotype repos), `template_repo` (default: `template-commons`), `stage_gates_repo` (default: `phenotype-config`), `dry_run` (default: `false`).
- A preflight step resolves repo slugs under both `REPO_OWNER` and `Phenotype` namespaces using `gh repo view`. If inaccessible, it emits a skip-classification CSV artifact and exits cleanly without failure.
- In live mode: the `template-sync` composite action creates PRs in each target repo with updated templates.
- In dry-run mode: the action reports drift without creating PRs.
- Artifacts uploaded per run: canary readiness matrix CSV, decision CSV + JSON, remediation report MD, next-rollout CSV + JSON.

### E4.2: Stage-Gates Canary Readiness

As a release manager, I want template sync to evaluate stage-gates readiness per target repo so that I can identify repos not yet ready for rollout.

**Acceptance Criteria**:
- Action produces `stage-gates-canary-readiness-matrix-<run_id>-<run_attempt>.csv` per run.
- Action produces `stage-gates-canary-decision-<run_id>-<run_attempt>.csv` and `.json` with per-repo rollout decisions.
- Action produces `stage-gates-next-repo-rollout-<run_id>-<run_attempt>.csv` listing the next batch.

---

## E5: Action Packaging Validation

### E5.1: Action Metadata Completeness

As a contributor, I want CI to validate all `action.yml` files contain required metadata so that consumers receive complete, documented actions.

**Acceptance Criteria**:
- `validate-packaging.yml` runs on PRs to this repo.
- Every `action.yml` must declare `name`, `description`, `inputs`, and `outputs`.
- All shell scripts in `.github/scripts/` and `.github/hooks/` pass `shellcheck` without errors.
- The workflow blocks merge on any metadata or shellcheck failure.

---

## E6: Self-Governance

### E6.1: Self-Merge Gate

As an org automation, I want auto-generated PRs to this repo gated by policy checks before self-merging so that bot-authored changes pass the same bar as human-authored ones.

**Acceptance Criteria**:
- `self-merge-gate.yml` triggers on PR events and applies policy-gate checks before allowing auto-merge.
- The workflow reads `workflow-permissions.yml` configuration to determine allowed merge actors.

### E6.2: Release Automation

As a maintainer, I want releases auto-drafted from merged PR titles so that the CHANGELOG is generated without manual effort.

**Acceptance Criteria**:
- `release-drafter.yml` generates draft releases on merge to `main`.
- Tags follow semantic versioning; floating major tags (`v0`, `v1`) are moved on each release.
- Tag automation is handled by `tag-automation.yml`.
