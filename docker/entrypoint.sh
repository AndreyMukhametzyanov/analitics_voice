#!/usr/bin/env bash
set -euo pipefail

if [[ "${RUN_DB_SETUP:-}" == "1" ]]; then
  echo "RUN_DB_SETUP=1: prisma db push и сид глоссария"
  npx prisma db push
  node prisma/seed.cjs
fi

export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-3000}"

exec node server.js
