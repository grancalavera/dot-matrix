import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { Observable, map, scan, startWith, switchMap } from "rxjs";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import {
  SymbolDescription,
  defaultSymbolDescription,
  defaultSymbolId,
} from "./model";
import * as service from "./service";

export {
  clearSymbolDraft,
  editSymbol,
  toggleSymbolPixel,
  useIsSymbolDraftPixelOn as useIsPixelOn,
  useIsSymbolPixelOn,
  useIsSymbolSelected,
  useSaveSymbolMutation,
  useSymbol,
  useSymbolDraft,
};

const [openSymbol$, editSymbol] = createSignal<string>();
const [togglePixel$, toggleSymbolPixel] = createSignal<number>();
const [clear$, clearSymbolDraft] = createSignal();

const [useSymbol] = bind(service.symbol$);

const symbolDraft$: Observable<SymbolDescription> = state(
  mergeWithKey({
    togglePixel$,
    clear$,
    symbol$: openSymbol$.pipe(
      startWith(defaultSymbolId),
      switchMap((id) => service.symbol$(id))
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
        default: {
          assertNever(signal);
        }
      }
    }, defaultSymbolDescription())
  )
);

const [useSymbolDraft] = bind(() => symbolDraft$);

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
