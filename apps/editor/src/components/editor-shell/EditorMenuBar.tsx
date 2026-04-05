import { Bot, Cable, Gauge } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger
} from "@/components/ui/menubar";
import { TridentIcon } from "@/components/editor-shell/icons";
import type { ViewportQuality } from "@/state/ui-store";

type EditorMenuBarProps = {
  canRedo: boolean;
  canUndo: boolean;
  copilotOpen: boolean;
  gameConnectionControl?: ReactNode;
  logicViewerOpen: boolean;
  onClearSelection: () => void;
  onCreateBrush: () => void;
  onDeleteSelection: () => void;
  onDuplicateSelection: () => void;
  onGroupSelection: () => void;
  onExportEngine: () => void;
  onExportGltf: () => void;
  onFocusSelection: () => void;
  onLoadWhmap: () => void;
  onNewFile: () => void;
  onRedo: () => void;
  onSaveWhmap: () => void;
  onToggleCopilot: () => void;
  onToggleLogicViewer: () => void;
  onToggleViewportQuality: () => void;
  onUndo: () => void;
  viewportQuality: ViewportQuality;
};

export function EditorMenuBar({
  canRedo,
  canUndo,
  copilotOpen,
  gameConnectionControl,
  logicViewerOpen,
  onClearSelection,
  onCreateBrush,
  onDeleteSelection,
  onDuplicateSelection,
  onGroupSelection,
  onExportEngine,
  onExportGltf,
  onFocusSelection,
  onLoadWhmap,
  onNewFile,
  onRedo,
  onSaveWhmap,
  onToggleCopilot,
  onToggleLogicViewer,
  onToggleViewportQuality,
  viewportQuality,
  onUndo
}: EditorMenuBarProps) {
  return (
    <div className="flex h-14 items-center justify-between gap-4 px-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="glass-pill flex items-center gap-3 rounded-[20px] px-3.5 py-2">
          <span className="flex size-7 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <TridentIcon className="size-3.5" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-semibold tracking-[0.24em] text-foreground/96 uppercase">Blob</span>
            <span className="mt-1 text-[9px] tracking-[0.2em] text-foreground/42 uppercase">World Editor</span>
          </div>
        </div>

        <Menubar className="h-10 rounded-[20px] bg-transparent p-0 text-[11px] shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="h-8 rounded-[16px] px-3 text-[11px]">
              File
            </MenubarTrigger>
            <MenubarContent className="min-w-44 p-1.5">
              <MenubarItem className="rounded-lg text-xs" onClick={onNewFile}>
                New File
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onCreateBrush}>
                New Brush
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onSaveWhmap}>
                Save `.whmap`
                <MenubarShortcut>Cmd+S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onLoadWhmap}>
                Load `.whmap`
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onExportGltf}>
                Export glTF
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onExportEngine}>
                Export Runtime Bundle
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="h-8 rounded-[16px] px-3 text-[11px]">
              Edit
            </MenubarTrigger>
            <MenubarContent className="min-w-44 p-1.5">
              <MenubarItem className="rounded-lg text-xs" disabled={!canUndo} onClick={onUndo}>
                Undo
                <MenubarShortcut>Cmd+Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" disabled={!canRedo} onClick={onRedo}>
                Redo
                <MenubarShortcut>Cmd+Shift+Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onDuplicateSelection}>
                Duplicate
                <MenubarShortcut>Cmd+D</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onGroupSelection}>
                Group Selection
                <MenubarShortcut>Cmd+G</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onDeleteSelection}>
                Delete
                <MenubarShortcut>Del</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onClearSelection}>
                Clear Selection
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="h-8 rounded-[16px] px-3 text-[11px]">
              Render
            </MenubarTrigger>
            <MenubarContent className="min-w-44 p-1.5">
              <MenubarItem className="rounded-lg text-xs" onClick={onFocusSelection}>
                Focus Selection
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="h-8 rounded-[16px] px-3 text-[11px]">
              View
            </MenubarTrigger>
            <MenubarContent className="min-w-48 p-1.5">
              <MenubarItem className="rounded-lg text-xs" onClick={onToggleLogicViewer}>
                {logicViewerOpen ? "Hide" : "Show"} Logic Graph
                <MenubarShortcut>Cmd+Shift+L</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs" onClick={onToggleCopilot}>
                {copilotOpen ? "Hide" : "Show"} AI Vibe
                <MenubarShortcut>Cmd+L</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="h-8 rounded-[16px] px-3 text-[11px]">
              Help
            </MenubarTrigger>
            <MenubarContent className="min-w-52 p-1.5">
              <MenubarItem className="rounded-lg text-xs">
                Click to select
                <MenubarShortcut>Mouse 1</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs">
                Focus object
                <MenubarShortcut>Double click</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="rounded-lg text-xs">
                Marquee select
                <MenubarShortcut>Shift drag</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {gameConnectionControl}
        <div className="glass-pill flex items-center gap-1.5 rounded-[20px] px-1.5 py-1.5">
          <Button
            aria-label={`Canvas DPR ${viewportQuality.toFixed(2)}x`}
            className="min-w-[4.75rem] justify-center gap-1.5 px-3 text-[11px] text-foreground/72 hover:text-foreground"
            onClick={onToggleViewportQuality}
            size="sm"
            title={`Canvas DPR ${viewportQuality.toFixed(2)}x`}
            variant="ghost"
          >
            <Gauge className="size-3.5" />
            {viewportQuality.toFixed(2)}
          </Button>
          <Button
            aria-label="Logic Graph"
            className={logicViewerOpen ? "glass-button-active size-8 rounded-[16px] text-emerald-50" : "size-8 rounded-[16px] text-foreground/65 hover:text-foreground"}
            onClick={onToggleLogicViewer}
            title="Logic Graph (Cmd+Shift+L)"
            size="icon-sm"
            variant="ghost"
          >
            <Cable className="size-3.5" />
          </Button>
          <Button
            aria-label="AI Vibe"
            className={copilotOpen ? "glass-button-active size-8 rounded-[16px] text-emerald-50" : "size-8 rounded-[16px] text-foreground/65 hover:text-foreground"}
            onClick={onToggleCopilot}
            title="AI Vibe (Cmd+L)"
            size="icon-sm"
            variant="ghost"
          >
            <Bot className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
