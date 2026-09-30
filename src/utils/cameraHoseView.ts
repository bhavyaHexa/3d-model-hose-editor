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
  //    d = (halfWidth) / (tan(hFOV/2) * fillRatio)
  const halfHoseWidth = size.x / 2;
  const d = halfHoseWidth / (Math.tan(hFOV / 2) * screenFillRatio);

  // 4. Clamp to reasonable limits
  const finalDistance = Math.max(d, 0.05);

  // 5. Position camera along +Z from hose center looking at center
  cameraControls.setLookAt(
    center.x,
    center.y,
    center.z + finalDistance,
    center.x,
    center.y,
    center.z,
    false, // no transition — instant snap
  );

  // 6. Lock zoom: default view is max zoom-out; allow 50% zoom-in
  cameraControls.maxDistance = finalDistance;
  cameraControls.minDistance = finalDistance * 0.5;
};
