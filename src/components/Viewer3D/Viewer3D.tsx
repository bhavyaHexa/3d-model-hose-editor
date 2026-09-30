import { observer } from 'mobx-react-lite';
import { Suspense } from 'react';

import { Camera } from './Camera/Camera';
import { Canvas3D } from './Canvas3D/Canvas3D';
import { Env } from './Env/Env';
import { Light } from './Light/Light';
import { HosePipeModel } from '../Model/HosePipeModel';

export const Viewer3D = observer(() => {
  return (
    <Canvas3D>
      <Suspense fallback={null}>
        <Camera />
        <Light />
        <Env />
        <HosePipeModel />
      </Suspense>
    </Canvas3D>
  );
});
