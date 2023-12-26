import { Compose } from "./Compose";
import { Design } from "./Design";
import { useSelectedSection } from "./state";

export const Routes = () => {
  const section = useSelectedSection();
  return (
    <>
      {section === "design" && <Design />}
      {section === "compose" && <Compose />}
    </>
  );
};
