import { describe, expect, test } from "bun:test";
import { importHtmlJsProject } from "./importer";

const encoder = new TextEncoder();

function makeFile(path: string, content: string, mimeType?: string) {
  return {
    bytes: encoder.encode(content),
    mimeType,
    path
  };
}

describe("scene-importer", () => {
  test("imports a single JS file with a mesh, camera, and generated custom script", async () => {
    const result = await importHtmlJsProject({
      files: [
        makeFile(
          "vehicle-demo.js",
          `
            import * as THREE from "three";
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
            camera.position.set(0, 3, 8);
            const boxGeometry = new THREE.BoxGeometry(2, 1, 4);
            const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.5 });
            const chassis = new THREE.Mesh(boxGeometry, carMaterial);
            chassis.name = "Chassis";
            chassis.position.set(0, 1, 0);
            scene.add(chassis);
            const renderer = new THREE.WebGLRenderer();
            renderer.setAnimationLoop(() => {});
          `
        )
      ]
    });

    expect(result.report.status).toBe("partially-imported");
    expect(result.report.detectedLibraries).toContain("three");
    expect(result.snapshot?.nodes.some((node) => node.name === "Chassis")).toBe(true);
    expect(result.snapshot?.entities.some((entity) => entity.type === "player-spawn")).toBe(true);
    expect(result.snapshot?.nodes.flatMap((node) => node.hooks ?? []).some((hook) => hook.type === "custom_script")).toBe(true);
  });

  test("imports HTML with inline module scripts", async () => {
    const result = await importHtmlJsProject({
      files: [
        makeFile(
          "index.html",
          `
            <html>
              <body>
                <script type="module">
                  import { Scene, Group } from "three";
                  const scene = new Scene();
                  const rootGroup = new Group();
                  rootGroup.name = "Imported Root Group";
                  scene.add(rootGroup);
                </script>
              </body>
            </html>
          `,
          "text/html"
        )
      ]
    });

    expect(result.report.entrypoint).toBe("index.html");
    expect(result.snapshot?.nodes.some((node) => node.name === "Imported Root Group")).toBe(true);
  });

  test("imports HTML with linked local scripts", async () => {
    const result = await importHtmlJsProject({
      files: [
        makeFile("index.html", `<script type="module" src="./app/main.js"></script>`, "text/html"),
        makeFile(
          "app/main.js",
          `
            import * as THREE from "three";
            const scene = new THREE.Scene();
            const sun = new THREE.DirectionalLight(0xffffff, 1.5);
            sun.position.set(5, 8, 2);
            scene.add(sun);
          `
        )
      ]
    });

    expect(result.snapshot?.nodes.some((node) => node.kind === "light")).toBe(true);
  });

  test("prefers index.html when multiple entrypoints are present", async () => {
    const result = await importHtmlJsProject({
      files: [
        makeFile("alt.html", `<script>console.log("alt")</script>`, "text/html"),
        makeFile("index.html", `<script type="module">import { Scene } from "three"; new Scene();</script>`, "text/html")
      ]
    });

    expect(result.report.entrypoint).toBe("index.html");
  });

  test("captures rapier scenes as partial imports with a generated custom script", async () => {
    const result = await importHtmlJsProject({
      files: [
        makeFile(
          "terrain-vehicle.js",
          `
            import * as THREE from "three";
            import RAPIER from "@dimforge/rapier3d-compat";
            const scene = new THREE.Scene();
            const renderer = new THREE.WebGLRenderer();
            document.body.appendChild(renderer.domElement);
            const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
            const chassis = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 4), new THREE.MeshStandardMaterial({ color: "#ff6600" }));
            scene.add(chassis);
            world.createVehicleController?.(null);
          `
        )
      ]
    });

    expect(result.report.detectedLibraries).toEqual(expect.arrayContaining(["rapier", "three"]));
    expect(result.report.status).toBe("partially-imported");
    expect(result.snapshot?.settings.world.gravity.y).toBeCloseTo(-9.81, 5);
    expect(result.snapshot?.nodes.flatMap((node) => node.hooks ?? []).some((hook) => hook.type === "custom_script")).toBe(true);
  });

  test("marks DOM-only projects as unsupported", async () => {
    const result = await importHtmlJsProject({
      files: [
        makeFile(
          "dom-heavy.js",
          `
            const panel = document.createElement("div");
            document.body.appendChild(panel);
            requestAnimationFrame(() => panel.classList.add("ready"));
          `
        )
      ]
    });

    expect(result.report.status).toBe("unsupported");
    expect(result.snapshot).toBeUndefined();
  });
});
