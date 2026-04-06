import { Layers } from "lucide-react";
import { FLOOR_PRESETS, type FloorPresetId } from "@/lib/floor-presets";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type FloorPresetsPanelProps = {
  disabled?: boolean;
  onPlaceFloorPreset: (presetId: FloorPresetId) => void;
};

export function FloorPresetsPanel({ disabled = false, onPlaceFloorPreset }: FloorPresetsPanelProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className="size-8 rounded-[16px] text-foreground/58 hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
            disabled={disabled}
            size="icon-sm"
            title="Floor Presets"
            variant="ghost"
          />
        }
      >
        <Layers className="size-4" />
      </PopoverTrigger>

      <PopoverContent align="start" side="bottom" className="w-72 rounded-[24px] p-3">
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-medium tracking-[0.18em] text-foreground/45 uppercase">
            Floor Preset
          </div>
          {FLOOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-[12px] text-foreground/66 transition-[transform,background-color,border-color,color,box-shadow] duration-200 [transition-timing-function:var(--ease-out-strong)] hover:-translate-y-px hover:border-white/10 hover:bg-white/[0.06] hover:text-foreground"
              )}
              disabled={disabled}
              onClick={() => onPlaceFloorPreset(preset.id)}
              type="button"
            >
              <div
                className="size-6 shrink-0 rounded-md border border-white/10 shadow-inner"
                style={{
                  background: `linear-gradient(135deg, ${preset.swatchAccent ?? preset.swatchColor}, ${preset.swatchColor})`
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{preset.name}</div>
                <div className="truncate text-[10px] text-foreground/35">{preset.description}</div>
              </div>
              <div className="shrink-0 text-right text-[9px] text-foreground/30">
                <div>R {preset.roughness.toFixed(2)}</div>
                <div>M {preset.metalness.toFixed(2)}</div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
