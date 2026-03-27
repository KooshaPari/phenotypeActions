# Architecture Decision Records - phenotypeActions

## ADR-001: Composite Actions vs Reusable Workflows

**Status**: Accepted
**Date**: 2026-03-27

**Context**: GitHub Actions offers two reuse mechanisms: composite actions (step-level, invoked with `uses:` inside a job) and reusable workflows (job-level, invoked with `uses:` as a full job). They differ in runner scope, permission inheritance, and secret handling.

**Decision**: Use composite actions (`actions/*/action.yml`) for step-level logic that needs to run within an existing job. Use reusable workflows (`.github/workflows/*.yml`) for logic that requires its own job, runner, or permission set.

**Rationale**:
- Composite actions share the caller's job runner and environment variables, making them suitable for policy checks and bot-triggering steps embedded in larger pipelines.
- Reusable workflows provide full job isolation; required for security-guard scanning (own `contents: read` permission) and review orchestration (own `pull-requests: write` permission).
- Mixing the two allows consumers to compose at either granularity level.

**Consequences**:
- Composite actions cannot use `secrets:` inheritance directly; callers must pass secrets as inputs.
- Reusable workflows define their own runners; consumers cannot override the runner type at call time.
- Breaking input/output changes in composite actions require a new major tag.

---

## ADR-002: Floating Major Tags for Consumer Versioning

**Status**: Accepted
**Date**: 2026-03-27

**Context**: Consumer repos need stable action references that automatically receive non-breaking patches. Pinning to exact SHAs or minor tags requires manual bumps across many repos.

**Decision**: Publish floating major tags (`v0`, `v1`) that are force-moved on each non-breaking release. Exact semantic tags (`v0.1.0`) are also published for audit trails. Consumers pin to `@v0` in workflow YAML; exact tags are used in CHANGELOG and release notes.

**Rationale**:
- Floating tags eliminate the need for consumers to update refs for patch/minor releases.
- Exact tags provide an immutable reference for security audits and rollback.
- This is the standard pattern used by `actions/checkout`, `actions/upload-artifact`, etc.

**Consequences**:
- Breaking changes require a new major tag (`v1`). All consumers must be updated when the previous major is retired.
- Force-pushing tags loses the ability to determine which exact commit a consumer was on before the force-move; exact tags mitigate this.
- Repo must maintain a `tag-automation.yml` workflow to move floating tags reliably.

---

## ADR-003: Shell Scripts for Complex Action Logic

**Status**: Accepted
**Date**: 2026-03-27

**Context**: Inline YAML `run:` blocks in composite actions become difficult to read, test, and lint once they exceed ~20 lines. Shellcheck cannot be applied to YAML-embedded shell without extraction.

**Decision**: Extract all complex shell logic (>20 lines or requiring shellcheck compliance) to `.github/scripts/<name>.sh`. Composite action steps invoke these scripts; they do not embed the logic inline.

**Rationale**:
- Scripts in `.github/scripts/` are testable with `shellcheck` and `bats`.
- YAML action files remain declarative: inputs mapped to env vars, script invocation, output capture.
- The `validate-packaging.yml` CI workflow can apply `shellcheck` to all `.sh` files automatically.

**Consequences**:
- Scripts must use `set -euo pipefail` as the first non-comment line.
- Scripts receive all inputs via environment variables (never positional args from YAML interpolation) to prevent injection.
- Contributors must update both the script and the action's `inputs:` block when changing the interface.

---

## ADR-004: PR Comment Marker Protocol for Bot Cooldown

**Status**: Accepted
**Date**: 2026-03-27

**Context**: AI review bots (CodeRabbit, Gemini, Augment, Codex) are triggered by PR comments. Without a coordination layer, rapid PR updates (force-pushes, amended commits) can trigger the same bot multiple times within seconds, causing noise and wasted review cycles.

**Decision**: Use a structured PR comment marker as a distributed, stateless coordination token. Every bot trigger writes a comment prefixed `bot-review-trigger: <bot> <ISO-timestamp> <wave>`. Before triggering, the action reads all PR comments, counts markers per bot, and checks the timestamp of the most recent marker against `cooldown_minutes`.

**Rationale**:
- No external state store (Redis, DB, GitHub variable) is required; the PR comment thread is the source of truth.
- The approach works across multiple concurrent workflow runs because `gh pr view` returns live data at query time.
- Cooldown and retry budget are both observable as comment history on the PR.

**Consequences**:
- Bot comment threads will accumulate trigger marker comments over the PR lifetime. These are low-noise but visible.
- If GitHub API is slow, two concurrent runs may both read stale comment counts and both trigger the same bot. The retry budget limits the blast radius to `retry_budget` triggers per run.
- Changing `cooldown_minutes` or `retry_budget` takes effect immediately on the next workflow run; no migration needed.

---

## ADR-005: Billed Runner Opt-In via Policy Gate

**Status**: Accepted
**Date**: 2026-03-27

**Context**: GitHub Actions bills for macOS and Windows runners. The Phenotype org has a persistent billing constraint where billed runner jobs fail immediately with a spending-limit error. CI matrices that include macOS/Windows targets by default would always fail.

**Decision**: The `policy-gate` composite action generates build matrices with `enable_billed_runners=false` as the default, producing Linux-only matrices. Callers explicitly set `enable_billed_runners=true` to include macOS/Windows targets.

**Rationale**:
- Linux-only matrices work on the free tier; billed targets require explicit opt-in to avoid accidental CI spend.
- Matrix generation is centralized in the policy-gate action so all consuming repos benefit from the billing guard automatically.
- The `self-merge-gate.yml` and `ci.yml` workflows pass `enable_billed_runners` from a repository variable to make the behavior configurable per-repo without code changes.

**Consequences**:
- macOS and Windows CI coverage is disabled by default across all Phenotype repos until billing is resolved.
- Consuming repos wanting cross-platform builds must set the `ENABLE_BILLED_RUNNERS` repository variable to `true` and accept the associated cost.

---

## ADR-006: Template Sync Preflight with Graceful Skip

**Status**: Accepted
**Date**: 2026-03-27

**Context**: The `template-sync.yml` workflow depends on two external repos (`template-commons`, `phenotype-config`). These repos may be private or inaccessible depending on the GitHub token permissions available to the workflow. A hard failure on missing dependencies would block all template sync runs in forks or environments without full access.

**Decision**: The workflow runs a preflight step that resolves dependency repos under both the repository owner's namespace and the `Phenotype` fallback namespace. If resolution fails, the workflow emits a structured skip-classification CSV artifact, logs the reason, and exits with status 0. No subsequent steps run.

**Rationale**:
- Graceful preflight skip prevents false-alarm alerts when the workflow runs in contexts without full repo access (e.g., forks, fresh org setups).
- Emitting a CSV artifact makes the skip auditable and machine-readable for downstream tooling.
- Exit 0 on preflight skip means the workflow does not count as a failing check on PRs, avoiding merge blocks for infrastructure-level access issues.

**Consequences**:
- Template sync silently skips in environments without access to `template-commons`. Operators must check workflow artifacts (not CI status) to detect access problems.
- The preflight logic must be kept in sync with the actual dependency list as new template repos are added.
