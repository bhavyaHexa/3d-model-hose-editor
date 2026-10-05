import { observer } from "mobx-react-lite";
import { Suspense } from "react";
import { Html } from "@react-three/drei";

import { Camera } from "./Camera/Camera";
import { Canvas3D } from "./Canvas3D/Canvas3D";

import { Light } from "./Light/Light";
import { HosePipeModel } from "../Model/HosePipeModel";

const LoaderFallback = () => (
  <Html center>
    <div
      style={{
        color: "#0b57d0",
        fontWeight: "bold",
        fontSize: "1.2rem",
        whiteSpace: "nowrap",
      }}
    >
      Loading Model...
    </div>
  </Html>
);

export const Viewer3D = observer(() => {
  return (
    <Canvas3D>
      <Camera />
      <Light />
      <Suspense fallback={<LoaderFallback />}>
        <HosePipeModel />
      </Suspense>
    </Canvas3D>
  );
});
