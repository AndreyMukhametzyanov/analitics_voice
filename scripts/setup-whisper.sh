#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS="$ROOT/.tools"
WHISPER="$ROOT/whisper.cpp"
CMAKE_VERSION="3.31.8"

if command -v cmake >/dev/null 2>&1; then
  CMAKE="$(command -v cmake)"
else
  CMAKE="$TOOLS/cmake-${CMAKE_VERSION}-linux-x86_64/bin/cmake"
  if [[ ! -x "$CMAKE" ]]; then
    mkdir -p "$TOOLS"
    archive="$TOOLS/cmake.tar.gz"
    echo "Скачиваю portable CMake ${CMAKE_VERSION} (в системе нет cmake, sudo недоступен)..."
    curl -fL "https://github.com/Kitware/CMake/releases/download/v${CMAKE_VERSION}/cmake-${CMAKE_VERSION}-linux-x86_64.tar.gz" -o "$archive"
    tar -xzf "$archive" -C "$TOOLS"
    rm -f "$archive"
  fi
fi

if [[ ! -d "$WHISPER/.git" ]]; then
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git "$WHISPER"
fi

echo "Собираю whisper-server..."
"$CMAKE" -S "$WHISPER" -B "$WHISPER/build" -DCMAKE_BUILD_TYPE=Release
"$CMAKE" --build "$WHISPER/build" -j "$(nproc)" --target whisper-server

if [[ ! -f "$WHISPER/models/ggml-medium.bin" ]]; then
  echo "Скачиваю модель medium (около 1.5 ГБ)..."
  (cd "$WHISPER" && bash ./models/download-ggml-model.sh medium)
fi

echo "Готово: $WHISPER/build/bin/whisper-server"
