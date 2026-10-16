/** Числительные словами → цифры (алгоритм, не GlossaryItem). */

const WORD_TO_VALUE: Record<string, number> = {
  ноль: 0,
  нуль: 0,
  нуля: 0,
  нулю: 0,
  нулём: 0,
  нулем: 0,
  нуле: 0,
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  один: 1,
  одна: 1,
  одно: 1,
  одного: 1,
  одной: 1,
  одному: 1,
  одним: 1,
  одном: 1,
  одну: 1,
  два: 2,
  две: 2,
  двух: 2,
  двум: 2,
  двумя: 2,
  двое: 2,
  три: 3,
  трёх: 3,
  трех: 3,
  трем: 3,
  трём: 3,
  тремя: 3,
  трое: 3,
  четыре: 4,
  четырёх: 4,
  четырех: 4,
  четырем: 4,
  четырём: 4,
  четырьмя: 4,
  четверо: 4,
  пять: 5,
  пяти: 5,
  пятью: 5,
  пятеро: 5,
  шесть: 6,
  шести: 6,
  шестью: 6,
  семь: 7,
  семи: 7,
  семью: 7,
  восемь: 8,
  восьми: 8,
  восемью: 8,
  девять: 9,
  девяти: 9,
  девятью: 9,
  десять: 10,
  десяти: 10,
  десятью: 10,
  одиннадцать: 11,
  двенадцать: 12,
  тринадцать: 13,
  четырнадцать: 14,
  пятнадцать: 15,
  шестнадцать: 16,
  семнадцать: 17,
  восемнадцать: 18,
  девятнадцать: 19,
  двадцать: 20,
  двадцати: 20,
  двадцатью: 20,
  тридцать: 30,
  тридцати: 30,
  тридцатью: 30,
  сорок: 40,
  сорока: 40,
  пятьдесят: 50,
  пятидесяти: 50,
  пятидесятью: 50,
  шестьдесят: 60,
  шестидесяти: 60,
  шестидесятью: 60,
  семьдесят: 70,
  семидесяти: 70,
  семидесятью: 70,
  восемьдесят: 80,
  восьмидесяти: 80,
  восьмидесятью: 80,
  девяносто: 90,
  девяноста: 90,
  сто: 100,
  ста: 100,
  двести: 200,
  двухсот: 200,
  триста: 300,
  трёхсот: 300,
  трехсот: 300,
  четыреста: 400,
  четырёхсот: 400,
  четырехсот: 400,
  пятьсот: 500,
  пятисот: 500,
  шестьсот: 600,
  шестисот: 600,
  семьсот: 700,
  семисот: 700,
  восемьсот: 800,
  восьмисот: 800,
  девятьсот: 900,
  девятисот: 900,
  тысяча: 1000,
  тысячи: 1000,
  тысяч: 1000,
  тысячу: 1000,
};

const SCALE = new Set([1000]);
function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/ё/g, 'е');
}

function parseIntegerTokens(tokens: string[], start: number): { value: number; length: number } | null {
  let index = start;
  let total = 0;
  let chunk = 0;
  let numberWords = 0;

  while (index < tokens.length) {
    const raw = tokens[index];
    if (raw === 'и') {
      if (numberWords === 0) {
        break;
      }
      index += 1;
      continue;
    }

    const value = WORD_TO_VALUE[normalizeWord(raw)];
    if (value === undefined) {
      break;
    }

    numberWords += 1;
    if (SCALE.has(value)) {
      if (chunk === 0) {
        chunk = 1;
      }
      total += chunk * value;
      chunk = 0;
    } else {
      chunk += value;
    }

    index += 1;
  }

  if (numberWords === 0) {
    return null;
  }

  return { value: total + chunk, length: index - start };
}

function formatDecimal(left: number, right: number): string {
  return `${left},${right}`;
}

function parseDecimalTokens(tokens: string[], start: number): { text: string; length: number } | null {
  const left = parseIntegerTokens(tokens, start);
  if (!left) {
    return null;
  }

  let index = start + left.length;
  while (index < tokens.length && tokens[index] === 'и') {
    index += 1;
  }

  const separator = index < tokens.length ? normalizeWord(tokens[index]) : '';
  if (separator !== 'запятая' && separator !== 'целых') {
    return null;
  }

  index += 1;
  while (index < tokens.length && tokens[index] === 'и') {
    index += 1;
  }

  const right = parseIntegerTokens(tokens, index);
  if (!right) {
    return null;
  }

  let end = index + right.length;
  const tail = end < tokens.length ? normalizeWord(tokens[end]) : '';
  if (tail === 'десятых' || tail === 'десятые' || tail === 'сотых' || tail === 'сотые') {
    end += 1;
  }

  const tokenCount = end - start;
  return { text: formatDecimal(left.value, right.value), length: tokenCount };
}

export function replaceSpokenNumbers(text: string): string {
  const tokens = text.split(/\s+/).filter((token) => token.length > 0);
  if (tokens.length === 0) {
    return text;
  }

  const out: string[] = [];
  let index = 0;

  while (index < tokens.length) {
    const decimal = parseDecimalTokens(tokens, index);
    if (decimal) {
      out.push(decimal.text);
      index += decimal.length;
      continue;
    }

    const integer = parseIntegerTokens(tokens, index);
    if (integer) {
      out.push(String(integer.value));
      index += integer.length;
      continue;
    }

    out.push(tokens[index]);
    index += 1;
  }

  return out.join(' ');
}
