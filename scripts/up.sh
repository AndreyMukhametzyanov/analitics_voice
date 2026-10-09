#!/usr/bin/env bash
# Поднимает whisper и страницу в фоне. Оба слушают только 127.0.0.1.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
mkdir -p logs

listening() {
  ss -ltn | grep -q ":$1 "
}

if listening 8080; then
  echo "Распознавание уже слушает 127.0.0.1:8080"
else
  nohup bash scripts/start-whisper.sh > logs/whisper.log 2>&1 &
  echo $! > logs/whisper.pid
  echo "Распознавание запущено, лог: logs/whisper.log"
fi

if listening 3000; then
  echo "Страница уже слушает 127.0.0.1:3000"
else
  if [[ ! -d .next ]]; then
    echo "Нет сборки. Сначала: npm run server:setup" >&2
    exit 1
  fi
  nohup ./node_modules/.bin/next start -H 127.0.0.1 -p 3000 > logs/next.log 2>&1 &
  echo $! > logs/next.pid
  echo "Страница запущена, лог: logs/next.log"
fi

echo "Страница доступна Nginx на http://127.0.0.1:3000"
echo "Аналитики открывают https://<домен>"
echo "Остановить: npm run server:down"
