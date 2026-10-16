#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

stop_pid() {
  local file="$1"
  local name="$2"
  if [[ -f "$file" ]]; then
    local pid
    pid="$(cat "$file")"
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid"
      echo "Остановлен ${name} (${pid})"
    fi
    rm -f "$file"
  fi
}

stop_pid logs/next.pid "страница"
stop_pid logs/whisper.pid "распознавание"
stop_pid logs/ollama.pid "ollama (локальный serve)"
