import { useState } from "react";
import { Layers } from "lucide-react";
import { FLOOR_PRESETS, type FloorPresetId } from "@/lib/floor-presets";
import { FloatingPanel } from "@/components/editor-shell/FloatingPanel";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type FloorPresetsPanelProps = {
  disabled?: boolean;
  onPlaceFloorPreset: (presetId: FloorPresetId) => void;
};

export function FloorPresetsPanel({ disabled = false, onPlaceFloorPreset }: FloorPresetsPanelProps) {
  const [open, setOpen] = useState(false);
  const [lastPlaced, setLastPlaced] = useState<FloorPresetId | null>(null);

  const handlePlace = (id: FloorPresetId) => {
    setLastPlaced(id);
    onPlaceFloorPreset(id);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="pl-2 text-[9px] font-medium tracking-[0.22em] text-foreground/40 uppercase">Floors</div>
      <div className="relative">
        <FloatingPanel className="glass-panel-subtle flex h-11 items-center gap-1.5 p-1.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className={cn(
                    "size-8 rounded-[16px] text-foreground/58 hover:text-foreground disabled:pointer-events-none disabled:opacity-35",
                    open && "glass-button-active text-emerald-50"
                  )}
                  disabled={disabled}
                  onClick={() => setOpen((v) => !v)}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <FloorIcon className="size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-[11px] font-medium text-foreground">Floor Presets</div>
            </TooltipContent>
          </Tooltip>

          {FLOOR_PRESETS.map((preset) => (
            <Tooltip key={preset.id}>
              <TooltipTrigger
                render={
                  <Button
                    className={cn(
                      "size-8 rounded-[16px] p-0 text-foreground/58 hover:text-foreground disabled:pointer-events-none disabled:opacity-35",
                      lastPlaced === preset.id && "ring-1 ring-emerald-400/40"
                    )}
                    disabled={disabled}
                    onClick={() => handlePlace(preset.id)}
                    size="icon-sm"
                    variant="ghost"
                  />
                }
              >
                <FloorSwatch color={preset.swatchColor} accent={preset.swatchAccent} />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[14rem]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-semibold text-foreground">{preset.name}</span>
                  <span className="text-[10px] text-foreground/60">{preset.description}</span>
                  <div className="mt-1 flex gap-2 text-[9px] font-medium tracking-[0.1em] text-foreground/44 uppercase">
                    <span>Roughness {preset.roughness.toFixed(2)}</span>
                    <span>·</span>
                    <span>Metal {preset.metalness.toFixed(2)}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </FloatingPanel>

        {open && (
          <div className="absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-[22rem]">
            <FloatingPanel className="p-3">
              <div className="mb-2 flex items-center gap-2">
                <Layers className="size-3.5 text-emerald-400/70" />
                <span className="text-[10px] font-semibold tracking-[0.18em] text-foreground/72 uppercase">Hyper-Realistic Floor Presets</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {FLOOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    className={cn(
                      "group glass-section flex flex-col items-center gap-1.5 rounded-xl p-2 text-left transition-all hover:border-white/16",
                      lastPlaced === preset.id && "border-emerald-400/30"
                    )}
                    onClick={() => handlePlace(preset.id)}
                    disabled={disabled}
                    type="button"
                  >
                    <div
                      className="relative size-10 overflow-hidden rounded-lg shadow-md"
                      style={{ background: `linear-gradient(135deg, ${preset.swatchAccent ?? preset.swatchColor}, ${preset.swatchColor})` }}
                    >
                      <MaterialSheen roughness={preset.roughness} metalness={preset.metalness} />
                    </div>
                    <div className="w-full">
                      <div className="truncate text-[9px] font-semibold leading-tight text-foreground/90">{preset.name}</div>
                      <div className="mt-0.5 flex gap-1 text-[8px] text-foreground/38">
                        <span>R{preset.roughness.toFixed(1)}</span>
                        <span>M{preset.metalness.toFixed(1)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[9px] leading-relaxed text-foreground/34">
                Places a 20×20m floor slab with a calibrated PBR material. Each preset is tuned for photorealistic rendering.
              </p>
            </FloatingPanel>
          </div>
        )}
      </div>
    </div>
  );
}

function FloorSwatch({ color, accent }: { color: string; accent?: string }) {
  return (
    <div
      className="size-4 rounded-full border border-white/10 shadow-inner"
      style={{ background: `linear-gradient(135deg, ${accent ?? color}, ${color})` }}
    />
  );
}

function MaterialSheen({ roughness, metalness }: { roughness: number; metalness: number }) {
  const gloss = 1 - roughness;
  const metalFactor = metalness;
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,${gloss * 0.55}) 0%, transparent 55%)`,
          mixBlendMode: "overlay"
        }}
      />
      {metalFactor > 0.5 && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(225deg, rgba(255,255,255,${metalFactor * 0.4}) 0%, transparent 45%)`,
            mixBlendMode: "screen"
          }}
        />
      )}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(0,0,0,${roughness * 0.35}))`,
          mixBlendMode: "multiply"
        }}
      />
    </>
  );
}

function FloorIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className}>
      <path
        d="M4 17.5h16M4 17.5l3-9.5m13 9.5-3-9.5M7 8h10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M4 17.5v2h16v-2"
        opacity="0.38"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M10 12.5h4"
        opacity="0.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}
