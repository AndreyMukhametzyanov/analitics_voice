const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5:1.5b';
const LLM_DOCUMENT_MAX_CHARS = Number(process.env.LLM_DOCUMENT_MAX_CHARS ?? 12_000);

const DOCUMENT_SYSTEM_PROMPT = `Ты ведущий аналитик и IT-архитектор в IT-компании.
Тебе прислали черновик технического задания. Синонимы уже заменены на канонические термины, метки и знаки уже на месте.

Твоя задача — только финальная чистка и оформление всего документа:
- выстрой связный текст: абзацы, нумерованные или маркированные пункты, отступы — где это помогает читать ТЗ
- убери остатки речевого мусора, повторы и оговорки, если они остались
- слегка поправь грамматику, не меняя смысл
- термины в \`обратных кавычках\`, метки {{ВСТАВИТЬ_...}} и технические имена не переименовывай и не удаляй
- не добавляй новых требований, таблиц, полей, SQL и кода
- не пиши пояснений, заголовков вроде «ТЗ», markdown-ограждений \`\`\`

Верни весь документ целиком, только готовый текст.`;

type OllamaGenerateResponse = {
  response?: string;
  error?: string;
};

function unwrapLlmText(value: string): string {
  let text = value.trim();
  const fenced = text.match(/^```(?:[\w-]+)?\r?\n([\s\S]*?)\r?\n```$/);
  if (fenced?.[1]) {
    text = fenced[1].trim();
  }
  return text.replace(/^["«]+|["»]+$/g, '').trim();
}

function llmErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === 'TimeoutError') {
    return 'Локальная LLM не ответила вовремя';
  }
  if (error instanceof Error && /fetch|ECONNREFUSED|network/i.test(error.message)) {
    return 'Локальная LLM недоступна. Запусти Ollama.';
  }
  return error instanceof Error ? error.message : 'Локальная LLM вернула ошибку';
}

function estimateNumPredict(textLength: number): number {
  return Math.min(4096, Math.max(512, Math.ceil(textLength * 1.4) + 256));
}

/** Финальное оформление черновика ТЗ после глоссария и фильтров. */
export async function formatDocumentWithLlm(documentText: string): Promise<string> {
  const source = documentText.trim();
  if (!source) {
    return '';
  }

  if (source.length > LLM_DOCUMENT_MAX_CHARS) {
    throw new Error(
      `Черновик слишком длинный для ИИ-режима (${source.length} символов, максимум ${LLM_DOCUMENT_MAX_CHARS})`,
    );
  }

  let response: Response;
  try {
    response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: DOCUMENT_SYSTEM_PROMPT,
        prompt: `Черновик ТЗ:\n${source}\n\nОформленный документ:`,
        stream: false,
        options: {
          temperature: 0.12,
          num_predict: estimateNumPredict(source.length),
        },
      }),
      signal: AbortSignal.timeout(120_000),
    });
  } catch (error: unknown) {
    throw new Error(llmErrorMessage(error));
  }

  const payload = (await response.json()) as OllamaGenerateResponse;
  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? `Ollama вернула ошибку: ${response.status}`);
  }

  const formatted = unwrapLlmText(payload.response ?? '');
  return formatted || source;
}
