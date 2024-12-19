import { Subscribe } from "@react-rxjs/core";
import { useEffect } from "react";
import { Compose } from "./Compose";
import { Design } from "./Design";
import { useSelectedSection } from "./navigation/state";
import { defaultSymbolId } from "./symbol/model";
import { changeSymbol, symbolState$ } from "./symbol/state";

export const Routes = () => {
  const section = useSelectedSection();

  useEffect(() => {
    changeSymbol(defaultSymbolId);
  }, []);

  return (
    <Subscribe source$={symbolState$}>
      {section === "design" && <Design />}
      {section === "compose" && <Compose />}
    </Subscribe>
  );
};
