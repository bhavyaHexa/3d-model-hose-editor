import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import React from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../hooks/useMainContext';

export const Canvas3D: React.FC<{ children?: React.ReactNode }> = observer(
  ({ children }) => {
    const { designManager } = useMainContext();

    return (
      <Canvas
        className="canvas-3d"
        frameloop="demand"
        shadows
        camera={{
          far: 1000,
          fov: 45,
          near: 0.01,
          position: [0, 0.25, 1.5],
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
        }}
        onCreated={() => {
          designManager.viewManager.setViewerReady();
        }}>
        {children}
      </Canvas>
    );
  },
);
