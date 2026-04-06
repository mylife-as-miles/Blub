import { defaultTools, type ToolId } from "@blud/tool-system";
import { FloatingPanel } from "@/components/editor-shell/FloatingPanel";
import { toolIconFor } from "@/components/editor-shell/icons";
import { cn } from "@/lib/utils";

type ToolIconSidebarProps = {
  activeToolId: ToolId;
  onSetToolId: (toolId: ToolId) => void;
};

export function ToolIconSidebar({ activeToolId, onSetToolId }: ToolIconSidebarProps) {
  return (
    <div className="pointer-events-none absolute right-2 top-1/2 z-20 flex -translate-y-1/2 flex-col sm:right-[calc(19rem+0.5rem)]">
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
    </div>
  );
}
