import { CenterLayout } from "../layout/CenterLayout";
import "./SymbolDesigner.css";
import { SymbolEditor } from "./SymbolEditor";
import { SymbolEditorThumbnails } from "./SymbolEditorThumbnails";

export const SymbolDesigner = () => (
  <div className="symbol-designer">
    <CenterLayout>
      <SymbolEditorThumbnails />
    </CenterLayout>
    <CenterLayout>
      <SymbolEditor />
    </CenterLayout>
  </div>
);
