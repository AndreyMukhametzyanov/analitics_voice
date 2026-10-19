#!/usr/bin/env bash
# Поднимает whisper и страницу в фоне. Слушают только 127.0.0.1. ИИ — из .env (LLM_*).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
mkdir -p logs

WHISPER_PORT=8080
NEXT_PORT=5090

listening() {
  ss -ltn | grep -q ":$1 "
}

running_pid() {
  local file="$1"
  [[ -f "$file" ]] && kill -0 "$(cat "$file")" 2>/dev/null
}

# --- Whisper ---
if running_pid logs/whisper.pid; then
  echo "Распознавание уже запущено (pid $(cat logs/whisper.pid))"
elif listening "$WHISPER_PORT"; then
  echo "Порт $WHISPER_PORT уже слушает кто-то (возможно, whisper) — пропускаю"
else
  nohup bash scripts/start-whisper.sh > logs/whisper.log 2>&1 &
  echo $! > logs/whisper.pid
  echo "Распознавание запущено, лог: logs/whisper.log"
fi

# --- Next.js ---
if running_pid logs/next.pid; then
  echo "Страница уже запущена (pid $(cat logs/next.pid))"
else
  if [[ ! -d .next ]]; then
    echo "Нет сборки. Сначала: npm run server:setup" >&2
    exit 1
  fi
  if listening "$NEXT_PORT"; then
    echo "Порт $NEXT_PORT занят чужим процессом:" >&2
    ss -ltnp | grep ":$NEXT_PORT " >&2
    echo "Освободи порт или поменяй NEXT_PORT в этом скрипте и в Nginx." >&2
    exit 1
  fi
  nohup ./node_modules/.bin/next start -H 127.0.0.1 -p "$NEXT_PORT" > logs/next.log 2>&1 &
  echo $! > logs/next.pid
  echo "Страница запущена на 127.0.0.1:$NEXT_PORT, лог: logs/next.log"
fi

echo "Nginx должен проксировать https://<домен> на http://127.0.0.1:$NEXT_PORT"
echo "Остановить: npm run server:down"