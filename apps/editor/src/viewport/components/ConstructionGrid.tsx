import { snapValue, vec3 } from "@blud/shared";
import { useMemo } from "react";
import type { ViewportCanvasProps } from "@/viewport/types";
import { createIndexedGeometry } from "@/viewport/utils/geometry";
import { resolveViewportSnapSize } from "@/viewport/utils/snap";

export function ConstructionGrid({
  activeToolId,
  onPlaceAsset,
  renderMode,
  viewportPlane,
  viewport
}: Pick<ViewportCanvasProps, "activeToolId" | "onPlaceAsset" | "renderMode" | "viewport" | "viewportPlane">) {
  if (!viewport.grid.visible) {
    return null;
  }

  const snapSize = resolveViewportSnapSize(viewport);
  const minorStep = viewport.grid.snapSize;
  const majorStep = minorStep * viewport.grid.majorLineEvery;
  const extent = viewport.grid.size;
  const transform = resolveConstructionPlaneTransform(viewportPlane, viewport);
  const editorFloorVisible = renderMode === "lit" && viewport.projection === "perspective";

  return (
    <group position={transform.position} rotation={transform.rotation}>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
      >
        <planeGeometry args={[extent, extent]} />
        {editorFloorVisible ? (
          <meshStandardMaterial color="#cec8c0" metalness={0} roughness={0.96} />
        ) : (
          <meshBasicMaterial color="#657a90" transparent opacity={0.32} />
        )}
      </mesh>
      <GridLines color={editorFloorVisible ? "#b4ada4" : "#9fb4cb"} opacity={editorFloorVisible ? 0.78 : 0.5} size={extent} step={minorStep} y={0.002} />
      <GridLines color={editorFloorVisible ? "#7b746c" : "#dce7f5"} opacity={editorFloorVisible ? 0.82 : 0.72} size={extent} step={majorStep} y={0.006} />
    </group>
  );
}

function resolveConstructionPlaneTransform(
  plane: ViewportCanvasProps["viewportPlane"],
  viewport: ViewportCanvasProps["viewport"]
) {
  switch (plane) {
    case "xy":
      return {
        position: [0, 0, viewport.camera.target.z] as [number, number, number],
        rotation: [Math.PI / 2, 0, 0] as [number, number, number]
      };
    case "yz":
      return {
        position: [viewport.camera.target.x, 0, 0] as [number, number, number],
        rotation: [0, 0, Math.PI / 2] as [number, number, number]
      };
    case "xz":
    default:
      return {
        position: [0, viewport.grid.elevation, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number]
      };
  }
}

function snapPointToConstructionPlane(
  point: { x: number; y: number; z: number },
  plane: ViewportCanvasProps["viewportPlane"],
  viewport: ViewportCanvasProps["viewport"],
  snapSize: number
) {
  switch (plane) {
    case "xy":
      return vec3(snapValue(point.x, snapSize), snapValue(point.y, snapSize), viewport.camera.target.z);
    case "yz":
      return vec3(viewport.camera.target.x, snapValue(point.y, snapSize), snapValue(point.z, snapSize));
    case "xz":
    default:
      return vec3(snapValue(point.x, snapSize), viewport.grid.elevation, snapValue(point.z, snapSize));
  }
}

function GridLines({
  color,
  opacity,
  size,
  step,
  y
}: {
  color: string;
  opacity: number;
  size: number;
  step: number;
  y: number;
}) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const halfSize = size / 2;
    const safeStep = Math.max(step, 1);

    for (let offset = -halfSize; offset <= halfSize + 0.0001; offset += safeStep) {
      positions.push(-halfSize, y, offset, halfSize, y, offset);
      positions.push(offset, y, -halfSize, offset, y, halfSize);
    }

    return createIndexedGeometry(positions);
  }, [size, step, y]);

  return (
    <lineSegments frustumCulled={false} geometry={geometry} renderOrder={1}>
      <lineBasicMaterial color={color} depthWrite={false} opacity={opacity} toneMapped={false} transparent />
    </lineSegments>
  );
}
