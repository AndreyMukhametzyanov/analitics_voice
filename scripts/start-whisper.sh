#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="$ROOT/whisper.cpp/build/bin/whisper-server"
MODEL="$ROOT/whisper.cpp/models/ggml-medium.bin"

if [[ ! -x "$BIN" || ! -f "$MODEL" ]]; then
  echo "Сервер ещё не собран. Сначала выполни: npm run whisper:setup" >&2
  exit 1
fi

exec "$BIN" \
  -m "$MODEL" \
  -t 8 \
  --host 127.0.0.1 \
  --port 8080 \
  --language ru
