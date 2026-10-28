"use client";

import { Code2, Copy, CornerDownLeft, ImageIcon, Link2, Mic, MicOff, MousePointer2, Play, Sparkles, Square, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { insertRecognizedText } from "@/lib/voice/insert";
import { CatCompanion } from "./cat-companion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ProcessVoiceResponse = {
  text?: string;
  replaceAll?: boolean;
  error?: string;
};

const DEMO_SPOKEN =
  "Ты говоришь: в таблицу перчейзес спекс добавить два поля запятая одно булеан запятая а другое инт точка новая строка здесь будет картинка";
const DEMO_RESULT =
  "Я формулирую: В таблицу `purchases_specs` добавить два поля, одно `boolean`, а другое `int`.\n{{ВСТАВИТЬ_СКРИНШОТ}}";
const DRAFT_STORAGE_KEY = "tz-iz-vozduha-draft";
const AI_MODE_STORAGE_KEY = "tz-iz-vozduha-ai-mode";
const AI_MODE_TOOLTIP =
  "Включено: после распознавания и глоссария локальная LLM заново перечитывает всё поле целиком и сразу оформляет его — абзацы, пункты, отступы. Общий смысл всего текста сохраняется. Выключено: вставляется только новый фрагмент в место курсора.";

const VOICE_SIGN_HINTS = [
  { say: "запятая", gets: "," },
  { say: "точка", gets: "." },
  { say: "новая строка", gets: "↵" },
  { say: "двоеточие", gets: ":" },
  { say: "двойная кавычка", gets: '"' },
  { say: "тире", gets: "-" },
  { say: "равно", gets: "=" },
  { say: "больше", gets: ">" },
  { say: "меньше", gets: "<" },
  { say: "больше или равно", gets: ">=" },
  { say: "меньше или равно", gets: "<=" },
] as const;

