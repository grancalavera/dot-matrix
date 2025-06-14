import { Subscribe } from "@react-rxjs/core";
import { useEffect } from "react";
import { Fallback } from "./layout/Fallback";
import { SectionLayout } from "./layout/SectionLayout";
import { QuickEdit } from "./symbol/QuickEdit";
import { QuickEditToolbar } from "./symbol/QuickEditToolbar";
import { defaultSymbolId } from "./symbol/model";
import { changeSymbol, symbolState$ } from "./symbol/state";

function AppQuickEdit() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const symbol = params.get("s") ?? defaultSymbolId;
    changeSymbol(symbol);
  }, []);

  return (
    <Subscribe source$={symbolState$}>
      <SectionLayout
        body={
          <Subscribe fallback={<Fallback />}>
            <QuickEdit />
          </Subscribe>
        }
        footer={<QuickEditToolbar />}
      />
    </Subscribe>
  );
}

export default AppQuickEdit;
