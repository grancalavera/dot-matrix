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
  copySymbol,
  replaceSymbol,
  pasteSymbol,
  flipSymbolH,
  flipSymbolV,
  rotateSymbol,
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
