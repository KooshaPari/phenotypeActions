#!/usr/bin/env bash
# ci-local-go.sh -- Reusable local CI for Go projects.
# Copy to your repo's scripts/ and adjust GO_DIRS if needed.
set -euo pipefail

GO_DIRS=("./...")  # Override: GO_DIRS=("./..." "./subdir/...")

passed=0
failed=0
results=()

run_step() {
  local name="$1"; shift
  printf "\n==> %s\n" "$name"
  if "$@"; then
    results+=("PASS  $name")
    ((passed++))
  else
    results+=("FAIL  $name")
    ((failed++))
    return 1
  fi
}

for dir in "${GO_DIRS[@]}"; do
  run_step "go vet $dir" go vet "$dir" || exit 1
  run_step "go build $dir" go build "$dir" || exit 1
  run_step "go test $dir" go test "$dir" || exit 1
done

# gofmt check (repo-wide)
run_step "gofmt -l ." bash -c '
  bad=$(gofmt -l .)
  if [ -n "$bad" ]; then
    echo "Files need formatting:"
    echo "$bad"
    exit 1
  fi
' || exit 1

printf "\n========== CI Summary ==========\n"
for r in "${results[@]}"; do echo "  $r"; done
printf "Passed: %d  Failed: %d\n" "$passed" "$failed"
[ "$failed" -eq 0 ] && echo "ALL CHECKS PASSED" || { echo "SOME CHECKS FAILED"; exit 1; }
