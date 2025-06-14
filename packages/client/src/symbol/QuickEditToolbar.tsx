import { FlexibleSpace, Toolbar } from "../components";
import { DebugButton } from "../debug/DebugButton";
import { SymbolDesignerActions } from "./SymbolDesignerToolbar";

export const QuickEditToolbar = () => (
  <Toolbar>
    <DebugButton />
    <FlexibleSpace />
    <SymbolDesignerActions />
  </Toolbar>
);
