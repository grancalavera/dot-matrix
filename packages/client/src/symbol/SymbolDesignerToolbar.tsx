import { useTransition } from "react";
import { Button, Toolbar } from "../components";
import * as symbolService from "./service";
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
  useIsAiAvailable,
  useIsPredicting,
  useIsSymbolDraftEmpty,
  useIsSymbolDraftModified,
  useSymbolDraft,
} from "./state";

export const SymbolDesignerToolbar = () => (
  <Toolbar className="symbol-designer-toolbar">
    <SymbolDesignerActions />
  </Toolbar>
);

export const SymbolDesignerActions = () => {
  const draft = useSymbolDraft();
  const draftIsEmpty = useIsSymbolDraftEmpty();
  const draftIsModified = useIsSymbolDraftModified();
  const isPredicting = useIsPredicting();
  const isAiAvailable = useIsAiAvailable();

  const [, startSaveTransition] = useTransition();
  const [, startExportTransition] = useTransition();

  const handleSave = () => {
    if (!draft) return;
    startSaveTransition(() => symbolService.saveSymbol(draft));
  };

  const handleExport = () => {
    startExportTransition(async () => {
      const data = await symbolService.exportSymbols();
      const element = document.createElement("a");
      const file = new Blob([data], {
        type: "application/json",
      });
      element.href = URL.createObjectURL(file);
      element.download = "symbols.json";
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  };

  return (
    <>
      <Button
        divider
        onClick={() => handleExport()}
        disabled={isPredicting || draftIsModified}
      >
        e
      </Button>
      {isAiAvailable && (
        <Button divider onClick={() => predictSymbol()} disabled={isPredicting}>
          ai
        </Button>
      )}
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
        disabled={!draftIsModified || isPredicting}
      >
        reset
      </Button>
      <Button
        onClick={() => handleSave()}
        disabled={!draftIsModified || isPredicting || !draft}
        primary
      >
        save
      </Button>
    </>
  );
};
