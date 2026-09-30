import * as THREE from 'three';

export const hosePipeBoundingBox = (
  object: THREE.Object3D | null | undefined,
) => {
  if (!object) {
    return null;
  }

  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);

  const minX = box.min.x;
  const maxX = box.max.x;

  return {
    box,
    maxX,
    minX,
  };
};
