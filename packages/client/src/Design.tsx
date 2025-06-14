import { Subscribe } from "@react-rxjs/core";
import { SectionLayout } from "./layout/SectionLayout";
import { SymbolDesigner } from "./symbol/SymbolDesigner";
import { SymbolDesignerToolbar } from "./symbol/SymbolDesignerToolbar";
import { Fallback } from "./layout/Fallback";

export const Design = () => (
  <SectionLayout
    body={
      <Subscribe fallback={<Fallback />}>
        <SymbolDesigner />
      </Subscribe>
    }
    footer={<SymbolDesignerToolbar />}
  />
);
