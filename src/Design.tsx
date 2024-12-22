import { Subscribe } from "@react-rxjs/core";
import { SectionLayout } from "./layout/SectionLayout";
import { SymbolDesigner } from "./symbol/SymbolDesigner";
import { SymbolDesignerToolbar } from "./symbol/SymbolDesignerToolbar";
import { Fallback } from "./layout/Fallback";
import { merge } from "rxjs";
import { changeSymbol, clipboard$, symbolState$ } from "./symbol/state";
import { useEffect } from "react";
import { defaultSymbolId } from "./symbol/model";

const source$ = merge(symbolState$, clipboard$);

export const Design = () => {
  useEffect(() => {
    changeSymbol(defaultSymbolId);
  }, []);

  return (
    <SectionLayout
      body={
        <Subscribe source$={source$} fallback={<Fallback message="design" />}>
          <SymbolDesigner />
        </Subscribe>
      }
      footer={
        <Subscribe>
          <SymbolDesignerToolbar />
        </Subscribe>
      }
    />
  );
};
