/**
 * elevenlabs-client.ts
 *
 * Thin browser-side client for the /api/elevenlabs/* Vite server plugin.
 * Uses the Replit connectors SDK on the server side — no API key needed here.
 */

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url: string | null;
  category: string;
}

export interface TtsOptions {
  voiceId?: string;
  modelId?: string;
}

/**
 * Convert text to speech. Returns an AudioBuffer ready to play via Web Audio API.
 * Streams the mp3 from the server plugin then decodes it in the browser.
 */
export async function textToSpeech(text: string, opts: TtsOptions = {}): Promise<AudioBuffer> {
  const response = await fetch("/api/elevenlabs/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, ...opts }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Unknown error" })) as { error: string };
    throw new Error(`ElevenLabs TTS failed: ${err.error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioCtx = getAudioContext();
  return audioCtx.decodeAudioData(arrayBuffer);
}

/**
 * Play text directly. Resolves when playback finishes.
 */
export async function speak(text: string, opts: TtsOptions = {}): Promise<void> {
  const buffer = await textToSpeech(text, opts);
  return playBuffer(buffer);
}

/**
 * Play a decoded AudioBuffer once.
 */
export function playBuffer(buffer: AudioBuffer): Promise<void> {
  return new Promise((resolve) => {
    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => resolve();
    source.start();
  });
}

/**
 * Fetch available voices from the ElevenLabs API (proxied via server plugin).
 */
export async function fetchVoices(): Promise<ElevenLabsVoice[]> {
  const response = await fetch("/api/elevenlabs/voices");
  if (!response.ok) throw new Error("Failed to fetch ElevenLabs voices");
  const data = await response.json() as { voices: ElevenLabsVoice[] };
  return data.voices ?? [];
}

let _audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext {
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new AudioContext();
  }
  if (_audioCtx.state === "suspended") {
    _audioCtx.resume().catch(() => {});
  }
  return _audioCtx;
}
