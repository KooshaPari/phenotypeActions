#!/usr/bin/env bash
set -euo pipefail
case "${1:-verify}" in
verify)
    echo "quality-gate: verify passed (stub)"
    exit 0
    ;;
*)
    echo "quality-gate: unknown command: $1" >&2
    exit 1
    ;;
esac
