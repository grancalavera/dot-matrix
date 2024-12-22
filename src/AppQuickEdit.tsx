import { Subscribe } from "@react-rxjs/core";
import { useEffect } from "react";
import { Fallback } from "./layout/Fallback";
import { SectionLayout } from "./layout/SectionLayout";
import { QuickEdit } from "./symbol/QuickEdit";
import { QuickEditToolbar } from "./symbol/QuickEditToolbar";
import { defaultSymbolId } from "./symbol/model";
import { changeSymbol, clipboard$, symbolState$ } from "./symbol/state";
import { merge } from "rxjs";

const source$ = merge(symbolState$, clipboard$);

function AppQuickEdit() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const symbol = params.get("s") ?? defaultSymbolId;
    changeSymbol(symbol);
  }, []);

  return (
    <SectionLayout
      body={
        <Subscribe
          source$={source$}
          fallback={<Fallback message="quick edit" />}
        >
          <QuickEdit />
        </Subscribe>
      }
      footer={
        <Subscribe>
          <QuickEditToolbar />
        </Subscribe>
      }
    />
  );
}

export default AppQuickEdit;
