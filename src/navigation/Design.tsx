import { SectionLayout } from "../layout/SectionLayout";
import { SymbolDesigner } from "../symbol/SymbolDesigner";
import { SymbolDesignerToolbar } from "../symbol/SymbolDesignerToolbar";

export const Design = () => (
  <SectionLayout body={<SymbolDesigner />} footer={<SymbolDesignerToolbar />} />
);
