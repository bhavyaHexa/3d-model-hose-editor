import { observer } from "mobx-react-lite";
import { Env } from "../Env/Env";

export const Light = observer(() => {
  return (
    <>
      <Env />
    </>
  );
});
