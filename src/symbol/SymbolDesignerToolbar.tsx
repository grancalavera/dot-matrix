import { Button, Toolbar } from "../components";
import {
  clearSymbolDraft,
  copySymbol,
  fillSymbol,
  flipSymbolH,
  flipSymbolV,
  invertSymbol,
  pasteSymbol,
  predictSymbol,
  replaceSymbol,
  resetSymbolEdits,
  rotateSymbol,
  useIsPredicting,
  useIsSymbolDraftEmpty,
  useIsSymbolDraftModified,
  useSaveSymbolMutation,
  useSymbolDraft,
} from "./state";

export const SymbolDesignerToolbar = () => (
  <Toolbar className="symbol-designer-toolbar">
    <SymbolDesignerActions />
  </Toolbar>
);

export const SymbolDesignerActions = () => {
  const { mutate: save } = useSaveSymbolMutation();

  const draft = useSymbolDraft();
  const draftIsEmpty = useIsSymbolDraftEmpty();
  const draftIsNotModified = !useIsSymbolDraftModified();
  const isPredicting = useIsPredicting();

  return (
    <>
      <Button
        divider
        onClick={() => predictSymbol(draft.id)}
        disabled={isPredicting}
      >
        ai
      </Button>
      <Button divider onClick={() => copySymbol()}>
        c
      </Button>
      <Button onClick={() => pasteSymbol()}>p</Button>
      <Button onClick={() => replaceSymbol()}>r</Button>
      <Button divider onClick={() => flipSymbolH()}>
        h
      </Button>
      <Button onClick={() => flipSymbolV()}>v</Button>
      <Button onClick={() => rotateSymbol()}>r</Button>
      <Button divider onClick={() => fillSymbol()}>
        f
      </Button>
      <Button onClick={() => invertSymbol()}>i</Button>
      <Button onClick={() => clearSymbolDraft()} disabled={draftIsEmpty}>
        c
      </Button>
      <Button
        divider
        onClick={() => resetSymbolEdits()}
        disabled={draftIsNotModified || isPredicting}
      >
        reset
      </Button>
      <Button
        onClick={() => save(draft)}
        disabled={draftIsNotModified || isPredicting}
        primary
      >
        save
      </Button>
    </>
  );
};
