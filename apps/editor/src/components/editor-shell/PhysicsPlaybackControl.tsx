import { Pause, Play, Square } from "lucide-react";
import { FloatingPanel } from "@/components/editor-shell/FloatingPanel";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function PhysicsPlaybackControl({
  mode,
  onPause,
  onPlay,
  onStop
}: {
  mode: "paused" | "running" | "stopped";
  onPause: () => void;
  onPlay: () => void;
  onStop: () => void;
}) {
  return (
    <FloatingPanel className="glass-panel-subtle flex h-12 items-center gap-1.5 px-2">
      <PlaybackButton active={mode === "running"} icon={Play} label="Run Physics" onClick={onPlay} />
      <PlaybackButton active={mode === "paused"} icon={Pause} label="Pause Physics" onClick={onPause} />
      <PlaybackButton active={mode === "stopped"} icon={Square} label="Stop Physics" onClick={onStop} />
    </FloatingPanel>
  );
}

function PlaybackButton({
  active,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean;
  icon: typeof Play;
  label: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={label}
            className={cn(
              "size-8 rounded-[16px] text-foreground/58 hover:text-foreground",
              active && "glass-button-active text-emerald-50"
            )}
            onClick={onClick}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <Icon className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-[11px] font-medium text-foreground">{label}</div>
      </TooltipContent>
    </Tooltip>
  );
}
