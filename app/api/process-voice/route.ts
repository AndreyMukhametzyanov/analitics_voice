import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const maxDuration = 120;

const WHISPER_URL = process.env.WHISPER_URL ?? 'http://127.0.0.1:8080/inference';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

type GlossaryItem = {
  keyword: string;
  aliases: string;
};

function audioExtension(type: string): string {
  const normalized = type.toLowerCase();
  if (normalized.includes('wav')) return 'wav';
  if (normalized.includes('ogg')) return 'ogg';
  if (normalized.includes('mpeg') || normalized.includes('mp3')) return 'mp3';
  if (normalized.includes('mp4') || normalized.includes('m4a') || normalized.includes('aac')) return 'm4a';
  return 'webm';
}

function runFfmpeg(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'ffmpeg',
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-i',
        inputPath,
        '-ar',
        '16000',
        '-ac',
        '1',
        '-c:a',
        'pcm_s16le',
        outputPath,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );

    let stderr = '';
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    proc.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') {
        reject(new Error('ffmpeg не найден. Установи пакет ffmpeg.'));
        return;
      }
      reject(error);
    });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr.trim() || `ffmpeg завершился с кодом ${code}`));
    });
  });
}

async function transcodeToWav(audio: Buffer, extension: string): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), 'voice-'));
  const inputPath = join(dir, `input.${extension}`);
  const outputPath = join(dir, 'output.wav');

  try {
    await writeFile(inputPath, audio);
    await runFfmpeg(inputPath, outputPath);
    return await readFile(outputPath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const FILLERS = ['короче', 'типа', 'ну', 'в общем', 'эм', 'ээ', 'ах', 'охо', 'как бы', 'это самое'];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderKeyword(keyword: string): string {
  if (keyword.startsWith('{{') && keyword.endsWith('}}')) {
    return keyword;
  }
  if (/^[^\p{L}\p{N}_]+$/u.test(keyword)) {
    return keyword;
  }
  return `\`${keyword}\``;
}

function replaceAlias(text: string, alias: string, replacement: string): string {
  const pattern = new RegExp(
    `(^|[^\\p{L}\\p{N}_])${escapeRegExp(alias)}(?=$|[^\\p{L}\\p{N}_])`,
    'giu',
  );
  return text.replace(pattern, `$1${replacement}`);
}

function hasSpeech(wav: Buffer): boolean {
  const marker = wav.indexOf('data');
  if (marker < 0 || marker + 8 > wav.length) {
    return false;
  }

  const end = Math.min(marker + 8 + wav.readUInt32LE(marker + 4), wav.length);
  let peak = 0;
  for (let index = marker + 8; index + 1 < end; index += 2) {
    const sample = wav.readInt16LE(index);
    const abs = sample < 0 ? -sample : sample;
    if (abs > peak) {
      peak = abs;
    }
  }

  return peak >= 500;
}

function polishTranscript(rawText: string, glossary: GlossaryItem[]): string {
  let text = rawText.replace(/\s+/g, ' ').trim();

  for (const filler of [...FILLERS].sort((left, right) => right.length - left.length)) {
    const pattern = new RegExp(
      `(^|[^\\p{L}\\p{N}])${escapeRegExp(filler)}(?=$|[^\\p{L}\\p{N}])`,
      'giu',
    );
    text = text.replace(pattern, '$1');
  }

  const aliases = glossary
    .flatMap((item) =>
      item.aliases
        .split(',')
        .map((alias) => alias.trim())
        .filter((alias) => alias.length > 0)
        .map((alias) => ({ alias, keyword: item.keyword })),
    )
    .sort((left, right) => right.alias.length - left.alias.length);

  for (const { alias, keyword } of aliases) {
    text = replaceAlias(text, alias, renderKeyword(keyword));
  }

  text = text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+([,.;:!?])/g, '$1')
    .replace(/([,;:!?])\.+/g, '$1')
    .replace(/\.{2,}/g, '.')
    .replace(/\n\.+/g, '\n')
    .replace(/([,.;:!?])(?=[^\s])/g, '$1 ')
    .replace(/^[ \t]+|[ \t]+$/g, '');

  if (!text.replace(/[ \t]/g, '')) {
    return '';
  }

  return text.replace(/\p{L}/u, (letter) => letter.toUpperCase());
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio');

    if (!(audioBlob instanceof Blob)) {
      return NextResponse.json({ error: 'Аудиофайл не найден' }, { status: 400 });
    }

    const audio = Buffer.from(await audioBlob.arrayBuffer());
    if (audio.length === 0) {
      return NextResponse.json({ error: 'Аудиофайл пустой' }, { status: 400 });
    }

    const wav = await transcodeToWav(audio, audioExtension(audioBlob.type));
    if (!hasSpeech(wav)) {
      return NextResponse.json({ text: '' });
    }

    const glossary = await prisma.glossaryItem.findMany();

    const whisperForm = new FormData();
    whisperForm.append('file', new Blob([new Uint8Array(wav)], { type: 'audio/wav' }), 'audio.wav');
    whisperForm.append('language', 'ru');
    whisperForm.append('response_format', 'json');
    whisperForm.append('temperature', '0');
    whisperForm.append('suppress_nst', 'true');

    const whisperResponse = await fetch(WHISPER_URL, {
      method: 'POST',
      body: whisperForm,
      signal: AbortSignal.timeout(120_000),
    });

    if (!whisperResponse.ok) {
      const detail = await whisperResponse.text();
      throw new Error(`Whisper вернул ошибку: ${whisperResponse.status} ${detail}`);
    }

    const whisperData = (await whisperResponse.json()) as { text?: string };
    const rawText = (whisperData.text ?? '').trim();
    if (!rawText) {
      return NextResponse.json({ text: '' });
    }

    const text = polishTranscript(rawText, glossary);
    if (!text) {
      return NextResponse.json({ text: '' });
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
