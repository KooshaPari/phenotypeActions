# phenotypeActions

Shared GitHub Actions and reusable workflows for Phenotype repositories.

## Goals
- Centralize duplicated workflow logic across repos.
- Standardize review orchestration, policy gates, and bot retry behavior.
- Reduce copy/paste drift in `.github/workflows/*` files.

## Initial Contents
- Reusable workflow: `.github/workflows/review-wave-orchestrator.yml`
- Composite action: `actions/review-orchestrator/action.yml`
- Migration audit: `docs/workflow-migration-audit.md`

## Consumption Pattern
In a product repo workflow:

```yaml
jobs:
  review-waves:
    uses: KooshaPari/phenotypeActions/.github/workflows/review-wave-orchestrator.yml@v0
    with:
      wave1_bots: "coderabbitai,gemini-code-assist"
      wave2_bots: "augment,codex"
```

Pin to a release tag (for example `@v0`) or a full commit SHA in production repos.
