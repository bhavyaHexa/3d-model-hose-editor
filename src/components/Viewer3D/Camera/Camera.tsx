import { CameraControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';

export const Camera = observer(() => {
  const { design3DManager, designManager } = useMainContext();
  const { cameraManager } = design3DManager;
  const currentStep = designManager.stepManager.currentStep;
  const invalidate = useThree((state) => state.invalidate);

  let minAzimuth = -Math.PI;
  let maxAzimuth = Math.PI;

  if (currentStep === 2) {
    // Fitting A
    minAzimuth = -Math.PI;
    maxAzimuth = Math.PI / 3;
  } else if (currentStep === 3) {
    // Fitting B
    minAzimuth = -Math.PI / 3;
    maxAzimuth = Math.PI;
  }

  return (
    <CameraControls
      makeDefault
      dollySpeed={0.8}
      smoothTime={1.0}
      minDistance={0.05}
      maxDistance={0.3}
      minAzimuthAngle={minAzimuth}
      maxAzimuthAngle={maxAzimuth}
      onChange={() => invalidate()}
      ref={(camera) => {
        if (camera) {
          cameraManager.setCameraRef(camera);
        }
      }}
    />
  );
});
