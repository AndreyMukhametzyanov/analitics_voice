import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Жёсткий лимит на размер присланного аудио: nginx пускает тела до 25 МБ,
// но диктовка весит порядком меньше, а ffmpeg не должен переваривать произвольные гигабайты.
export const MAX_AUDIO_BYTES = Number(process.env.MAX_AUDIO_BYTES ?? 10 * 1024 * 1024);

export function audioExtension(type: string): string {
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

export async function transcodeToWav(audio: Buffer, extension: string): Promise<Buffer> {
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

export function hasSpeech(wav: Buffer): boolean {
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
