import { CenterLayout } from "../layout/CenterLayout";
import { SymbolEditor } from "./SymbolEditor";
import "./QuickEdit.css";
import { SelectedSymbolThumbnail } from "./SymbolEditorThumbnails";

export const QuickEdit = () => {
  return (
    <div className="quick-edit">
      <CenterLayout>
        <SelectedSymbolThumbnail />
      </CenterLayout>
      <CenterLayout>
        <SymbolEditor />
      </CenterLayout>
    </div>
  );
};
