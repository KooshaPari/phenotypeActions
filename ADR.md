# Architecture Decision Records - phenotypeActions

## ADR-001: Composite Actions vs Reusable Workflows
**Status**: Accepted
**Context**: GitHub Actions supports two reuse patterns.
**Decision**: Use composite actions for step-level reuse and reusable workflows for job-level reuse.
**Consequences**: Composite actions share steps within a job; workflows define complete jobs with own runners.

## ADR-002: Floating Major Tags for Versioning
**Status**: Accepted
**Context**: Consumers need stable references that receive patches automatically.
**Decision**: Use floating major tags (`v0`, `v1`) moved on each release; exact tags for audit trails.
**Consequences**: Consumers get patches without updating refs; breaking changes require new major tag.

## ADR-003: Shell Scripts for Complex Logic
**Status**: Accepted
**Context**: Inline YAML steps become unreadable for complex logic.
**Decision**: Extract complex logic to `.github/scripts/*.sh`; composite actions invoke them.
**Consequences**: Scripts are testable with shellcheck; actions stay declarative.
