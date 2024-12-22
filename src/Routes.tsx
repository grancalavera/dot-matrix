import { RemoveSubscribe, Subscribe } from "@react-rxjs/core";
import { Compose } from "./Compose";
import { Design } from "./Design";
import { section$, useSelectedSection } from "./navigation/state";

export const Routes = () => (
  <Subscribe source$={section$}>
    <Sections />
  </Subscribe>
);

const Sections = () => {
  const section = useSelectedSection();
  return (
    <>
      {section === "design" && (
        <RemoveSubscribe>
          <Design />
        </RemoveSubscribe>
      )}
      {section === "compose" && (
        <RemoveSubscribe>
          <Compose />
        </RemoveSubscribe>
      )}
    </>
  );
};
