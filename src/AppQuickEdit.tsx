import { Subscribe } from "@react-rxjs/core";
import { Suspense, useEffect } from "react";
import { SectionLayout } from "./layout/SectionLayout";
import { QuickEdit } from "./symbol/QuickEdit";
import { QuickEditToolbar } from "./symbol/QuickEditToolbar";
import { defaultSymbolId } from "./symbol/model";
import { editSymbol, symbolDraft$ } from "./symbol/state";

function AppQuickEdit() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const symbol = params.get("s") ?? defaultSymbolId;
    editSymbol(symbol);
  }, []);

  return (
    <Suspense>
      <Subscribe source$={symbolDraft$}>
        <SectionLayout body={<QuickEdit />} footer={<QuickEditToolbar />} />
      </Subscribe>
    </Suspense>
  );
}

export default AppQuickEdit;
