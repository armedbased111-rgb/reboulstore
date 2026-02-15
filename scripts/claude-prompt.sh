#!/usr/bin/env bash
# Lance une requête one-shot vers Claude Code (exit après réponse).
# Usage : ./scripts/claude-prompt.sh "Run ./rcli docs sync"
# Pour une session interactive : lancer `claude` directement.

if [ $# -eq 0 ]; then
  echo "Usage: $0 \"<prompt>\""
  echo "Ex: $0 \"Run ./rcli docs sync and tell me the result\""
  exit 1
fi

exec claude -p "$*"
