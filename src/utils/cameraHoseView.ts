import type { CameraControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * Positions the camera so the hose always fills a consistent
 * fraction of the screen width (screenFillRatio), regardless of
 * the model's physical size. This gives every hose the exact same
 * normalized zoom level on load.
 */
export const cameraHoseView = (
  scene: THREE.Object3D,
  cameraControls: CameraControls,
  screenFillRatio = 0.8,
): void => {
  // 1. Compute bounding box
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene);

  if (box.isEmpty()) return;

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // 2. Get camera intrinsics (FOV + aspect ratio)
  const camera = cameraControls.camera as THREE.PerspectiveCamera;
  if (!camera || !camera.isPerspectiveCamera) return;

  const vFOV = THREE.MathUtils.degToRad(camera.fov);
  const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect);

  // 3. Compute distance so hose X-extent fills `screenFillRatio` of screen width
  const halfHoseWidth = size.x / 2;
  const d = halfHoseWidth / (Math.tan(hFOV / 2) * screenFillRatio);

  // 4. Clamp to reasonable limits
  const finalDistance = Math.max(d, 0.05);

  // 5. Expand maxDistance first so setLookAt is not clamped to an old value
  cameraControls.maxDistance = Math.max(finalDistance * 2, 2.0);
  cameraControls.minDistance = 0.01;

  // 6. Set lookAt immediately without transition
  cameraControls.setLookAt(
    center.x,
    center.y,
    center.z + finalDistance,
    center.x,
    center.y,
    center.z,
    false, // instant snap
  );

  // 7. Enforce distance bounds around the framed distance
  cameraControls.maxDistance = finalDistance * 1.15;
  cameraControls.minDistance = finalDistance * 0.85;

  // 8. Force camera-controls internal state to update immediately
  if (typeof (cameraControls as any).update === "function") {
    (cameraControls as any).update(0);
  }
};
