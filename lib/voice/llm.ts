import { getLlmConfig } from '../llm-config';

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

type ChatCompletionsResponse = {
  choices?: { message?: { content?: string | null } }[];
  error?: { message?: string };
};

function chatCompletionsUrl(baseUrl: string): string {
  if (baseUrl.endsWith('/chat/completions')) {
    return baseUrl;
  }
  if (baseUrl.endsWith('/v1')) {
    return `${baseUrl}/chat/completions`;
  }
  return `${baseUrl}/v1/chat/completions`;
}

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
    return 'ИИ-сервер не ответил вовремя';
  }
  if (error instanceof Error && /fetch|ECONNREFUSED|network/i.test(error.message)) {
    return 'ИИ-сервер недоступен. Проверь LLM_BASE_URL в .env и сеть.';
  }
  return error instanceof Error ? error.message : 'ИИ-сервер вернул ошибку';
}

function estimateMaxTokens(textLength: number): number {
  return Math.min(4096, Math.max(512, Math.ceil(textLength * 1.4) + 256));
}

/** Финальное оформление черновика ТЗ после глоссария и фильтров. */
export async function formatDocumentWithLlm(documentText: string): Promise<string> {
  const source = documentText.trim();
  if (!source) {
    return '';
  }

  const llm = getLlmConfig();

  if (source.length > llm.documentMaxChars) {
    throw new Error(
      `Черновик слишком длинный для ИИ-режима (${source.length} символов, максимум ${llm.documentMaxChars})`,
    );
  }

  const url = chatCompletionsUrl(llm.baseUrl);
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${llm.apiKey}`,
      },
      body: JSON.stringify({
        model: llm.model,
        messages: [
          { role: 'system', content: DOCUMENT_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Черновик ТЗ:\n${source}\n\nОформленный документ:`,
          },
        ],
        temperature: llm.temperature,
        max_tokens: estimateMaxTokens(source.length),
      }),
      signal: AbortSignal.timeout(llm.requestTimeoutMs),
    });
  } catch (error: unknown) {
    throw new Error(llmErrorMessage(error));
  }

  const payload = (await response.json()) as ChatCompletionsResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `ИИ-сервер вернул ошибку: ${response.status}`);
  }

  const formatted = unwrapLlmText(payload.choices?.[0]?.message?.content ?? '');
  return formatted || source;
}
