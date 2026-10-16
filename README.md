# Поговори мне тут

Локальная страница, которая превращает голос в текст технического задания. Речь распознаётся на своём компьютере, без внешних API. Термины из глоссария подставляются в текст, а фразы вроде «здесь будет картинка» становятся меткой `{{ВСТАВИТЬ_СКРИНШОТ}}`.

Проверено в Ubuntu и в WSL.

## Что делает

- Пишет голос с микрофона и вставляет текст в позицию курсора.
- Распознаёт русскую речь моделью Whisper `medium` через [whisper.cpp](https://github.com/ggml-org/whisper.cpp).
- Берёт замены из MariaDB: услышал синоним — записал `keyword`.
- Обычный термин оформляет как `` `boolean` ``. Метку `{{...}}` оставляет как есть.

## Стек

- Next.js, React, TypeScript
- Tailwind CSS
- Prisma и MariaDB
- whisper.cpp, модель `ggml-medium.bin`
- ffmpeg

## Чего нет в репозитории

Эти файлы собираются или создаются на машине и в git не коммитятся:

| Путь | Зачем |
| --- | --- |
| `.env` | строка подключения к базе |
| `node_modules/`, `.next/` | зависимости и сборка Next.js |
| `whisper.cpp/` | исходники, бинарник сервера и модель около 1.5 ГБ |
| `.tools/` | переносной CMake, если в системе его не было |

## Требования

- Node.js 20 или новее и npm
- MariaDB
- `git`, `curl`, `ffmpeg`, компилятор C++ (`build-essential`)
- около 2 ГБ свободного места под whisper.cpp и модель
- браузер, которому можно разрешить микрофон

CMake ставится отдельно только если он уже есть. Иначе `npm run whisper:setup` скачает свою копию.

## Установка

```bash
git clone <адрес-репозитория>
cd voice_analyzer
```

Системные пакеты в Ubuntu:

```bash
sudo apt update
sudo apt install -y build-essential git curl ffmpeg mariadb-server
sudo service mariadb start
```

Зависимости Node:

```bash
npm install
cp .env.example .env
```

В `.env` подставь своего пользователя и пароль MariaDB.

База:

```sql
CREATE DATABASE tz_iz_vozduha_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'air_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tz_iz_vozduha_db.* TO 'air_user'@'localhost';
FLUSH PRIVILEGES;
```

Имена в SQL и в `DATABASE_URL` должны совпадать. Пример строки есть в `.env.example`.

Схема и стартовые строки глоссария:

```bash
npm run db:push
npm run db:seed
```

Сервер распознавания. Клонирует whisper.cpp, собирает `whisper-server` и скачивает модель `medium`. Занимает несколько минут.

```bash
npm run whisper:setup
```

## Запуск

Два терминала, оба остаются открытыми.

```bash
npm run whisper
```

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

Поставь курсор в текст, нажми «Начать запись голоса», скажи фразу и останови запись. Фрагмент вставится в это место. «Скопировать всё» копирует поле целиком.

Первый ответ после старта дольше следующих: модель загружается в память. Сервер считает на CPU.

`WHISPER_URL` в `.env` можно не менять. По умолчанию приложение ходит на `http://127.0.0.1:8080/inference`.

## На сервере

Зайди на сервер и склонируй репозиторий. Дальше команды из каталога проекта, от обычного пользователя. `sudo` скрипт спросит сам.

**1. Проверь Node.js.** Нужна версия 20 или новее.

```bash
node -v
```

Если команды нет или версия меньше 20, сначала поставь Node.js.

**2. Один раз собери всё.**

```bash
npm run server:setup
```

Скрипт поставит `ffmpeg` и MariaDB, создаст базу, запишет пароль в `.env`, скачает распознавание речи и соберёт страницу. Это занимает несколько минут.

**3. Запусти приложение.**

```bash
npm run server:up
```

Страница слушает `127.0.0.1:3000`. Снаружи этот порт не открывается, его видит только Nginx на этом же сервере.

**4. Подключи домен в Nginx.** В `deploy/nginx.conf.example` замени `voice.example.com` на свой домен. Это образец настройки, сам по себе он ничего не запускает.

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/voice
sudo ln -s /etc/nginx/sites-available/voice /etc/nginx/sites-enabled/voice
sudo certbot --nginx -d твой-домен
sudo nginx -t && sudo systemctl reload nginx
```

`certbot` нужен, только если для домена ещё нет HTTPS-сертификата. Без HTTPS браузер не включит микрофон. Если домен уже обслуживает другой сайт, новый файл не копируй: в существующий блок `listen 443 ssl` добавь только `location /` из примера.

**5. Открой сайт.** Аналитики заходят на `https://твой-домен`. Порты 3000 и 8080 в firewall не открывай.

После перезагрузки сервера снова `npm run server:up`. Повторный `server:setup` не нужен. Остановить приложение: `npm run server:down`.

### Обновление с v1 (сайт уже работает)

Из каталога проекта на сервере:

```bash
git pull
npm install
npm run build
npm run db:seed    # если в репозитории меняли prisma/glossary/
npm run server:down
npm run server:up
```

Схема БД не менялась — `db:push` обычно не нужен. Whisper заново собирать не нужно.

### Режим ИИ (Ollama)

Без Ollama работает только цепочка Whisper → глоссарий. Тумблер «ИИ» ходит на `127.0.0.1:11434`.

**Один раз на сервере** (нужен sudo, ~1 ГБ под `qwen2.5:1.5b`, лучше 8+ ГБ RAM на whisper + LLM):

```bash
npm run ollama:setup
```

Скрипт ставит Ollama, включает сервис, скачивает модель из `OLLAMA_MODEL` в `.env` (по умолчанию `qwen2.5:1.5b`).

В `.env` должны быть строки (скрипт допишет, если их нет):

```env
OLLAMA_URL="http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL="qwen2.5:1.5b"
```

Проверка:

```bash
curl -s http://127.0.0.1:11434/api/tags | head
npm run server:up
```

Порт **11434** наружу не открывай — только localhost, как 3000 и 8080.

`npm run server:down` не останавливает системный `ollama.service` (чтобы LLM не падала между перезапусками Next). Останавливается только процесс, если Ollama поднимали через `ollama serve` вручную.

## Глоссарий

Таблица `GlossaryItem`. Стартовые строки лежат в `prisma/glossary/` (`voice.ts` — знаки и типы, `abbreviations.ts` — СПГЗ и т.п., `tables-*.ts` — имена таблиц), собираются в `npm run db:seed`. Числа словами обрабатывает код в `lib/voice/spoken-numbers.ts`, в базу их не заносят.

Новая замена — новая строка в базе (или в сиде), код для этого не нужен.

| Колонка | Смысл |
| --- | --- |
| `keyword` | что записать в текст |
| `aliases` | как это могут произнести, через запятую |
| `description` | заметка, в текст не попадает |

`keyword` вида `{{ВСТАВИТЬ_СКРИНШОТ}}` вставляется буквально. Любой другой `keyword` попадает в текст в обратных кавычках.

```sql
INSERT INTO GlossaryItem (keyword, aliases, description)
VALUES ('Purchase', 'purchase, перчейз', 'Таблица закупок');
```

Синоним сравнивается с фразой целиком. «таблицу закупок» и «таблица закупок» — разные варианты: в `aliases` пишут тот, который реально произносят.

`npm run db:seed` добавляет отсутствующие `keyword` и подтягивает `description` и `aliases` из сида (свои правки в базе при повторном сиде перезапишутся).

В сиде уже есть типы `boolean`, `int`, `integer`, `varchar`, метки скриншота и ссылки, и пример `user_orders_mapping`. Слова-паразиты (`ну`, `короче`, `типа`, `в общем`) убираются в коде.

## Скрипты

| Команда | Действие |
| --- | --- |
| `npm run dev` | страница на порту 3000 |
| `npm run whisper:setup` | собрать whisper.cpp и скачать модель |
| `npm run whisper` | поднять распознавание на порту 8080 |
| `npm run db:push` | создать таблицы по `prisma/schema.prisma` |
| `npm run db:seed` | дописать стартовый глоссарий |
| `npm run build` / `npm run start` | production-сборка Next.js |
| `npm run server:setup` | один раз подготовить Ubuntu-сервер |
| `npm run server:up` / `npm run server:down` | запустить или остановить страницу и распознавание в фоне |

На сервере распознавание поднимает `npm run server:up`. Отдельный `npm run whisper` нужен только при локальном запуске в двух терминалах.

## Если не стартует

**Текста нет, хотя кнопка нажалась.** В записи не нашлось звука, либо браузер не дал микрофон.

**`npm run whisper` завершается сразу.** Сначала выполни `npm run whisper:setup`. Порт 8080 должен быть свободен.

**В интерфейсе ошибка ffmpeg.** Пакет `ffmpeg` не установлен или не виден в `PATH`.

**Ошибка базы.** MariaDB запущена, база создана, `DATABASE_URL` совпадает с пользователем. После правки `.env` снова `npm run db:push`.

**Долго ждёт после короткой фразы.** Модель `medium` на CPU часто считает дольше, чем длилась запись.
