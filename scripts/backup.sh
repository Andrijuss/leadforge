#!/usr/bin/env bash
# Backup su GitHub (repo: git@github.com:Andrijuss/leadforge.git), configurato da github.app password.
set -euo pipefail

cd "$(dirname "$0")/.."

REPO="git@github.com:Andrijuss/leadforge.git"

# Exports for SSH-known-hosts / correct config if needed
export GIT_SSH_COMMAND=${GIT_SSH_COMMAND:-"ssh -o StrictHostKeyChecking=accept-new"}

if ! git remote | grep -q "github"; then
  git remote add github "$REPO" || git remote set-url github "$REPO"
fi

# Commit push automatico dei dati non-secret del progetto (i .env e i file con secrets sono in .gitignore)
git init -q
git add -A
if git diff --cached --quiet; then
  echo "Nessuna modifica da committare."
  exit 0
fi
git commit -q -m "leadforge: backup automatico $(date -u +%Y-%m-%dT%H:%M:%SZ) [data-agentes]  --no-verify"
git push -u github main 2>/dev/null || git push github main
echo "Backup completato: push su ${REPO} (main)"