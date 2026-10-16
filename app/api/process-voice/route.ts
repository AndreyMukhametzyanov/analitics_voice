import { NextResponse } from 'next/server';
import { MAX_AUDIO_BYTES, audioExtension, hasSpeech, transcodeToWav } from '@/lib/audio';
import {
  formatDocumentWithLlm,
  getGlossary,
  insertRecognizedText,
  polishTranscript,
} from '@/lib/voice';

export const runtime = 'nodejs';
export const maxDuration = 180;

const WHISPER_URL = process.env.WHISPER_URL ?? 'http://127.0.0.1:8080/inference';

export async function POST(request: Request) {
  try {
    // Черновой отсечь по заголовку до буферизации тела; точная проверка — по размеру blob'а.
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: `Аудио слишком большое, максимум ${Math.floor(MAX_AUDIO_BYTES / (1024 * 1024))} МБ` },
        { status: 413 },
      );
    }

    const formData = await request.formData();
    const audioBlob = formData.get('audio');
    const aiMode = formData.get('aiMode') === '1' || formData.get('aiMode') === 'true';
    const documentText = String(formData.get('documentText') ?? '');
    const cursorPosition = Number(formData.get('cursorPosition') ?? 0);

    if (!(audioBlob instanceof Blob)) {
      return NextResponse.json({ error: 'Аудиофайл не найден' }, { status: 400 });
    }

    if (audioBlob.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: `Аудио слишком большое, максимум ${Math.floor(MAX_AUDIO_BYTES / (1024 * 1024))} МБ` },
        { status: 413 },
      );
    }

    const audio = Buffer.from(await audioBlob.arrayBuffer());
    if (audio.length === 0) {
      return NextResponse.json({ error: 'Аудиофайл пустой' }, { status: 400 });
    }

    const wav = await transcodeToWav(audio, audioExtension(audioBlob.type));
    if (!hasSpeech(wav)) {
      return NextResponse.json({ text: '' });
    }

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

    const glossary = await getGlossary();
    const fragment = polishTranscript(rawText, glossary);
    if (!fragment) {
      return NextResponse.json({ text: '' });
    }

    if (!aiMode) {
      return NextResponse.json({ text: fragment });
    }

    const merged = insertRecognizedText(
      documentText,
      Number.isFinite(cursorPosition) ? cursorPosition : 0,
      fragment,
    );
    const formatted = await formatDocumentWithLlm(merged.text);

    return NextResponse.json({ text: formatted, replaceAll: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
