import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Download, ExternalLink, Gamepad2, Loader2, Paperclip, Send, Square, Trash2, Volume2, VolumeX, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopilotSettingsDialog } from "@/components/editor-shell/CopilotSettingsDialog";
import type { CopilotImageAttachment, CopilotMessage, CopilotSession } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";
import { useTts } from "@/hooks/useTts";

type GeneratedGame = { title: string; html: string };

type CopilotPanelProps = {
  onClose: () => void;
  onSendMessage: (prompt: string, images?: CopilotImageAttachment[]) => void;
  onAbort: () => void;
  onClearHistory: () => void;
  onClearGame?: () => void;
  onSettingsChanged: () => void;
  session: CopilotSession;
  isConfigured: boolean;
  latestGame?: GeneratedGame | null;
};

export function CopilotPanel({
  onClose,
  onSendMessage,
  onAbort,
  onClearHistory,
  onClearGame,
  onSettingsChanged,
  session,
  isConfigured,
  latestGame
}: CopilotPanelProps) {
  const [input, setInput] = useState("");
  const [attachedImages, setAttachedImages] = useState<CopilotImageAttachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isActive = session.status === "thinking" || session.status === "executing";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.messages, session.status]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if ((!trimmed && attachedImages.length === 0) || isActive) return;
    const images = attachedImages.length > 0 ? [...attachedImages] : undefined;
    setInput("");
    setAttachedImages([]);
    onSendMessage(trimmed || "What do you see in this image?", images);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setAttachedImages((prev) => [
          ...prev,
          { dataUrl, mimeType: file.type }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (!file) continue;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string;
          setAttachedImages((prev) => [
            ...prev,
            { dataUrl, mimeType: file.type }
          ]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const visibleMessages = session.messages.filter((m) => m.role !== "tool");

  return (
    <div className="glass-panel glass-panel-strong flex h-full flex-col overflow-hidden rounded-[32px]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-foreground/52 uppercase">
          <Bot className="size-3.5 text-emerald-400" />
          Copilot
        </div>
        <div className="flex items-center gap-0.5">
          {session.messages.length > 0 && (
            <Button
              className="size-7 rounded-lg text-foreground/48 hover:text-foreground"
              onClick={onClearHistory}
              size="icon-sm"
              title="Clear history"
              variant="ghost"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
          <CopilotSettingsDialog onSaved={onSettingsChanged} />
          <Button
            className="size-7 rounded-lg text-foreground/48 hover:text-foreground"
            onClick={onClose}
            size="icon-sm"
            variant="ghost"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" ref={scrollRef}>
        {visibleMessages.length === 0 && !isActive ? (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-2 text-center">
              <Bot className="mx-auto size-8 text-foreground/20" />
              <p className="text-xs text-foreground/40">
                {isConfigured
                  ? "Describe what you want to build."
                  : "Configure your API key in settings to get started."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {visibleMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isActive && <ThinkingIndicator session={session} />}
            {session.status === "error" && session.error && (
              <div className="rounded-xl border border-rose-400/14 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-300">
                {session.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Game artifact card */}
      {latestGame && (
        <div className="shrink-0 border-t border-white/8 p-3">
          <GameCard game={latestGame} onDismiss={onClearGame} />
        </div>
      )}

      {/* Image previews */}
      {attachedImages.length > 0 && (
        <div className="shrink-0 border-t border-white/8 px-4 pt-3 pb-1">
          <div className="flex flex-wrap gap-2">
            {attachedImages.map((img, i) => (
              <div className="relative" key={i}>
                <img
                  alt="attachment"
                  className="size-14 rounded-lg object-cover border border-white/10"
                  src={img.dataUrl}
                />
                <button
                  className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-black/70 text-white/70 hover:text-white transition-colors"
                  onClick={() => removeAttachment(i)}
                >
                  <X className="size-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-white/8 p-4">
        <input
          accept="image/*"
          className="hidden"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />
        <div className="flex gap-2">
          <button
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground/40 hover:text-foreground/72 hover:bg-white/[0.07] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            disabled={isActive || !isConfigured}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
            type="button"
          >
            <Paperclip className="size-3.5" />
          </button>
          <Input
            autoFocus
            className="h-9 flex-1 rounded-xl border-white/10 bg-white/[0.045] text-xs"
            disabled={isActive || !isConfigured}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onPaste={handlePaste}
            placeholder={isConfigured ? "Describe what to build..." : "Set up API key first"}
            ref={inputRef}
            value={input}
          />
          {isActive ? (
            <Button
              className="size-9 shrink-0 rounded-xl"
              onClick={onAbort}
              size="icon"
              variant="destructive"
            >
              <Square className="size-3.5" />
            </Button>
          ) : (
            <Button
              className="size-9 shrink-0 rounded-xl"
              disabled={(!input.trim() && attachedImages.length === 0) || !isConfigured}
              onClick={handleSubmit}
              size="icon"
            >
              <Send className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: CopilotMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] space-y-1.5">
          {message.images && message.images.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end">
              {message.images.map((img, i) => (
                <img
                  alt="attachment"
                  className="max-h-40 max-w-[200px] rounded-xl object-cover border border-white/10"
                  key={i}
                  src={img.dataUrl}
                />
              ))}
            </div>
          )}
          {message.content && (
            <div className="rounded-2xl rounded-br-md border border-emerald-300/14 bg-[linear-gradient(180deg,rgba(52,211,153,0.24),rgba(5,150,105,0.12)_100%)] px-3 py-2 text-xs text-foreground/92 shadow-[0_14px_30px_rgba(4,18,15,0.18)]">
              {message.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {message.toolCalls && message.toolCalls.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {message.toolCalls.map((tc) => (
            <div
              className="glass-pill flex items-center gap-1 rounded-full px-2 py-1 text-[9px] text-emerald-200"
              key={tc.id}
            >
              <Wrench className="size-2" />
              {tc.name}
            </div>
          ))}
        </div>
      )}
      {message.content && (
        <div className="group relative">
          <MarkdownContent content={message.content} />
          <SpeakButton text={message.content} />
        </div>
      )}
    </div>
  );
}

function SpeakButton({ text }: { text: string }) {
  const { speak, speaking, cancel } = useTts();

  return (
    <button
      aria-label={speaking ? "Stop speaking" : "Read aloud"}
      className={cn(
        "absolute -bottom-1 right-1 flex size-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100",
        "text-foreground/40 hover:text-emerald-400",
        speaking && "opacity-100 text-emerald-400"
      )}
      onClick={() => (speaking ? cancel() : speak(text))}
      title={speaking ? "Stop" : "Read aloud"}
      type="button"
    >
      {speaking ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
    </button>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  return (
    <div
      className="copilot-markdown glass-section max-w-[95%] rounded-2xl rounded-bl-md px-3 py-2 text-xs leading-relaxed text-foreground/74"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderMarkdown(text: string): string {
  let html = escapeHtml(text);

  // headings
  html = html.replace(/^#### (.+)$/gm, '<h4 class="mt-2 mb-0.5 text-[11px] font-semibold text-foreground/80">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="mt-2 mb-0.5 text-xs font-semibold text-foreground/85">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="mt-2 mb-0.5 text-xs font-bold text-foreground/90">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="mt-2 mb-0.5 text-[13px] font-bold text-foreground/92">$1</h1>');

  // code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) =>
    `<pre class="my-1 rounded-lg bg-white/[0.06] px-2 py-1.5 text-[10px] leading-snug overflow-x-auto"><code>${code.trim()}</code></pre>`
  );

  // inline code
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-white/[0.08] px-1 py-px text-[10px] text-emerald-200">$1</code>');

  // bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground/88">$1</strong>');

  // italic
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");

  // unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="ml-3 list-disc">$1</li>');
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="my-1 space-y-0.5">$1</ul>');

  // ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-3 list-decimal">$1</li>');
  html = html.replace(/((?:<li class="ml-3 list-decimal">.*<\/li>\n?)+)/g, '<ul class="my-1 space-y-0.5">$1</ul>');

  // paragraphs (double newlines)
  html = html.replace(/\n\n+/g, '</p><p class="mt-1.5">');
  html = `<p>${html}</p>`;

  // single newlines to <br> (but not inside pre)
  html = html.replace(/(?<!<\/pre>)\n(?!<)/g, "<br>");

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ThinkingIndicator({ session }: { session: CopilotSession }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Loader2 className="size-3 animate-spin text-emerald-400" />
      <span className="text-[10px] text-foreground/48">
        {session.status === "executing"
          ? "Executing tools..."
          : `Thinking${session.iterationCount > 1 ? ` (step ${session.iterationCount})` : ""}...`}
      </span>
    </div>
  );
}

function GameCard({ game, onDismiss }: { game: GeneratedGame; onDismiss?: () => void }) {
  const openGame = () => {
    const blob = new Blob([game.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const downloadGame = () => {
    const blob = new Blob([game.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${game.title.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Gamepad2 className="size-3.5 shrink-0 text-emerald-400" />
          <span className="truncate text-[11px] font-medium text-foreground/80">{game.title}</span>
        </div>
        {onDismiss && (
          <button
            className="shrink-0 text-foreground/32 hover:text-foreground/60 transition-colors"
            onClick={onDismiss}
            title="Dismiss"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
      <div className="flex gap-1.5">
        <button
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/20 px-2.5 py-1.5 text-[10px] font-medium text-emerald-300 hover:bg-emerald-500/30 transition-colors"
          onClick={openGame}
        >
          <ExternalLink className="size-3" />
          Open game
        </button>
        <button
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-medium text-foreground/52 hover:text-foreground/72 hover:bg-white/[0.07] transition-colors"
          onClick={downloadGame}
          title="Download HTML file"
        >
          <Download className="size-3" />
        </button>
      </div>
    </div>
  );
}
