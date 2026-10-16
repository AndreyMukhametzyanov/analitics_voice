import { replaceSpokenNumbers } from './spoken-numbers';

export type GlossaryItemRow = {
  keyword: string;
  aliases: string;
};

export type CompiledTerm = {
  alias: string;
  pattern: RegExp;
  replacement: string;
};

export type CompiledGlossary = {
  terms: CompiledTerm[];
};

const FILLERS = ['короче', 'типа', 'ну', 'в общем', 'эм', 'ээ', 'ах', 'охо', 'как бы', 'это самое'];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const FILLER_PATTERNS = [...FILLERS]
  .sort((left, right) => right.length - left.length)
  .map(
    (filler) =>
      new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(filler)}(?=$|[^\\p{L}\\p{N}])`, 'giu'),
  );

function capitalizeInsideQuotes(text: string): string {
  return text
    .replace(/(^|[^\p{L}\p{N}])«(\p{Ll})/gu, (_, before, letter) => `${before}«${letter.toUpperCase()}`)
    .replace(/(^|[^\p{L}\p{N}])"(\p{Ll})/gu, (_, before, letter) => `${before}"${letter.toUpperCase()}`);
}

function renderKeyword(keyword: string): string {
  if (keyword.startsWith('{{') && keyword.endsWith('}}')) {
    return keyword;
  }
  if (/^\d+$/u.test(keyword)) {
    return keyword;
  }
  if (/^[^\p{L}\p{N}_]+$/u.test(keyword)) {
    return keyword;
  }
  return `\`${keyword}\``;
}

export function compileGlossary(items: GlossaryItemRow[]): CompiledGlossary {
  const terms = items
    .flatMap((item) =>
      item.aliases
        .split(',')
        .map((alias) => alias.trim())
        .filter((alias) => alias.length > 0)
        .map((alias) => ({
          alias,
          pattern: new RegExp(
            `(^|[^\\p{L}\\p{N}_])${escapeRegExp(alias)}(?=$|[^\\p{L}\\p{N}_])`,
            'giu',
          ),
          replacement: renderKeyword(item.keyword),
        })),
    )
    .sort((left, right) => right.alias.length - left.alias.length);

  return { terms };
}

/** Сырой текст Whisper → текст для вставки в ТЗ. */
export function polishTranscript(rawText: string, glossary: CompiledGlossary): string {
  let text = rawText.replace(/\s+/g, ' ').trim();

  for (const pattern of FILLER_PATTERNS) {
    text = text.replace(pattern, '$1');
  }

  text = replaceSpokenNumbers(text);

  for (const term of glossary.terms) {
    text = text.replace(term.pattern, `$1${term.replacement}`);
  }

  text = capitalizeInsideQuotes(text);

  text = text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+([,.;:!?])/g, '$1')
    .replace(/([,;:!?])\.+/g, '$1')
    .replace(/\.{2,}/g, '.')
    .replace(/\n\.+/g, '\n')
    .replace(/([.;:!?])(?=[^\s])/g, '$1 ')
    .replace(/(,)(?=[^\s\d])/g, '$1 ')
    .replace(/^[ \t]+|[ \t]+$/g, '');

  if (!text.replace(/[ \t]/g, '')) {
    return '';
  }

  return text.replace(/\p{L}/u, (letter) => letter.toUpperCase());
}
