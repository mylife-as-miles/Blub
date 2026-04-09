import { Pause, Play, Square } from "lucide-react";
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
    <div className="editor-toolbar-segment flex h-11 items-center gap-2 rounded-[14px] px-2">
      <div className="hidden flex-col leading-none xl:flex">
        <span className="editor-toolbar-label">Sim</span>
        <span className="mt-1 text-[10px] font-medium text-foreground/54 uppercase">Physics</span>
      </div>
      <PlaybackButton active={mode === "running"} icon={Play} label="Run Physics" onClick={onPlay} />
      <PlaybackButton active={mode === "paused"} icon={Pause} label="Pause Physics" onClick={onPause} />
      <PlaybackButton active={mode === "stopped"} icon={Square} label="Stop Physics" onClick={onStop} />
    </div>
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
              "editor-toolbar-button size-8 rounded-[10px] hover:translate-y-0 active:scale-100",
              active && "editor-toolbar-button-active text-[#fff0cb]"
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
