import { Environment, Lightformer } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';

import { useMainContext } from '../../../hooks/useMainContext';

export const Env = observer(() => {
  // Load HDR environment map (Suspense handles the loading state)
  const defaultTexture = useLoader(RGBELoader, '/env/studio_small_09_2k.hdr');
  const { design3DManager } = useMainContext();
  const { envManager } = design3DManager;

  return (
    <Environment background={false}>
      <mesh
        rotation={[
          envManager.envRotation.x,
          envManager.envRotation.y,
          envManager.envRotation.z,
        ]}
        scale={100}>
        <sphereGeometry />
        <meshBasicMaterial
          transparent
          opacity={envManager.envIntensity}
          map={envManager.environmentTexture || defaultTexture}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* LightFormer at the back side of the hose pipe */}
      <Lightformer
        form="rect"
        intensity={1.5}
        position={[0, 0, -5]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />

      <Lightformer
        form="rect"
        intensity={3}
        position={[-5, 0, 0]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
      />
    </Environment>
  );
});
