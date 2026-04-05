import { LayoutGrid } from "lucide-react";
import { FloatingPanel } from "@/components/editor-shell/FloatingPanel";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getViewModePreset, viewModePresets, type ViewModeId } from "@/viewport/viewports";

export function ViewModeControl({
  currentViewMode,
  onSetViewMode
}: {
  currentViewMode: ViewModeId;
  onSetViewMode: (viewMode: ViewModeId) => void;
}) {
  const currentPreset = getViewModePreset(currentViewMode);

  return (
    <FloatingPanel className="glass-panel-subtle flex h-12 items-center gap-2.5 px-3.5 text-[11px] text-foreground/72">
      <LayoutGrid className="size-3.5 text-emerald-300" />
      <Popover>
        <PopoverTrigger
          render={
            <Button className="h-8 rounded-[16px] px-3 text-[11px] font-medium text-foreground/82" size="sm" variant="ghost">
              {currentPreset.shortLabel}
            </Button>
          }
        />
        <PopoverContent align="start" className="w-72 rounded-[24px] p-3">
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-medium tracking-[0.18em] text-foreground/45 uppercase">View Mode</div>
            {viewModePresets.map((preset) => (
              <button
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-left text-[12px] text-foreground/66 transition-[transform,background-color,border-color,color,box-shadow] duration-200 [transition-timing-function:var(--ease-out-strong)] hover:-translate-y-px hover:border-white/10 hover:bg-white/[0.06] hover:text-foreground",
                  preset.id === currentViewMode && "glass-button-active text-emerald-50"
                )}
                key={preset.id}
                onClick={() => onSetViewMode(preset.id)}
                type="button"
              >
                <span className="font-medium">{preset.shortLabel}</span>
                <span className="ml-3 text-[10px] text-foreground/35">{preset.label}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </FloatingPanel>
  );
}
