# PRD - phenotypeActions

## E1: Reusable CI/CD Actions

### E1.1: Review Wave Orchestration
As a repo maintainer, I invoke a reusable workflow that orchestrates multi-wave code review bot execution (CodeRabbit, Gemini, Augment, Codex) across PRs.

**Acceptance**: Configurable bot waves; sequential wave execution; status check reporting.

### E1.2: Policy Gate
As a CI pipeline, I enforce policy compliance checks on PRs before merge.

**Acceptance**: Blocks merge on policy violations; configurable severity thresholds.

### E1.3: Security Guard
As a security engineer, I run automated security scanning workflows on PRs and commits.

**Acceptance**: Shell-based security checks; hook audit workflow; pre-commit hooks.

### E1.4: Template Sync
As an org admin, I synchronize workflow templates and configs across all Phenotype repos.

**Acceptance**: Composite action for template distribution; drift detection.

## E2: Action Packaging and Validation

### E2.1: Validate Packaging
CI validates that all composite actions and reusable workflows have correct metadata, inputs, outputs, and descriptions.

**Acceptance**: `validate-packaging.yml` catches malformed action.yml files.
