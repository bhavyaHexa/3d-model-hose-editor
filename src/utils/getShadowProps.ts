import * as THREE from 'three';
import { hosePipeBoundingBox } from './hosePipeBoundingBox';

export const getShadowProps = (scene: THREE.Object3D | null | undefined) => {
  if (!scene) return null;

  const res = hosePipeBoundingBox(scene);
  if (!res) return null;

  const center = res.box.getCenter(new THREE.Vector3());
  const size = res.box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.z);

  return {
    position: [center.x, res.box.min.y - (maxDim * 0.01), center.z] as [number, number, number],
    scale: maxDim * 2,
    far: Math.max(size.y, maxDim) * 2,
  };
};
