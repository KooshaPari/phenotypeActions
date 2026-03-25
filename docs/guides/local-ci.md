# Local CI with act

Run GitHub Actions workflows locally using [nektos/act](https://github.com/nektos/act).

## Prerequisites

- Docker Desktop (or compatible runtime like colima/orbstack) must be running
- Homebrew (macOS)

## Installation

```bash
brew install act
act --version
```

## Configuration (.actrc)

Place a `.actrc` file in your repository root to set default flags:

```
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
```

- `-P ubuntu-latest=...` maps the GitHub runner label to a local Docker image
- `--container-architecture linux/amd64` is required on Apple Silicon Macs

A reusable template is available at `phenotypeActions/.actrc.template`. Copy it into any repo:

```bash
cp /path/to/phenotypeActions/.actrc.template /path/to/your-repo/.actrc
```

## Running Workflows Locally

### Dry run (no Docker required)

```bash
act push -W .github/workflows/lint-test.yml --dryrun
```

### Full run

```bash
# Run all workflows triggered by push
act push

# Run a specific workflow
act push -W .github/workflows/lint-test.yml

# Run a specific job
act push -j lint-test

# Pass secrets
act push -s GITHUB_TOKEN="$(gh auth token)"

# Pass environment variables
act push --env MY_VAR=value
```

### List available jobs

```bash
act --list
act --list -W .github/workflows/lint-test.yml
```

## Comparison: Local CI Script vs act vs GitHub Actions

| Aspect | Local CI script | act | GitHub Actions |
|--------|----------------|-----|----------------|
| **Environment** | Native host | Docker container (mirrors GHA) | GitHub-hosted runner |
| **Fidelity** | Low -- no runner context, no matrix, no services | Medium -- most actions work, some GHA features missing | Full -- canonical execution |
| **Speed** | Fastest (no container overhead) | Medium (container startup + pull) | Slowest (queue + provisioning) |
| **Docker required** | No | Yes | No (cloud) |
| **Secrets/tokens** | Manual env vars | `-s` flag or `.secrets` file | Repository/org secrets |
| **Reusable workflows** | Not supported | Partial support | Full support |
| **Services (postgres, redis)** | Must run natively | Docker compose via `services:` | Native `services:` support |
| **Cost** | Free | Free | Free tier limits, then paid |
| **Offline** | Yes | Yes (after image pull) | No |

## When to Use Which

**Local CI script** (`go build && go test && golangci-lint run`):
- Quick feedback during development
- No Docker available or desired
- Simple lint/test/build checks

**act**:
- Validating workflow YAML syntax and job structure before pushing
- Debugging action step failures locally
- Testing matrix builds or conditional logic
- Reproducing CI failures without push-wait-check cycles

**GitHub Actions (remote)**:
- Final source of truth for CI status
- PR checks and branch protection
- Workflows that need GitHub context (deployments, releases, permissions)
- Workflows using GitHub-hosted services or large runners
