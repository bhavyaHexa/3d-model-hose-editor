import { observer } from 'mobx-react-lite';

export const Light = observer(() => {
  return (
    <>
      <ambientLight intensity={1.01} />
    </>
  );
});
