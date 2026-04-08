import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditorCore } from "@blud/editor-core";
import type { CopilotImageAttachment, CopilotSession } from "@/lib/copilot/types";
import { runAgenticLoop } from "@/lib/copilot/agentic-loop";
import { createCopilotProvider } from "@/lib/copilot/provider";
import { buildSystemPrompt } from "@/lib/copilot/system-prompt";
import { loadCopilotSettings, isCopilotConfigured } from "@/lib/copilot/settings";
import { COPILOT_TOOL_DECLARATIONS } from "@/lib/copilot/tool-declarations";
import { executeTool, type CopilotToolExecutionContext } from "@/lib/copilot/tool-executor";

export type GeneratedGame = { title: string; html: string };

const EMPTY_SESSION: CopilotSession = {
  messages: [],
  status: "idle",
  iterationCount: 0
};

function extractHtmlFromMessages(messages: CopilotSession["messages"]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== "assistant" || !msg.content) continue;
    const match = /```html\s*([\s\S]+?)```/i.exec(msg.content);
    if (match) return match[1].trim();
  }
  return null;
}

export function useCopilot(editor: EditorCore, toolContext: CopilotToolExecutionContext = {}) {
  const [session, setSession] = useState<CopilotSession>(EMPTY_SESSION);
  const [configured, setConfigured] = useState(() => isCopilotConfigured());
  const [latestGame, setLatestGame] = useState<GeneratedGame | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const codexThreadIdRef = useRef<string | undefined>(undefined);
  const pendingGameTitleRef = useRef<string | null>(null);

  const mergedToolContext = useMemo<CopilotToolExecutionContext>(
    () => ({
      ...toolContext,
      onGeneratedGame: (title: string, _html: string) => {
        pendingGameTitleRef.current = title;
      }
    }),
    [toolContext]
  );

  useEffect(() => {
    const check = () => setConfigured(isCopilotConfigured());
    window.addEventListener("focus", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("focus", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  useEffect(() => {
    if (session.status !== "idle" || !pendingGameTitleRef.current) return;
    const title = pendingGameTitleRef.current;
    pendingGameTitleRef.current = null;
    const html = extractHtmlFromMessages(session.messages);
    if (html) {
      setLatestGame({ title, html });
    }
  }, [session.status, session.messages]);

  const sendMessage = useCallback(
    async (prompt: string, images?: CopilotImageAttachment[]) => {
      const settings = loadCopilotSettings();

      if (!isCopilotConfigured(settings)) {
        setSession((prev) => ({
          ...prev,
          status: "error",
          error: settings.provider === "codex"
            ? 'Codex not configured. Run "codex login" in your terminal.'
            : "No API key configured. Open Copilot settings to add one."
        }));
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      const copilotProvider = createCopilotProvider(settings.provider);
      const systemPrompt = buildSystemPrompt(editor);

      const providerConfig = {
        apiKey: settings.provider === "gemini" ? settings.gemini.apiKey : "",
        model: settings.provider === "gemini" ? settings.gemini.model : settings.codex.model,
        temperature: settings.temperature
      };

      if (copilotProvider.kind === "session-based") {
        await copilotProvider.provider.runSession({
          messages: session.messages,
          userPrompt: prompt,
          tools: COPILOT_TOOL_DECLARATIONS,
          systemPrompt,
          providerConfig,
          threadId: codexThreadIdRef.current,
          onThreadId: (threadId) => {
            codexThreadIdRef.current = threadId;
          },
          executeTool: (toolCall) => executeTool(editor, toolCall, mergedToolContext),
          onUpdate: (updated) => {
            setSession({ ...updated, messages: [...updated.messages] });
          },
          signal: controller.signal
        });
      } else {
        await runAgenticLoop(
          prompt,
          session.messages,
          {
            maxIterations: 25,
            provider: copilotProvider.provider,
            providerConfig,
            systemPrompt,
            tools: COPILOT_TOOL_DECLARATIONS,
            executeTool: (toolCall) => executeTool(editor, toolCall, mergedToolContext),
            onUpdate: (updated) => {
              setSession({ ...updated, messages: [...updated.messages] });
            }
          },
          controller.signal,
          images
        );
      }

      abortRef.current = null;
    },
    [editor, session.messages, mergedToolContext]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const clearHistory = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    codexThreadIdRef.current = undefined;
    pendingGameTitleRef.current = null;
    setSession(EMPTY_SESSION);
  }, []);

  const clearLatestGame = useCallback(() => setLatestGame(null), []);

  return {
    session,
    sendMessage,
    abort,
    clearHistory,
    isConfigured: configured,
    refreshConfigured: () => setConfigured(isCopilotConfigured()),
    latestGame,
    clearLatestGame
  };
}
