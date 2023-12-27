import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { concat, first, map, merge, scan, startWith, switchMap } from "rxjs";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import * as model from "./model";
import * as service from "./service";

const [openSymbol$, editSymbol] = createSignal<string>();
export { editSymbol };

const [togglePixel$, toggleSymbolPixel] = createSignal<number>();
export { toggleSymbolPixel };

const [clear$, clearSymbolDraft] = createSignal();
export { clearSymbolDraft };

const [reset$, resetSymbolEdits] = createSignal();
export { resetSymbolEdits };

const [invert$, invertSymbol] = createSignal();
export { invertSymbol };

const [fill$, fillSymbol] = createSignal();
export { fillSymbol };

export const [useSymbol, symbol$] = bind(service.symbol$);

export const [useSymbolDraft, symbolDraft$] = bind(
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

export const [useIsSymbolSelected] = bind((id: string) =>
  symbolDraft$.pipe(map((draft) => draft.id === id))
);

export const [useIsSymbolDraftPixelOn] = bind((index: number) =>
  symbolDraft$.pipe(map((draft) => draft.data.get(index) ?? false))
);

export const [useSymbolPixelValue] = bind((id: string, index: number) => {
  return service.symbol$(id).pipe(
    map((symbol) => symbol.data.get(index) ?? false),
    startWith(false)
  );
});

export const useSaveSymbolMutation = () => useMutation(service.saveSymbol);

export const [useIsSymbolDraftModified] = bind(
  symbolDraft$.pipe(
    switchMap((draft) =>
      service
        .symbol$(draft.id)
        .pipe(map((original) => model.isModified(original.data, draft.data)))
    )
  )
);

export const [useIsSymbolDraftEmpty] = bind(
  symbolDraft$.pipe(
    map((draft) => [...draft.data.values()].every((pixel) => !pixel))
  )
);

export const symbolChanged$ = state(
  merge(...model.symbols.map((x) => symbol$(x))).pipe(
    map((symbol) => symbol.id)
  )
);
