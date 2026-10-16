# Вывод на прод (сервер уже на v1)

Личная шпаргалка: обновить код, поднять **Ollama** для режима ИИ, перезапустить сервисы.

Сервер: Ubuntu, проект уже работает (Whisper + MariaDB + Nginx + HTTPS).

---

## 1. Залить код

```bash
ssh user@твой-сервер
cd /path/to/voice_analyzer    # каталог, где уже крутится v1

git pull
# если без git — rsync/scp как обычно
```

---

## 2. Сборка приложения

```bash
npm install
npm run build

# если в репозитории меняли prisma/glossary/
npm run db:seed

# схема БД не менялась — db:push обычно не нужен
```

---

## 3. Ollama (один раз, если ещё не ставил)

Нужен для тумблера **ИИ**. Без этого работает только Whisper → глоссарий.

```bash
npm run ollama:setup
```

- попросит **sudo** (официальный install.sh);
- поднимет `ollama.service` на **127.0.0.1:11434**;
- скачает модель (~1 ГБ): `qwen2.5:1.5b`;
- допишет в `.env`, если нет:

```env
OLLAMA_URL="http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL="qwen2.5:1.5b"
```

Проверка:

```bash
curl -s http://127.0.0.1:11434/api/tags | head
ollama list
```

**Порты наружу не открывать:** 3000, 8080, 11434 — только localhost.

---

## 4. Перезапуск

```bash
npm run server:down
npm run server:up
```

Должно подняться:

| Порт  | Что        |
|-------|------------|
| 3000  | Next.js    |
| 8080  | whisper    |
| 11434 | Ollama     |

Логи:

```bash
tail -f logs/next.log
tail -f logs/whisper.log
# при проблемах с LLM:
sudo journalctl -u ollama -n 50 --no-pager
```

---

## 5. Проверка в браузере

1. `https://твой-домен` (только HTTPS — иначе микрофон).
2. Ctrl+F5.
3. **ИИ выкл.** — запись как на v1.
4. **ИИ вкл.** — после записи оформляется **весь текст** в поле; ошибки про LLM быть не должно.

---

## 6. После перезагрузки сервера

```bash
cd /path/to/voice_analyzer
npm run server:up
```

`ollama.service` обычно стартует сам; `server:up` дёрнет `systemctl start ollama`, если 11434 мёртв.

---

## Если что-то сломалось

| Симптом | Действие |
|--------|----------|
| Старая страница без тумблера | `npm run build`, `server:down/up`, Ctrl+F5 |
| «LLM недоступна» | `curl 127.0.0.1:11434/api/tags`, `npm run ollama:setup`, `sudo systemctl status ollama` |
| Нет текста с микрофона | `tail logs/whisper.log`, порт 8080 |
| 500 / база | `tail logs/next.log`, `.env` → `DATABASE_URL`, `sudo systemctl status mariadb` |
| Очень долго с ИИ | CPU + whisper medium + LLM; норма на слабом сервере — ждать или не включать ИИ |

---

## Минимальный чеклист одной строкой

```bash
git pull && npm install && npm run build && npm run ollama:setup && npm run server:down && npm run server:up
```

(`ollama:setup` — только первый раз с ИИ; дальше без него.)

---

## Локально (для себя)

Два терминала:

```bash
npm run whisper
npm run dev
```

Ollama на WSL/Windows должна слушать `127.0.0.1:11434`, модель: `ollama pull qwen2.5:1.5b`.
