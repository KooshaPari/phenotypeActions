# Workflow Migration Audit

Date: 2026-02-28

## Objective
Identify reusable GitHub Actions/workflows across Phenotype repos that should move into `phenotypeActions`.

## High-Priority Candidates (move first)
1. `policy-gate.yml`
- Seen in: `heliosCLI`, `heliosApp`, `4sgm`, `civ`, `parpour`, `phenodocs`, `phenotype-config`, `portage`, `thegent`, `tokenledger`, `trash-cli`, `cliproxyapi++`, `cliproxyapi-plusplus`
- Why move: broad duplication and governance-critical behavior.

2. `coderabbit-rate-limit-retry.yml` / bot retry logic
- Seen in: `thegent`, `agentapi-plusplus`, `cliproxyapi++`, `cliproxyapi-plusplus`
- Why move: current burst failures/rate-limits are cross-repo systemic.

3. `stage-gates.yml`
- Seen in: `heliosCLI`, `heliosApp`, `portage`
- Why move: branching-stage policy should be a shared contract.

## Medium-Priority Candidates
1. Docs site deploy workflows (`docs-site.yml`, `vitepress-pages.yml`, `pages.yml`)
- Seen in multiple repos (`4sgm`, `civ`, `parpour`, `trace`, `cliproxyapi++`, `cliproxyapi-plusplus`).

2. Security/quality baselines (`codeql.yml`, `quality.yml`, `codespell.yml`, `cargo-deny.yml`)
- Common baseline opportunities with per-repo overrides.

3. Release skeletons (`release.yml`, `release-batch.yaml`, `build-release.yml`)
- Reusable shells with repo-specific publish targets.

## Low-Priority / Keep Local
1. Product-specific CI jobs
- `shell-tool-mcp*.yml`, app-specific build/test matrices.

2. Deep domain pipelines
- `trace` chaos/perf/deployment-rollback chains.

## Proposed Migration Waves
- Wave A: `policy-gate` + `review-wave-orchestrator` (this project scaffold)
- Wave B: `coderabbit-rate-limit-retry` + `stage-gates` shared modules
- Wave C: docs/site deployment templates
- Wave D: release and language baseline packs

## Adoption Pattern
Consumer repos should replace duplicated workflows with `uses:` calls to reusable workflows in `phenotypeActions` and keep only thin wrappers for repo-specific inputs/secrets.

## Repo Audit Snapshot

### Move to `phenotypeActions` First
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/policy-gate.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/pr-babysit-watch.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/close-stale-contributor-prs.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/codespell.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosApp/.github/workflows/policy-gate.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosApp/.github/workflows/required-check-names-guard.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/required-check-names-guard.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/auto-merge.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/ci-rerun-flaky.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/coderabbit-rate-limit-retry.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/policy-gate.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/coderabbit-rate-limit-retry.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/trash-cli/.github/workflows/policy-gate.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/policy-gate.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/civ/.github/workflows/policy-gate.yml`

### Maybe Shared with Inputs
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/stage-gates.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/ci.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/cla.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/issue-labeler.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/issue-deduplicator.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosApp/.github/workflows/stage-gates.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosApp/.github/workflows/ci.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosApp/.github/workflows/vitepress-pages.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/pr-test-build.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/codeql.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/docs.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/vitepress-pages.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/build.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/docs.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/claude.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/claude-code-review.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/pytest.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/ruff-format.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/stage-gates.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/ty.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/civ/.github/workflows/codeql.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/civ/.github/workflows/docs-site.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/civ/.github/workflows/pages.yml`

### Keep Local
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/bazel.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/rust-ci.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/cargo-deny.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/sdk.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/shell-tool-mcp-ci.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/shell-tool-mcp.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/rust-release-prepare.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/rust-release.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosCLI/.github/workflows/rust-release-windows.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/heliosApp/.github/workflows/agent-dir-guard.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/pr-path-guard.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/docker-image.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/release.yaml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/release-batch.yaml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/cliproxyapi-plusplus/.github/workflows/generate-sdks.yaml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/benchmark.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/ci.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/ci-minimal.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/hooks-ci.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/release.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/subpackages.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/thegent/.github/workflows/test.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/trash-cli/.github/workflows/make-release.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/trash-cli/.github/workflows/run-tests.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/portage/.github/workflows/sync-registry.yml`
- `/Users/kooshapari/CodeProjects/Phenotype/repos/civ/.github/workflows/quality.yml`
