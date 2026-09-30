import type { CameraControls } from "@react-three/drei";
import * as THREE from "three";

export interface CameraBoundingBoxOptions {
  boundaryPaddingFactor?: number;
  maxDistanceFactor?: number;
  padding?: number;
}

export interface CameraBoundingBoxResult {
  applyToCamera: (
    cameraControls: CameraControls,
    fitCamera?: boolean,
    enableTransition?: boolean,
  ) => void;
  boundaryBox: THREE.Box3;
  box: THREE.Box3;
  center: THREE.Vector3;
  maxDim: number;
  size: THREE.Vector3;
}

export const cameraBoundingBox = (
  objects: THREE.Object3D | THREE.Object3D[] | null | undefined,
  options?: CameraBoundingBoxOptions,
): CameraBoundingBoxResult | null => {
  if (!objects) return null;

  const objectList = (Array.isArray(objects) ? objects : [objects]).filter(
    Boolean,
  );
  if (objectList.length === 0) return null;

  const box = new THREE.Box3();
  let hasValidObject = false;

  objectList.forEach((item) => {
    if (item) {
      item.updateMatrixWorld(true);
      const itemBox = new THREE.Box3().setFromObject(item);
      if (!itemBox.isEmpty()) {
        box.union(itemBox);
        hasValidObject = true;
      }
    }
  });

  if (!hasValidObject || box.isEmpty()) {
    return null;
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.1);

  const padding = options?.padding ?? 0.15;
  const boundaryPaddingFactor = options?.boundaryPaddingFactor ?? 0.15;

  const boundaryBox = box
    .clone()
    .expandByVector(
      new THREE.Vector3(
        size.x * boundaryPaddingFactor,
        size.y * boundaryPaddingFactor,
        size.z * boundaryPaddingFactor,
      ),
    );

  const applyToCamera = (
    cameraControls: CameraControls,
    fitCamera = true,
    enableTransition = true,
  ) => {
    const camera = cameraControls.camera as THREE.PerspectiveCamera;
    let fitDistance = maxDim * 1.5;

    if (camera && camera.isPerspectiveCamera) {
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect);

      const distY = size.y / 2 / Math.tan(vFOV / 2);
      const distX = size.x / 2 / Math.tan(hFOV / 2);

      fitDistance = (Math.max(distX, distY) + size.z / 2) * (1 + padding);
    }

    if (fitCamera) {
      cameraControls.fitToBox(box, enableTransition, {
        paddingBottom: padding,
        paddingLeft: padding,
        paddingRight: padding,
        paddingTop: padding,
      });
    }

    if (enableTransition) {
      setTimeout(() => {
        if (typeof cameraControls.setBoundary === "function") {
          cameraControls.setBoundary(boundaryBox);
        }
        const actualDistance = cameraControls.distance;
        cameraControls.maxDistance = actualDistance;
        cameraControls.minDistance = actualDistance * 0.85;
      }, 1100);
    } else {
      if (typeof cameraControls.setBoundary === "function") {
        cameraControls.setBoundary(boundaryBox);
      }
      // Wait for fitToBox to finish settling before reading the actual distance
      setTimeout(() => {
        const actualDistance = cameraControls.distance;
        cameraControls.maxDistance = actualDistance;
        cameraControls.minDistance = actualDistance * 0.85;
      }, 150);
    }
  };

  return {
    applyToCamera,
    boundaryBox,
    box,
    center,
    maxDim,
    size,
  };
};
