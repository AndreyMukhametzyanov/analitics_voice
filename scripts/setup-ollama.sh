#!/usr/bin/env bash
# Один раз на сервере: Ollama + модель для режима ИИ (localhost:11434).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "${EUID}" -eq 0 ]]; then
  echo "Запусти без sudo — скрипт сам попросит пароль для установки." >&2
  exit 1
fi

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source <(grep -E '^(OLLAMA_MODEL|OLLAMA_URL)=' .env | sed 's/^/export /')
  set +a
fi

MODEL="${OLLAMA_MODEL:-qwen2.5:7b}"

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ставлю Ollama (нужен sudo)..."
  curl -fsSL https://ollama.com/install.sh | sh
fi

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl enable ollama 2>/dev/null || true
  sudo systemctl start ollama
fi

echo "Жду API Ollama на 127.0.0.1:11434..."
for _ in $(seq 1 30); do
  if curl -sf http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -sf http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama не отвечает. Проверь: sudo systemctl status ollama" >&2
  exit 1
fi

echo "Скачиваю модель ${MODEL} (может занять несколько минут)..."
ollama pull "${MODEL}"

if ! grep -q '^OLLAMA_URL=' .env 2>/dev/null; then
  {
    echo 'OLLAMA_URL="http://127.0.0.1:11434/api/generate"'
    echo "OLLAMA_MODEL=\"${MODEL}\""
  } >> .env
  echo "Добавил OLLAMA_* в .env"
fi

echo "Готово. Модель ${MODEL} на 127.0.0.1:11434"
