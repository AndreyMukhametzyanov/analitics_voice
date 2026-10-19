#!/usr/bin/env bash
# Один раз на Ubuntu-сервере: пакеты, база, сборка whisper, production-сборка.
# Запускать от обычного пользователя из любой папки. sudo спросит пароль сам.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "${EUID}" -eq 0 ]]; then
  echo "Запусти без sudo, от пользователя, под которым будет жить приложение." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Нужен Node.js 20 или новее. В репозиториях Ubuntu его часто нет." >&2
  echo "Поставь Node 22 и повтори скрипт: https://nodejs.org/" >&2
  exit 1
fi

node_major="$(node -p "process.versions.node.split('.')[0]")"
if [[ "${node_major}" -lt 20 ]]; then
  echo "Сейчас Node $(node -v). Нужен 20 или новее." >&2
  exit 1
fi

sudo apt-get update
sudo apt-get install -y build-essential git curl ffmpeg mariadb-server openssl
sudo systemctl enable --now mariadb

if [[ ! -f .env ]]; then
  password="$(openssl rand -hex 16)"
  cat > .env <<EOF
DATABASE_URL="mysql://air_user:${password}@localhost:3306/tz_iz_vozduha_db"
WHISPER_URL="http://127.0.0.1:8080/inference"
EOF
  grep -E '^LLM_' .env.example >> .env || true
  chmod 600 .env
fi

db_password="$(
  node -e '
    const fs = require("fs");
    const line = fs.readFileSync(".env", "utf8").split("\n").find((row) => row.startsWith("DATABASE_URL="));
    const raw = line.slice("DATABASE_URL=".length).trim().replace(/^"|"$/g, "");
    process.stdout.write(new URL(raw).password);
  '
)"
db_password="${db_password//\'/\'\'}"

sudo mysql <<SQL
CREATE DATABASE IF NOT EXISTS tz_iz_vozduha_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'air_user'@'localhost' IDENTIFIED BY '${db_password}';
ALTER USER 'air_user'@'localhost' IDENTIFIED BY '${db_password}';
GRANT ALL PRIVILEGES ON tz_iz_vozduha_db.* TO 'air_user'@'localhost';
FLUSH PRIVILEGES;
SQL

npm install
npm run db:push
npm run db:seed
npm run whisper:setup
npm run build

echo
echo "Сборка готова. Дальше на сервере: npm run server:up"
echo "Nginx должен проксировать https://<домен> на http://127.0.0.1:5090"
echo "Пример конфига: deploy/nginx.conf.example"
