import { Subscribe } from "@react-rxjs/core";
import { useEffect } from "react";
import { Compose } from "./Compose";
import { Design } from "./Design";
import { useSelectedSection } from "./navigation/state";
import { defaultSymbolId } from "./symbol/model";
import { changeSymbol, clipboard$, symbolState$ } from "./symbol/state";
import { merge } from "rxjs";

const source$ = merge(symbolState$, clipboard$);

export const Routes = () => {
  const section = useSelectedSection();

  useEffect(() => {
    changeSymbol(defaultSymbolId);
  }, []);

  return (
    <Subscribe source$={source$}>
      {section === "design" && <Design />}
      {section === "compose" && <Compose />}
    </Subscribe>
  );
};
