import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../hooks/useMainContext';
import { hosePipeBoundingBox } from '../../utils/hosePipeBoundingBox';
import { cameraBoundingBox } from '../../utils/cameraBoundingBox';

const ModelLoader: React.FC<{ url: string }> = observer(({ url }) => {
  const gltf = useGLTF(url);
  const scene = gltf.scene as THREE.Group;

  const { design3DManager } = useMainContext();
  const { hosePipe3DManager, cameraManager } = design3DManager;
  const { gl } = useThree();

  useEffect(() => {
    if (scene) {
      const res = hosePipeBoundingBox(scene);
      if (res) {
        hosePipe3DManager.setBounds(res.minX, res.maxX);
      }

      // Fit camera to the newly loaded model
      const cameraControls = cameraManager.cameraRef;
      if (cameraControls) {
        const camRes = cameraBoundingBox(scene, { padding: 0.15 });
        if (camRes) {
          camRes.applyToCamera(cameraControls, true, true);
        }
      }

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => {
            if (material && material.map) {
              const texture = material.map;
              texture.generateMipmaps = true;
              texture.minFilter = THREE.NearestFilter;
              texture.magFilter = THREE.NearestFilter;
              const maxAnisotropy = gl.capabilities.getMaxAnisotropy() ?? 1;
              texture.anisotropy = maxAnisotropy;
              texture.needsUpdate = true;
            }
          });
        }
      });
    }
  }, [scene, hosePipe3DManager, gl]);

  return (
    <group
      ref={(ref) => {
        if (ref) {
          hosePipe3DManager.setGroupRef(ref);
        }
      }}>
      <primitive object={scene} />
    </group>
  );
});

export const HosePipeModel: React.FC = observer(() => {
  const { design3DManager } = useMainContext();
  const { hosePipe3DManager } = design3DManager;
  const modelUrl = hosePipe3DManager.currentModelUrl;

  if (!modelUrl) return null;

  return (
    <Suspense fallback={null}>
      <ModelLoader url={modelUrl} />
    </Suspense>
  );
});
