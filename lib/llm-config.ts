export type LlmConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  documentMaxChars: number;
  requestTimeoutMs: number;
  temperature: number;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Не задан ${name} в .env`);
  }
  return value;
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return fallback;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`${name} в .env должен быть положительным числом`);
  }
  return n;
}

function envFloat(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return fallback;
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`${name} в .env должен быть числом`);
  }
  return n;
}

/** Параметры удалённого ИИ — только из переменных окружения (.env). */
export function getLlmConfig(): LlmConfig {
  return {
    baseUrl: requireEnv('LLM_BASE_URL').replace(/\/$/, ''),
    apiKey: requireEnv('LLM_API_KEY'),
    model: requireEnv('LLM_MODEL'),
    documentMaxChars: envInt('LLM_DOCUMENT_MAX_CHARS', 12_000),
    requestTimeoutMs: envInt('LLM_REQUEST_TIMEOUT_MS', 120_000),
    temperature: envFloat('LLM_TEMPERATURE', 0.12),
  };
}

export function isLlmConfigured(): boolean {
  return Boolean(
    process.env.LLM_BASE_URL?.trim() &&
      process.env.LLM_API_KEY?.trim() &&
      process.env.LLM_MODEL?.trim(),
  );
}
