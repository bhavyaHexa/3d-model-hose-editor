import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { observer } from "mobx-react-lite";

import { useMainContext } from "../../../hooks/useMainContext";

export const Camera = observer(() => {
  const { design3DManager } = useMainContext();
  const { cameraManager } = design3DManager;
  const invalidate = useThree((state) => state.invalidate);

  let minAzimuth = -Math.PI;
  let maxAzimuth = Math.PI;

  return (
    <CameraControls
      makeDefault
      dollySpeed={0.8}
      smoothTime={0.25}
      minDistance={0.01}
      maxDistance={2.0}
      minAzimuthAngle={minAzimuth}
      maxAzimuthAngle={maxAzimuth}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 1.5}
      onChange={() => invalidate()}
      ref={(camera) => {
        if (camera) {
          cameraManager.setCameraRef(camera);
        }
      }}
    />
  );
});
