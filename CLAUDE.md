# phenotypeActions

Shared GitHub Actions, composite actions, and reusable workflows for the Phenotype organization.
Centralizes review orchestration, policy gates, security guards, and template sync across all Phenotype repos.

## Quick Start

### Consuming an action in a product repo

```yaml
# Reusable workflow (called from a job)
jobs:
  review:
    uses: KooshaPari/phenotypeActions/.github/workflows/review-wave-orchestrator.yml@v0
    with:
      wave1_bots: "coderabbitai,gemini-code-assist"

# Composite action (called as a step)
steps:
  - uses: KooshaPari/phenotypeActions/actions/review-orchestrator@v0
```

Pin to a release tag (`@v0`) or full commit SHA in production repos.

## Repository Structure

```
phenotypeActions/
  actions/                          # Composite actions (step-level)
    review-orchestrator/
      action.yml                    # Review wave orchestration action
    template-sync/
      action.yml                    # Template synchronization action
  .github/
    workflows/                      # Reusable workflows (job-level)
      policy-gate.yml               # Policy compliance gate
      review-wave-orchestrator.yml  # Multi-wave review bot orchestration
      security-guard.yml            # Security scanning workflow
      security-guard-hook-audit.yml # Hook audit for security guard
      template-sync.yml             # Template sync workflow
      validate-packaging.yml        # Action packaging validation
    scripts/
      security-guard.sh             # Security guard shell logic
    hooks/
      pre-commit                    # Pre-commit hook
      security-guard.sh             # Local security guard hook
  docs/
    workflow-migration-audit.md     # Migration audit from other repos
  CODEOWNERS
  LICENSE
```

## Architecture

### Composite Actions vs Reusable Workflows

This repo provides two integration layers:

- **Composite actions** (`actions/*/action.yml`) -- invoked as a step within a job.
  They bundle multiple steps (shell scripts, other actions) into a single reusable step.
  Inputs and outputs are defined in the `action.yml` metadata.

- **Reusable workflows** (`.github/workflows/*.yml`) -- invoked as an entire job via `uses:`.
  They define complete jobs with their own runners, permissions, and secrets.
  Inputs are defined under `workflow_call`.

### Naming Conventions

- Action directories: `actions/<action-name>/action.yml` (kebab-case).
- Workflow files: `.github/workflows/<name>.yml` (kebab-case).
- Shell scripts: `.github/scripts/<name>.sh` -- sourced by workflows or actions.

### Input/Output Contract

Every composite action must declare:
- `inputs:` with descriptions and required/default annotations.
- `outputs:` with descriptions for any values passed downstream.
- `runs.using: composite` with explicit `shell:` on each step.

Every reusable workflow must declare:
- `on.workflow_call.inputs:` and optionally `secrets:`.
- Clear job naming for caller-side status checks.

## Testing

### Local validation

```bash
# Validate YAML syntax for all action and workflow files
yamllint actions/ .github/workflows/

# Shellcheck all scripts
shellcheck .github/scripts/*.sh .github/hooks/*.sh

# Validate action packaging
# The validate-packaging workflow checks that action.yml files are well-formed
```

### Integration testing

Test actions by referencing a branch in a consumer repo workflow:

```yaml
uses: KooshaPari/phenotypeActions/actions/review-orchestrator@my-feature-branch
```

After verifying, switch the ref back to a release tag.

### CI

The `validate-packaging.yml` workflow runs on PRs to this repo and checks:
- Action metadata is valid.
- Required fields (inputs, outputs, description) are present.
- Shell scripts pass shellcheck.

## Code Quality

- **YAML**: Use `yamllint` with default config. No trailing spaces, consistent indentation (2 spaces).
- **Shell**: All `.sh` files must pass `shellcheck`. Use `set -euo pipefail` in bash scripts.
- **Action metadata**: Every `action.yml` must have a top-level `name:` and `description:`.
- **No hardcoded refs**: Consumer examples should use `@v0` or `@<tag>`, never `@main`.

## Git Workflow

- Feature work happens in worktrees: `phenotypeActions-wtrees/<topic>/` or `PROJECT-wtrees/<topic>/`.
- The canonical `phenotypeActions/` checkout stays on `main` except during pull/merge.
- One concern per PR. Keep PRs small and independently reviewable.
- All CI checks (validate-packaging, yamllint, shellcheck) must pass before merge.
- Use release tags (`v0`, `v1`) for consumer-facing versions. Consumers pin to these tags.

## Common Workflows

### Adding a new composite action

1. Create `actions/<action-name>/action.yml`.
2. Define `name`, `description`, `inputs`, `outputs`, and `runs` with `using: composite`.
3. Add shell scripts to `.github/scripts/` if the action needs non-trivial logic.
4. Add a test reference in a consumer repo workflow on your feature branch.
5. Update `validate-packaging.yml` if new validation rules are needed.
6. Open a PR, verify CI, merge, and tag a release.

