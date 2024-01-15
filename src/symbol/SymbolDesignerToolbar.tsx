import { useEffect } from "react";
import { Button, Toolbar } from "../components";
import { isLoading, isSuccess } from "../lib/result";
import {
  clearSymbolDraft,
  fillSymbol,
  invertSymbol,
  replaceSymbolDraft,
  resetSymbolEdits,
  useIsSymbolDraftEmpty,
  useIsSymbolDraftModified,
  usePredictSymbolMutation,
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
  const { mutate: predict, result: predictResult } = usePredictSymbolMutation();

  const draft = useSymbolDraft();
  const draftIsEmpty = useIsSymbolDraftEmpty();
  const draftIsNotModified = !useIsSymbolDraftModified();
  const isPredicting = isLoading(predictResult);

  useEffect(() => {
    if (isSuccess(predictResult)) {
      replaceSymbolDraft(predictResult.data);
    }
  }, [predictResult]);

  return (
    <>
      <Button divider onClick={() => predict(draft.id)} disabled={isPredicting}>
        ai
      </Button>
      <Button divider onClick={() => fillSymbol()} disabled={isPredicting}>
        fill
      </Button>
      <Button onClick={() => invertSymbol()} disabled={isPredicting}>
        invert
      </Button>
      <Button
        onClick={() => clearSymbolDraft()}
        disabled={draftIsEmpty || isPredicting}
      >
        clear
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
