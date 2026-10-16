#!/usr/bin/env bash
# Поднимает Ollama, если порт 11434 мёртв (обычно через systemd).
set -euo pipefail

if ss -ltn | grep -q ':11434 '; then
  exit 0
fi

if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files ollama.service >/dev/null 2>&1; then
  sudo systemctl start ollama
  exit 0
fi

if command -v ollama >/dev/null 2>&1; then
  exec ollama serve
fi

echo "Ollama не установлена. Выполни: npm run ollama:setup" >&2
exit 1
