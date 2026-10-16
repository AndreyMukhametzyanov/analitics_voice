import { prisma } from '../prisma';
import { compileGlossary, type CompiledGlossary, type GlossaryItemRow } from './transcript';

const TTL_MS = Number(process.env.GLOSSARY_TTL_MS ?? 30_000);
const LLM_GLOSSARY_MAX_CHARS = Number(process.env.LLM_GLOSSARY_MAX_CHARS ?? 32_000);
const LLM_GLOSSARY_ALIASES_PER_KEYWORD = Number(process.env.LLM_GLOSSARY_ALIASES_PER_KEYWORD ?? 4);

type GlossaryCache = {
  loadedAt: number;
  glossary: CompiledGlossary;
  items: GlossaryItemRow[];
};

const globalForGlossary = globalThis as unknown as { glossaryCache?: GlossaryCache };

async function loadGlossaryCache(): Promise<GlossaryCache> {
  const cache = globalForGlossary.glossaryCache;
  if (cache && Date.now() - cache.loadedAt < TTL_MS) {
    return cache;
  }

  const items = await prisma.glossaryItem.findMany({
    select: { keyword: true, aliases: true },
  });
  const glossary = compileGlossary(items);
  const nextCache = { loadedAt: Date.now(), glossary, items };
  globalForGlossary.glossaryCache = nextCache;
  return nextCache;
}

export async function getGlossary(): Promise<CompiledGlossary> {
  return (await loadGlossaryCache()).glossary;
}

export async function getGlossaryItems(): Promise<GlossaryItemRow[]> {
  return (await loadGlossaryCache()).items;
}

function renderKeywordForLlm(keyword: string): string {
  if (keyword.startsWith('{{') && keyword.endsWith('}}')) {
    return keyword;
  }
  return `\`${keyword}\``;
}

/** Справочник синонимов → keyword для промпта локальной LLM. */
export function formatGlossaryForLlm(items: GlossaryItemRow[]): string {
  if (items.length === 0) {
    return '';
  }

  const lines: string[] = [];
  let length = 0;

  for (const item of items) {
    const aliases = item.aliases
      .split(',')
      .map((alias) => alias.trim())
      .filter((alias) => alias.length > 0)
      .slice(0, LLM_GLOSSARY_ALIASES_PER_KEYWORD)
      .join(', ');
    if (!aliases) {
      continue;
    }

    const line = `${renderKeywordForLlm(item.keyword)} ← ${aliases}`;
    if (length + line.length + 1 > LLM_GLOSSARY_MAX_CHARS) {
      lines.push('… (справочник обрезан по лимиту контекста)');
      break;
    }
    lines.push(line);
    length += line.length + 1;
  }

  return [
    'Справочник компании: если во фразе слышится синоним — запиши указанный keyword.',
    'Метки {{...}} вставляй как есть, остальные keyword — в обратных кавычках.',
    ...lines,
  ].join('\n');
}
