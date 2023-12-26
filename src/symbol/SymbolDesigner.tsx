import { CenterLayout } from "../layout/CenterLayout";
import "./SymbolDesigner.css";
import { SymbolEditor } from "./SymbolEditor";
import { SymbolThumbnails } from "./SymbolThumbnails";

export const SymbolDesigner = () => (
  <div className="symbol-designer">
    <CenterLayout>
      <SymbolThumbnails />
    </CenterLayout>
    <CenterLayout>
      <SymbolEditor />
    </CenterLayout>
  </div>
);
