import { FlexibleSpace, Toolbar } from "../components";
import { DebugButton } from "../debug/DebugButton";
import { SymbolDesignerActions } from "./SymbolDesignerToolbar";

export const QuickEditToolbar = () => {
  return (
    <Toolbar>
      <DebugButton />
      <FlexibleSpace />
      <SymbolDesignerActions />
    </Toolbar>
  );
};
