import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { concat, first, map, scan, startWith, switchMap } from "rxjs";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import {
  defaultSymbolDescription,
  defaultSymbolId,
  isModified,
  transposeSymbolDescription,
} from "./model";
import * as service from "./service";

export {
  clearSymbolDraft,
  editSymbol,
  resetSymbolEdits,
  toggleSymbolPixel,
  transposeSymbol,
  useIsSymbolDraftEmpty,
  useIsSymbolDraftModified,
  useIsSymbolDraftPixelOn,
  useIsSymbolPixelOn,
  useIsSymbolSelected,
  useSaveSymbolMutation,
  useSymbol,
  useSymbolDraft,
};

const [openSymbol$, editSymbol] = createSignal<string>();
const [togglePixel$, toggleSymbolPixel] = createSignal<number>();
const [clear$, clearSymbolDraft] = createSignal();
const [reset$, resetSymbolEdits] = createSignal();
const [transpose$, transposeSymbol] = createSignal();

const [useSymbol] = bind(service.symbol$);

const [useSymbolDraft, symbolDraft$] = bind(
  mergeWithKey({
    togglePixel$,
    clear$,
    transpose$,
    symbol$: openSymbol$.pipe(
      startWith(defaultSymbolId),
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
          return defaultSymbolDescription(draft.id);
        }
        case "symbol$": {
          return signal.payload;
        }
        case "transpose$": {
          return transposeSymbolDescription(draft);
        }
        default: {
          assertNever(signal);
        }
      }
    }, defaultSymbolDescription())
  )
);

const [useIsSymbolSelected] = bind((id: string) =>
  symbolDraft$.pipe(map((draft) => draft.id === id))
);

const [useIsSymbolDraftPixelOn] = bind((index: number) =>
  symbolDraft$.pipe(map((draft) => draft.data.get(index) ?? false))
);

const [useIsSymbolPixelOn] = bind((id: string, index: number) => {
  return service.symbol$(id).pipe(
    map((symbol) => symbol.data.get(index) ?? false),
    startWith(false)
  );
});

const useSaveSymbolMutation = () => useMutation(service.saveSymbol);

const [useIsSymbolDraftModified] = bind(
  symbolDraft$.pipe(
    switchMap((draft) =>
      service
        .symbol$(draft.id)
        .pipe(map((original) => isModified(original.data, draft.data)))
    )
  )
);

const [useIsSymbolDraftEmpty] = bind(
  symbolDraft$.pipe(
    map((draft) => [...draft.data.values()].every((pixel) => !pixel))
  )
);
