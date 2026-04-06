/**
 * elevenlabs-api.ts — Vite server plugin
 *
 * Proxies ElevenLabs TTS and STT requests through the Replit connectors SDK so
 * the browser never touches the API key directly.
 *
 * Endpoints exposed by this plugin:
 *
 *  POST /api/elevenlabs/tts
 *       Body: { text: string; voiceId?: string; modelId?: string }
 *       Returns: audio/mpeg stream
 *
 *  GET  /api/elevenlabs/voices
 *       Returns: { voices: ElevenLabsVoice[] }
 *
 * The Replit connectors SDK (@replit/connectors-sdk) handles auth header
 * injection automatically — no API key needed in env vars.
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import type { Plugin, ViteDevServer, PreviewServer } from "vite";

const TTS_PATH    = "/api/elevenlabs/tts";
const VOICES_PATH = "/api/elevenlabs/voices";

const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // "George" — a good neutral default
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

export function createElevenLabsApiPlugin(): Plugin {
  return {
    name: "elevenlabs-api",
    configureServer(server) { registerApi(server); },
    configurePreviewServer(server) { registerApi(server); },
  };
}

function registerApi(
  server: Pick<ViteDevServer, "middlewares"> | Pick<PreviewServer, "middlewares">,
) {
  server.middlewares.use(async (req, res, next) => {
    const pathname = req.url?.split("?")[0];

    if (pathname === VOICES_PATH && req.method === "GET") {
      await handleVoices(res);
      return;
    }

    if (pathname === TTS_PATH && req.method === "POST") {
      await handleTts(req, res);
      return;
    }

    next();
  });
}

async function handleVoices(res: import("node:http").ServerResponse) {
  try {
    const connectors = new ReplitConnectors();
    const response = await connectors.proxy("elevenlabs", "/v1/voices", { method: "GET" });
    const data = await response.json() as unknown;
    sendJson(res, 200, data);
  } catch (err) {
    console.error("[elevenlabs-api] voices error", err);
    sendJson(res, 500, { error: "Failed to fetch voices." });
  }
}

async function handleTts(
  req: import("node:http").IncomingMessage,
  res: import("node:http").ServerResponse,
) {
  try {
    const body = await readJson<{ text: string; voiceId?: string; modelId?: string }>(req);

    if (!body?.text?.trim()) {
      sendJson(res, 400, { error: "text is required." });
      return;
    }

    const voiceId = body.voiceId ?? DEFAULT_VOICE_ID;
    const modelId = body.modelId ?? DEFAULT_MODEL_ID;

    const connectors = new ReplitConnectors();
    const response = await connectors.proxy(
      "elevenlabs",
      `/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: body.text,
          model_id: modelId,
          output_format: "mp3_44100_128",
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[elevenlabs-api] TTS upstream error", response.status, errText);
      sendJson(res, response.status, { error: "ElevenLabs TTS failed.", detail: errText });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
      "Transfer-Encoding": "chunked",
    });

    const reader = response.body?.getReader();
    if (!reader) {
      res.end();
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (err) {
    console.error("[elevenlabs-api] TTS error", err);
    sendJson(res, 500, { error: "Internal server error." });
  }
}

function sendJson(res: import("node:http").ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(body);
}

async function readJson<T>(req: import("node:http").IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString()) as T); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}
