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

export const SymbolDesignerToolbar = () => (
  <Toolbar className="symbol-designer-toolbar">
    <SymbolDesignerActions />
  </Toolbar>
);

export const SymbolDesignerActions = () => {
  const { mutate } = useSaveSymbolMutation();
  const draft = useSymbolDraft();
  const draftIsEmpty = useIsSymbolDraftEmpty();
  const draftIsNotModified = !useIsSymbolDraftModified();

  return (
    <>
      <Button divider onClick={() => fillSymbol()}>
        fill
      </Button>
      <Button onClick={() => invertSymbol()}>invert</Button>
      <Button onClick={() => clearSymbolDraft()} disabled={draftIsEmpty}>
        clear
      </Button>
      <Button
        divider
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
    </>
  );
};
