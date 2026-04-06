import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { defaultTools, type ToolId } from "@blud/tool-system";
import { FloatingPanel } from "@/components/editor-shell/FloatingPanel";
import { toolIconFor } from "@/components/editor-shell/icons";
import { cn } from "@/lib/utils";

type ToolIconSidebarProps = {
  activeToolId: ToolId;
  onSetToolId: (toolId: ToolId) => void;
};

export function ToolIconSidebar({ activeToolId, onSetToolId }: ToolIconSidebarProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="pointer-events-none absolute right-2 top-16 z-20 flex flex-col items-end gap-2">
      {/* Collapse toggle */}
      <button
        className="pointer-events-auto flex size-8 items-center justify-center rounded-full glass-panel text-foreground/60 hover:text-foreground transition-colors duration-150"
        onClick={() => setOpen((v) => !v)}
        title={open ? "Collapse tools" : "Expand tools"}
        type="button"
      >
        {open ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>

      {/* Tool icon strip */}
      {open && (
        <FloatingPanel className="glass-panel-subtle flex flex-col items-center gap-1 p-1.5">
          {defaultTools.map((tool) => {
            const Icon = toolIconFor(tool.id);
            const active = tool.id === activeToolId;
            return (
              <button
                key={tool.id}
                className={cn(
                  "pointer-events-auto flex size-9 shrink-0 items-center justify-center rounded-[14px] text-foreground/55 transition-colors duration-150 hover:text-foreground",
                  active && "glass-button-active text-emerald-50"
                )}
                onClick={() => onSetToolId(tool.id)}
                title={tool.label}
                type="button"
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </FloatingPanel>
      )}
    </div>
  );
}