function Soundwave(): ReactNode {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {[0, 1, 2, 3].map((bar) => (
        <span
          key={bar}
          className="w-0.5 origin-bottom rounded-full bg-current"
          style={{
            height: "100%",
            animation: "wave 0.9s ease-in-out infinite",
            animationDelay: `${bar * 0.12}s`,
          }}
        />
      ))}
    </span>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const aiModeRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const cursorPositionRef = useRef<number>(0);
  const demoTimerRef = useRef<number | null>(null);
  const draftBeforeDemoRef = useRef<string | null>(null);

  const stopDemo = (): void => {
    if (demoTimerRef.current !== null) {
      window.clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
    setIsDemo(false);
    if (draftBeforeDemoRef.current !== null) {
      setText(draftBeforeDemoRef.current);
      draftBeforeDemoRef.current = null;
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      setText(saved);
    }
    setAiMode(window.localStorage.getItem(AI_MODE_STORAGE_KEY) === "1");
    setDraftReady(true);

    return () => {
      if (demoTimerRef.current !== null) {
        window.clearTimeout(demoTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    aiModeRef.current = aiMode;
  }, [aiMode]);

  useEffect(() => {
    if (!draftReady) {
      return;
    }
    window.localStorage.setItem(AI_MODE_STORAGE_KEY, aiMode ? "1" : "0");
  }, [aiMode, draftReady]);

  useEffect(() => {
    if (!draftReady || isDemo) {
      return;
    }
    window.localStorage.setItem(DRAFT_STORAGE_KEY, text);
  }, [text, draftReady, isDemo]);

  const startRecording = async (): Promise<void> => {
    stopDemo();
    if (textareaRef.current) {
      cursorPositionRef.current = textareaRef.current.selectionStart;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : undefined;
      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType, audioBitsPerSecond: 128000 } : undefined,
      );
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent): void => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = (): void => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        void sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      window.alert("Ошибка доступа к микрофону");
    }
  };

  const stopRecording = (): void => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => {
        track.stop();
      });
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob): Promise<void> => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("aiMode", aiModeRef.current ? "1" : "0");
    formData.append("documentText", textareaRef.current?.value ?? "");
    formData.append("cursorPosition", String(cursorPositionRef.current));

    try {
      const response = await fetch("/api/process-voice", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as ProcessVoiceResponse;

      if (data.text) {
        if (data.replaceAll) {
          setText(data.text);
          cursorPositionRef.current = data.text.length;
          window.requestAnimationFrame(() => {
            const field = textareaRef.current;
            if (!field) {
              return;
            }
            field.focus();
            field.setSelectionRange(data.text!.length, data.text!.length);
          });
        } else {
          const position = cursorPositionRef.current;
          const recognizedText = data.text;
          setText((currentText) => {
            const inserted = insertRecognizedText(currentText, position, recognizedText);
            cursorPositionRef.current = inserted.cursor;
            window.requestAnimationFrame(() => {
              const field = textareaRef.current;
              if (!field) {
                return;
              }
              field.focus();
              field.setSelectionRange(inserted.cursor, inserted.cursor);
            });
            return inserted.text;
          });
        }
      } else if (data.error) {
        window.alert(`Ошибка: ${data.error}`);
      }
    } catch {
      window.alert("Не удалось обработать аудио на бэкенде");
    } finally {
      setIsLoading(false);
    }
  };

  const playDemo = (): void => {
    if (isRecording || isLoading) {
      return;
    }
    if (isDemo) {
      stopDemo();
      return;
    }

    draftBeforeDemoRef.current = text;
    setIsDemo(true);

    const typeText = (value: string, onDone: () => void): void => {
      let index = 0;
      const step = (): void => {
        index += 1;
        setText(value.slice(0, index));
        if (index < value.length) {
          demoTimerRef.current = window.setTimeout(step, 24);
          return;
        }
        demoTimerRef.current = null;
        onDone();
      };
      demoTimerRef.current = window.setTimeout(step, 24);
    };

    typeText(`${DEMO_SPOKEN}\n\n\n${DEMO_RESULT}`, () => {
      demoTimerRef.current = null;
    });
  };

  const clearText = (): void => {
    stopDemo();
    setText("");
    cursorPositionRef.current = 0;
    setConfirmClear(false);
  };

  useEffect(() => {
    if (!confirmClear) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setConfirmClear(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [confirmClear]);

  const copyToClipboard = async (): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0B0F] text-zinc-100">
      <div className="pointer-events-none absolute left-1/2 top-16 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15),transparent_68%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-5 py-14">
        <header className="mb-8 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Локальное, своё, родноё</p>
          <h1 className="mt-3 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Поговори мне тут
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Надиктуй фрагмент задания. Удиви разработчика
          </p>
        </header>

        <section
          className={`rounded-2xl border bg-zinc-900/40 p-3 backdrop-blur-md transition-[border-color,box-shadow] duration-500 ${
            aiMode
              ? "ai-frame border-indigo-400/50"
              : "border-zinc-800/80 shadow-[0_30px_80px_-40px_rgba(99,102,241,0.45)]"
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {aiMode ? "Whisper → глоссарий → LLM" : "Whisper → глоссарий"}
            </p>
            <label
              className={`group relative inline-flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border py-1.5 pl-2.5 pr-2 text-xs font-medium leading-none transition has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 ${
                aiMode
                  ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-100 shadow-[0_0_18px_-6px_rgba(129,140,255,0.9)]"
                  : "border-white/10 bg-black/20 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}
            >
              <span
                id="ai-mode-tooltip"
                role="tooltip"
                className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] right-0 z-20 hidden w-72 rounded-xl border border-zinc-700/90 bg-[#121218] px-3 py-2.5 text-left text-[11px] font-normal normal-case leading-5 tracking-normal text-zinc-300 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.85)] group-hover:block group-focus-within:block"
              >
                {AI_MODE_TOOLTIP}
              </span>
              <Sparkles className={`h-3.5 w-3.5 shrink-0 ${aiMode ? "text-indigo-300" : "text-zinc-500"}`} />
              <span className="shrink-0">ИИ</span>
              <Switch
                checked={aiMode}
                onCheckedChange={setAiMode}
                disabled={isLoading || isRecording || isDemo}
                aria-label="Режим ИИ"
                aria-describedby="ai-mode-tooltip"
              />
            </label>
          </div>
          <div className="relative h-72">
            <textarea
              ref={textareaRef}
              value={text}
              spellCheck={false}
              disabled={isLoading || isDemo}
              placeholder="Поставь курсор и надиктуй фрагмент..."
              onChange={(event) => {
                setText(event.target.value);
              }}
              className={`h-full w-full resize-none rounded-xl border px-4 py-4 font-mono text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600 disabled:opacity-70 ${
                aiMode
                  ? "border-indigo-400/25 bg-indigo-950/25 shadow-[inset_0_0_48px_-18px_rgba(99,102,241,0.55)]"
                  : "border-transparent bg-black/30"
              }`}
            />
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
                <p className="text-sm text-zinc-300">
                  {aiMode ? "ИИ оформляет весь текст..." : "Разбираю запись..."}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 pb-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isRecording) {
                    stopRecording();
                    return;
                  }
                  void startRecording();
                }}
                disabled={isLoading || isDemo}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition disabled:opacity-40 ${
                  isRecording ? "bg-red-500 text-white shadow-[0_0_24px_-6px_rgba(239,68,68,0.9)]" : "bg-white text-zinc-950 hover:bg-zinc-200"
                }`}
              >
                {isRecording ? <Soundwave /> : <Mic className="h-4 w-4" />}
                {isRecording ? "Стоп" : "Запись"}
              </button>
              <button
                type="button"
                onClick={playDemo}
                disabled={isRecording || isLoading}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                {isDemo ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isDemo ? "Стоп" : "Пример"}
              </button>
            </div>

            <div className="flex items-center gap-1">
              {text.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmClear(true);
                  }}
                  disabled={isLoading || isRecording}
                  aria-label="Очистить"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  void copyToClipboard();
                }}
                disabled={!text || isLoading}
                className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Скопировано" : "Копировать"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
            <MousePointer2 className="h-4 w-4 text-zinc-400" />
            <h2 className="mt-4 text-sm font-medium text-zinc-100">Сначала курсор</h2>
            <p className="mt-2 text-sm leading-5 text-zinc-500">
              Кликни, куда вставить текст, и включай запись.
              <span className="ml-1 inline-block h-4 w-px translate-y-0.5 bg-zinc-300 [animation:caret-blink_1.1s_steps(1)_infinite]" />
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <ImageIcon className="h-4 w-4 text-indigo-300" />
                <h2 className="mt-4 text-sm font-medium text-zinc-100">Скриншот и ссылка</h2>
                <p className="mt-2 text-sm leading-5 text-zinc-500">
                  Скажи «здесь будет картинка» или «вставить ссылку». В текст попадёт метатег: место, куда потом вставишь скриншот или ссылку.
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-nowrap gap-2">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 font-mono text-[11px] text-indigo-100">
                <ImageIcon className="h-3 w-3" />
                {"{{ВСТАВИТЬ_СКРИНШОТ}}"}
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 font-mono text-[11px] text-indigo-100">
                <Link2 className="h-3 w-3" />
                {"{{ВСТАВИТЬ_ССЫЛКУ}}"}
              </span>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700">
            <Code2 className="h-4 w-4 text-emerald-300" />
            <h2 className="mt-4 text-sm font-medium text-zinc-100">Свой термин</h2>
            <p className="mt-2 text-sm leading-5 text-zinc-500">Называй таблицу целиком, как в справочнике. «перчейзес спекс» запишется точно.</p>
            <pre className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 font-mono text-[11px] leading-5 text-zinc-400">
              <span className="text-zinc-600">table </span>
              <span className="text-emerald-300">purchases_specs</span>
            </pre>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 md:col-span-2">
            <CornerDownLeft className="h-4 w-4 text-zinc-300" />
            <h2 className="mt-4 text-sm font-medium text-zinc-100">Знаки</h2>
            <p className="mt-2 text-sm leading-5 text-zinc-500">
              Назови команду — вставится символ. Числа словами превращаются в цифры: «пункт один» → Пункт 1, «пять» → 5.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {VOICE_SIGN_HINTS.map((hint) => (
                <span
                  key={hint.say}
                  className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                  title={`Скажи «${hint.say}»`}
                >
                  {hint.say} → {hint.gets}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-600">
              Кавычку надёжнее «двойная кавычка», не «кавычка».
            </p>
          </article>

          <article className="rounded-2xl border border-zinc-800/60 bg-zinc-950/70 p-4 text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 md:col-span-2">
            <div className="flex items-center gap-3">
              <MicOff className="h-4 w-4" />
              <div>
                <h2 className="text-sm font-medium text-zinc-300">Тишина</h2>
                <p className="mt-1 text-sm leading-5">Если ничего не сказать, поле само не заполнится. Черновик остаётся даже после обновления страницы.</p>
              </div>
            </div>
          </article>
        </section>
      </div>
      {confirmClear ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"
          onClick={() => {
            setConfirmClear(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-[#121218] p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <h2 id="clear-dialog-title" className="text-base font-medium text-zinc-100">
              Очистить текст?
            </h2>
            <p className="mt-2 text-sm leading-5 text-zinc-400">Черновик пропадёт, вернуть его не получится.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmClear(false);
                }}
                className="inline-flex h-9 items-center rounded-full px-4 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                Оставить
              </button>
              <button
                type="button"
                onClick={clearText}
                className="inline-flex h-9 items-center rounded-full bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-400"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <CatCompanion />
    </main>
  );
}
