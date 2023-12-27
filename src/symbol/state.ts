import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { concat, first, map, scan, startWith, switchMap } from "rxjs";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import * as model from "./model";
import { SymbolDescription } from "./model";
import * as service from "./service";

export {
  clearSymbolDraft,
  editSymbol,
  fillSymbol,
  invertSymbol,
  resetSymbolEdits,
  symbol$,
  symbolChanged$,
  toggleSymbolPixel,
  useIsSymbolDraftEmpty,
  useIsSymbolDraftModified,
  useIsSymbolDraftPixelOn,
  useIsSymbolSelected,
  useSaveSymbolMutation,
  useSymbol,
  useSymbolDraft,
  useSymbolPixelValue,
};

const [openSymbol$, editSymbol] = createSignal<string>();
const [togglePixel$, toggleSymbolPixel] = createSignal<number>();
const [clear$, clearSymbolDraft] = createSignal();
const [reset$, resetSymbolEdits] = createSignal();
const [symbolChanged$, notifySymbolChanged] = createSignal<string>();
const [invert$, invertSymbol] = createSignal();
const [fill$, fillSymbol] = createSignal();

const [useSymbol, symbol$] = bind(service.symbol$);

const [useSymbolDraft, symbolDraft$] = bind(
  mergeWithKey({
    togglePixel$,
    clear$,
    invert$,
    fill$,
    symbol$: openSymbol$.pipe(
      startWith(model.defaultSymbolId),
      switchMap((id) => {
        const read$ = service.symbol$(id).pipe(first());
        return concat(read$, reset$.pipe(switchMap(() => read$)));
      })
    ),
  }).pipe(
    scan((draft, signal) => {
      switch (signal.type) {
        case "togglePixel$": {
          draft.data.set(signal.payload, !draft.data.get(signal.payload));
          return draft;
        }
        case "clear$": {
          return model.defaultSymbolDescription(draft.id);
        }
        case "symbol$": {
          return signal.payload;
        }
        case "invert$": {
          return model.invertSymbol(draft);
        }
        case "fill$": {
          return model.fillSymbol(draft);
        }
        default: {
          assertNever(signal);
        }
      }
    }, model.defaultSymbolDescription())
  )
);

const [useIsSymbolSelected] = bind((id: string) =>
  symbolDraft$.pipe(map((draft) => draft.id === id))
);

const [useIsSymbolDraftPixelOn] = bind((index: number) =>
  symbolDraft$.pipe(map((draft) => draft.data.get(index) ?? false))
);

const [useSymbolPixelValue] = bind((id: string, index: number) => {
  return service.symbol$(id).pipe(
    map((symbol) => symbol.data.get(index) ?? false),
    startWith(false)
  );
});

const useSaveSymbolMutation = () =>
  useMutation(async (symbolDescription: SymbolDescription) => {
    await service.saveSymbol(symbolDescription);
    notifySymbolChanged(symbolDescription.id);
  });

const [useIsSymbolDraftModified] = bind(
  symbolDraft$.pipe(
    switchMap((draft) =>
      service
        .symbol$(draft.id)
        .pipe(map((original) => model.isModified(original.data, draft.data)))
    )
  )
);

const [useIsSymbolDraftEmpty] = bind(
  symbolDraft$.pipe(
    map((draft) => [...draft.data.values()].every((pixel) => !pixel))
  )
);
