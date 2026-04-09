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
import { BlobIcon } from "@/components/editor-shell/icons";
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
  onToggleTools: () => void;
  onToggleViewportQuality: () => void;
  onUndo: () => void;
  toolsPanelOpen: boolean;
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
  onToggleTools,
  onToggleViewportQuality,
  toolsPanelOpen,
  viewportQuality,
  onUndo
}: EditorMenuBarProps) {
  return (
    <div className="flex min-h-[3.25rem] flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-3.5">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div className="editor-toolbar-segment flex items-center gap-2 rounded-[16px] px-2.5 py-1.5 sm:gap-3 sm:px-3.5 sm:py-2">
          <span className="flex size-7 items-center justify-center rounded-xl border border-[#f6d07d]/18 bg-[#f6d07d]/10 text-[#f6d07d] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <BlobIcon className="size-3.5" />
          </span>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-[11px] font-semibold tracking-[0.24em] text-foreground/96 uppercase">Blob</span>
            <span className="mt-1 text-[9px] tracking-[0.2em] text-[#f6d07d]/58 uppercase">World Editor</span>
          </div>
          <span className="text-[11px] font-semibold tracking-[0.24em] text-foreground/96 uppercase sm:hidden">Blob</span>
        </div>

        <div className="editor-toolbar-shell min-w-0 flex-1 overflow-hidden rounded-[18px] px-2 py-1.5">
          <div className="flex items-center gap-2">
            <div className="hidden shrink-0 items-center gap-2 pl-1 lg:flex">
              <span className="editor-toolbar-label">Command Bar</span>
              <span className="editor-toolbar-readout rounded-md px-2 py-1 text-[9px] font-semibold tracking-[0.18em] uppercase">
                Editor
              </span>
            </div>
            <div className="min-w-0 flex-1 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Menubar className="w-max min-w-full rounded-[14px] bg-transparent p-0 text-[11px] shadow-none">
                <MenubarMenu>
                  <MenubarTrigger className="sm:px-3">
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
                  <MenubarTrigger>
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
                  <MenubarTrigger>
                    Render
                  </MenubarTrigger>
                  <MenubarContent className="min-w-44 p-1.5">
                    <MenubarItem className="rounded-lg text-xs" onClick={onFocusSelection}>
                      Focus Selection
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger>
                    Tools
                  </MenubarTrigger>
                  <MenubarContent className="min-w-48 p-1.5">
                    <MenubarItem className="rounded-lg text-xs" onClick={onToggleTools}>
                      {toolsPanelOpen ? "Hide" : "Show"} Tools Panel
                    </MenubarItem>
                    <MenubarItem className="rounded-lg text-xs" onClick={onCreateBrush}>
                      Activate Brush Tool
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>

                <MenubarMenu>
                  <MenubarTrigger>
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
                  <MenubarTrigger>
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
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {gameConnectionControl ? (
          <div className="editor-toolbar-segment flex items-center gap-1 rounded-[14px] px-1.5 py-1">
            <span className="hidden pl-1 text-[9px] font-semibold tracking-[0.16em] text-white/38 uppercase xl:block">
              Live Sync
            </span>
            {gameConnectionControl}
          </div>
        ) : null}
        <div className="editor-toolbar-segment flex items-center gap-1 rounded-[14px] px-1.5 py-1">
          <span className="hidden pl-1 text-[9px] font-semibold tracking-[0.16em] text-white/38 uppercase lg:block">
            Viewport
          </span>
          <Button
            aria-label={`Canvas DPR ${viewportQuality.toFixed(2)}x`}
            className="editor-toolbar-button hidden min-w-[5.25rem] justify-center gap-1.5 rounded-[10px] px-3 text-[11px] hover:translate-y-0 active:scale-100 sm:flex"
            onClick={onToggleViewportQuality}
            size="sm"
            title={`Canvas DPR ${viewportQuality.toFixed(2)}x`}
            variant="ghost"
          >
            <Gauge className="size-3.5" />
            {viewportQuality.toFixed(2)}
          </Button>
          <div className="editor-toolbar-divider hidden sm:block" />
          <Button
            aria-label="Logic Graph"
            className={logicViewerOpen ? "editor-toolbar-button editor-toolbar-button-active size-8 rounded-[10px] hover:translate-y-0 active:scale-100" : "editor-toolbar-button size-8 rounded-[10px] hover:translate-y-0 active:scale-100"}
            onClick={onToggleLogicViewer}
            title="Logic Graph (Cmd+Shift+L)"
            size="icon-sm"
            variant="ghost"
          >
            <Cable className="size-3.5" />
          </Button>
          <Button
            aria-label="AI Vibe"
            className={copilotOpen ? "editor-toolbar-button editor-toolbar-button-active size-8 rounded-[10px] hover:translate-y-0 active:scale-100" : "editor-toolbar-button size-8 rounded-[10px] hover:translate-y-0 active:scale-100"}
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