### Adding a new reusable workflow

1. Create `.github/workflows/<name>.yml`.
2. Define `on.workflow_call` with `inputs:` and optionally `secrets:`.
3. Add consumer-facing documentation in the README or inline comments.
4. Test by calling the workflow from a consumer repo using `@<branch>`.
5. Open a PR, verify CI, merge, and tag.

### Updating an existing action

1. Edit `actions/<action-name>/action.yml` or associated scripts.
2. If inputs/outputs change, update descriptions and defaults.
3. Test in a consumer repo on the feature branch before merging.
4. After merge, decide if the change is breaking:
   - Non-breaking: existing tags continue to work.
   - Breaking: cut a new major tag (`v1` -> `v2`) and update consumers.

### Tagging a release

```bash
git tag -a v0 -m "Release v0" --force   # Move floating tag
git push origin v0 --force               # Update remote tag
```

Use floating major tags (`v0`, `v1`) so consumers auto-receive patches.
Use exact tags (`v0.1.0`) for audit trails.

## Session documentation

Use `docs/index.md` and `docs/sessions/<YYYYMMDD-descriptive-name>/` for extended agent session artifacts; promote durable, repo-wide guidance into this file or `README.md` when stabilized.

## CI Completeness Policy

- Always evaluate and fix ALL CI check failures on a PR, including pre-existing failures inherited from main.
- Never dismiss a CI failure as "pre-existing" or "unrelated to our changes" — if it fails on the PR, fix it in the PR.
- This includes: build, lint, test, docs build, security scanning (CodeQL), code review gates (CodeRabbit), workflow guard checks, and any other CI jobs.
- When a failure is caused by infrastructure outside the branch (e.g., rate limits, external service outages), implement or improve automated retry/bypass mechanisms in CI workflows.
- After fixing CI failures, verify locally where possible (build, vet, tests) before pushing.

## Phenotype Git and Delivery Workflow Protocol <!-- PHENOTYPE_GIT_DELIVERY_PROTOCOL -->

- Use branch-based delivery with pull requests; do not rely on direct default-branch writes where rulesets apply.
- Prefer stacked PRs for multi-part changes so each PR is small, reviewable, and independently mergeable.
- Keep PRs linear and scoped: one concern per PR, explicit dependency order for stacks, and clear migration steps.
- Enforce CI and required checks strictly: do not merge until all required checks and policy gates are green.
- Resolve all review threads and substantive PR comments before merge; do not leave unresolved reviewer feedback.
- Follow repository coding standards and best practices (typing, tests, lint, docs, security) before requesting merge.
- Rebase or restack to keep branches current with target branch and to avoid stale/conflicting stacks.
- When a ruleset or merge policy blocks progress, surface the blocker explicitly and adapt the plan (for example: open PR path, restack, or split changes).

## Phenotype Org Cross-Project Reuse Protocol <!-- PHENOTYPE_SHARED_REUSE_PROTOCOL -->

- Treat this repository as part of the broader Phenotype organization project collection, not an isolated codebase.
- During research and implementation, actively identify code that is sharable, modularizable, splittable, or decomposable for reuse across repositories.
- When reusable logic is found, prefer extraction into existing shared modules/projects first; if none fit, propose creating a new shared module/project.
- Include a `Cross-Project Reuse Opportunities` section in plans with candidate code, target shared location, impacted repos, and migration order.
- For cross-repo moves or ownership-impacting extractions, ask the user for confirmation on destination and rollout, then bake that into the execution plan.
- Execute forward-only migrations: extract shared code, update all callers, and remove duplicated local implementations.

## Phenotype Long-Term Stability and Non-Destructive Change Protocol <!-- PHENOTYPE_LONGTERM_STABILITY_PROTOCOL -->

- Optimize for long-term platform value over short-term convenience; choose durable solutions even when implementation complexity is higher.
- Classify proposed changes as `quick_fix` or `stable_solution`; prefer `stable_solution` unless an incident response explicitly requires a temporary fix.
- Do not use deletions/reversions as the default strategy; prefer targeted edits, forward fixes, and incremental hardening.
- Prefer moving obsolete or superseded material into `.archive/` over destructive removal when retention is operationally useful.
- Prefer clean manual merges, explicit conflict resolution, and auditable history over forceful rewrites, force merges, or history-destructive workflows.
- Prefer completing unused stubs into production-quality implementations when they represent intended product direction; avoid leaving stubs ignored indefinitely.
- Do not merge any PR while any check is failing, including non-required checks, unless the user gives explicit exception approval.
- When proposing a quick fix, include a scheduled follow-up path to a stable solution in the same plan.

## Worktree Discipline

- Feature work goes in `.worktrees/<topic>/`
- Legacy `PROJECT-wtrees/` and `repo-wtrees/` roots are for migration only and must not receive new work.
- Canonical repository remains on `main` for final integration and verification.
