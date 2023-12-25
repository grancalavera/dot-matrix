import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { Observable, map, scan, startWith } from "rxjs";
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
  useIsPixelOn,
  useIsSymbolSelected,
  useSaveSymbolMutation,
  useSymbolDraft,
};

const [openSymbol$, editSymbol] = createSignal<string>();
const [togglePixel$, toggleSymbolPixel] = createSignal<number>();
const [clear$, clearSymbolDraft] = createSignal();

const symbol$ = openSymbol$.pipe(
  startWith(defaultSymbolId),
  map(service.loadSymbol)
);

const symbolDraft$: Observable<SymbolDescription> = state(
  mergeWithKey({
    togglePixel$,
    clear$,
    symbol$,
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

const [useIsPixelOn] = bind((id: number) =>
  symbolDraft$.pipe(map((draft) => draft.data.get(id) ?? false))
);

const useSaveSymbolMutation = () =>
  useMutation(async (symbol: SymbolDescription) => {
    service.saveSymbol(symbol);
    return;
  });
