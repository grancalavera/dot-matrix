import { Button, Toolbar } from "../components";
import {
  clearSymbolDraft,
  resetSymbolEdits,
  transposeSymbol,
  useIsSymbolDraftEmpty,
  useIsSymbolDraftModified,
  useSaveSymbolMutation,
  useSymbolDraft,
} from "./state";

export const SymbolDesignerToolbar = () => {
  const { mutate } = useSaveSymbolMutation();
  const draft = useSymbolDraft();
  const draftIsEmpty = useIsSymbolDraftEmpty();
  const draftIsNotModified = !useIsSymbolDraftModified();

  return (
    <Toolbar>
      <Button onClick={() => transposeSymbol()} disabled={draftIsEmpty}>
        transpose
      </Button>
      <Button onClick={() => resetSymbolEdits()} disabled={draftIsNotModified}>
        reset
      </Button>
      <Button onClick={() => clearSymbolDraft()} disabled={draftIsEmpty}>
        clear
      </Button>
      <Button onClick={() => mutate(draft)} disabled={draftIsNotModified}>
        save
      </Button>
    </Toolbar>
  );
};
