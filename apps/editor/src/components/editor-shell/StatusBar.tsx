import type { GridSnapValue, ViewportState } from "@ggez/render-pipeline";
import type { BrushShape, GeometryNode } from "@ggez/shared";
import type { WorkerJob } from "@ggez/workers";
import { JobStatus } from "@/components/editor-shell/JobStatus";
import type { MeshEditMode } from "@/viewport/editing";
import type { ViewportPaneId } from "@/viewport/viewports";

type StatusBarProps = {
  activeBrushShape: BrushShape;
  activeToolLabel: string;
  activeViewportId: ViewportPaneId;
  gridSnapValues: readonly GridSnapValue[];
  jobs: WorkerJob[];
  meshEditMode: MeshEditMode;
  selectedNode?: GeometryNode;
  viewModeLabel: string;
  viewport: ViewportState;
};

export function StatusBar({
  activeBrushShape,
  activeToolLabel,
  activeViewportId,
  gridSnapValues,
  jobs,
  meshEditMode,
  selectedNode,
  viewModeLabel,
  viewport
}: StatusBarProps) {
  const snapText = viewport.grid.enabled ? `snap ${viewport.grid.snapSize}` : `snap off`;
  const focusText = selectedNode
    ? `focus ${selectedNode.name} @ ${selectedNode.transform.position.x}, ${selectedNode.transform.position.y}, ${selectedNode.transform.position.z}`
    : "focus none";
  const interactionHint =
    activeToolLabel === "Brush"
      ? resolveBrushInteractionHint(activeBrushShape)
      : activeToolLabel === "Mesh Edit" && meshEditMode === "vertex"
        ? "click select / Shift-drag marquee / G move / R rotate / S scale / M merge / Shift+F fill"
      : activeToolLabel === "Mesh Edit" && meshEditMode === "edge"
        ? "click select / Shift-drag marquee / A arc / drag radius / wheel segments / K cut / B bevel / M merge"
        : activeToolLabel === "Mesh Edit" && meshEditMode === "face"
          ? "click select / Shift-drag marquee / Delete faces / M merge / N invert normals"
      : "click select / double-click focus / Shift-drag marquee / empty click clear";

  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-3">
      <div className="glass-panel glass-panel-subtle pointer-events-auto flex min-w-0 flex-1 items-center gap-2 rounded-[24px] px-3 py-2.5 text-[10px] tracking-[0.08em] text-foreground/58">
        <StatusMetric label="Tool" value={activeToolLabel} />
        {activeToolLabel === "Mesh Edit" ? <StatusMetric label="Mode" value={meshEditMode} /> : null}
        <StatusMetric label="View" value={viewModeLabel} />
        <StatusMetric label="Viewport" value={activeViewportId} />
        <StatusMetric label="Snap" value={snapText} />
        <StatusMetric label="Grid" value={`${gridSnapValues.length} presets`} />
        <div className="min-w-0 flex-1 truncate text-foreground/44">{focusText}</div>
        <div className="hidden max-w-[24rem] truncate text-foreground/36 xl:block">{interactionHint}</div>
      </div>
      <JobStatus jobs={jobs} />
    </div>
  );
}

function StatusMetric({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="glass-pill flex items-center gap-1.5 rounded-full px-2.5 py-1.5">
      <span className="text-foreground/38 uppercase">{label}</span>
      <span className="text-foreground/72 uppercase">{value}</span>
    </div>
  );
}

function resolveBrushInteractionHint(shape: BrushShape) {
  if (shape === "custom-polygon") {
    return "click plane / click points / Enter close / move extrude / click commit / Esc cancel";
  }

  if (shape === "plane") {
    return "click anchor / move for base / click commit / Esc cancel";
  }

  if (shape === "stairs") {
    return "click anchor / move for base / wheel rotate / click lock / move height / wheel steps / click commit / Esc cancel";
  }

  if (shape === "ramp") {
    return "click anchor / move for base / click lock / move for height / wheel arc segments / click commit / Esc cancel";
  }

  if (shape === "sphere") {
    return "click center / move for radius / click commit / Esc cancel";
  }

  if (shape === "cylinder" || shape === "cone") {
    return "click base center / move for radius / click lock / move for height / click commit / Esc cancel";
  }

  return "click anchor / move for base / click lock / move for height / click commit / Esc cancel";
}
