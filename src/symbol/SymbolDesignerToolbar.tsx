import { Button, Toolbar } from "../components";
import {
  clearSymbolDraft,
  resetSymbolEdits,
  useIsSymbolDraftEmpty,
  useIsSymbolDraftModified,
  useSaveSymbolMutation,
  useSymbolDraft,
  invertSymbol,
  fillSymbol,
} from "./state";
import "./SymbolDesignerToolbar.css";

export const SymbolDesignerToolbar = () => {
  const { mutate } = useSaveSymbolMutation();
  const draft = useSymbolDraft();
  const draftIsEmpty = useIsSymbolDraftEmpty();
  const draftIsNotModified = !useIsSymbolDraftModified();

  return (
    <Toolbar className="symbol-designer-toolbar">
      <Button className="button-section" onClick={() => fillSymbol()}>
        fill
      </Button>
      <Button onClick={() => invertSymbol()}>invert</Button>
      <Button onClick={() => clearSymbolDraft()} disabled={draftIsEmpty}>
        clear
      </Button>
      <Button
        className="button-section"
        onClick={() => resetSymbolEdits()}
        disabled={draftIsNotModified}
      >
        reset
      </Button>
      <Button
        onClick={() => mutate(draft)}
        disabled={draftIsNotModified}
        primary
      >
        save
      </Button>
    </Toolbar>
  );
};
