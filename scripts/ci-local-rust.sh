#!/usr/bin/env bash
# ci-local-rust.sh -- Reusable local CI for Rust projects.
# Copy to your repo's scripts/ and adjust as needed.
set -euo pipefail

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

run_step "cargo fmt --check" cargo fmt --check || exit 1
run_step "cargo clippy --workspace -- -D warnings" cargo clippy --workspace -- -D warnings || exit 1
run_step "cargo test --workspace" cargo test --workspace || exit 1

printf "\n========== CI Summary ==========\n"
for r in "${results[@]}"; do echo "  $r"; done
printf "Passed: %d  Failed: %d\n" "$passed" "$failed"
[ "$failed" -eq 0 ] && echo "ALL CHECKS PASSED" || { echo "SOME CHECKS FAILED"; exit 1; }
