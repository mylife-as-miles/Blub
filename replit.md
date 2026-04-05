# BLUD - World Editor

## Project Overview

BLUD (pronounced "GG, Easy") is an opinionated, Next.js-like framework for developing 3D games using Three.js. It provides a monorepo containing a world editor, animation editor, and a set of runtime packages.

The primary application running in this environment is the **BLOB World Editor** (`apps/editor`).

## Tech Stack

- **Languages:** TypeScript, React 19
- **Build Tool:** Vite 8
- **3D Rendering:** Three.js, @react-three/fiber, @react-three/drei
- **Physics:** Rapier (@dimforge/rapier3d-compat)
- **State:** Valtio, XState
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Package Manager:** npm (workspaces monorepo)

## Project Structure

```
apps/
  editor/           # Main World Editor (runs on port 5000)
  orchestrator/     # Dev-time orchestrator (port 4300)
  animation-editor/ # Animation tool
  website/          # Documentation site
  three-vanilla-playground/
packages/
  editor-core/      # Document model, command stack, selection
  geometry-kernel/  # Math engine for brush solids
  three-runtime/    # Core loader for rendering scenes
  shared/           # Common types
  workers/          # Web workers with Comlink
  ... and more
```

## Running the App

The main workflow runs the editor:
- **Command:** `npm run dev -w @blud/editor`
- **Port:** 5000
- **URL:** http://0.0.0.0:5000

## Vite Config (editor)

The editor vite config (`apps/editor/vite.config.ts`) is configured to:
- Run on host `0.0.0.0` port `5000`
- Allow all hosts (`allowedHosts: true`) for Replit proxy compatibility
- Use workspace aliases to resolve local packages directly from source

## Deployment

Configured as a static site:
- **Build:** `npm run build -w @blud/editor`
- **Public Dir:** `apps/editor/dist`
