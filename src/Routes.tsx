import { Subscribe } from "@react-rxjs/core";
import { Compose } from "./Compose";
import { Design } from "./Design";
import { Fallback } from "./layout/Fallback";
import { useSelectedSection } from "./navigation/state";
import { useEffect } from "react";
import { changeSymbol, symbolState$ } from "./symbol/state";
import { defaultSymbolId } from "./symbol/model";

export const Routes = () => {
  const section = useSelectedSection();

  useEffect(() => {
    changeSymbol(defaultSymbolId);
  }, []);

  return (
    <Subscribe source$={symbolState$} fallback={<Fallback />}>
      {section === "design" && <Design />}
      {section === "compose" && <Compose />}
    </Subscribe>
  );
};
