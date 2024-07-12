import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { map, merge, scan, startWith, switchMap } from "rxjs";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import * as model from "./model";
import * as service from "./service";

type SymbolState = {
  draft: model.SymbolDescription;
  clipboard: model.SymbolData;
};

const defaultState: SymbolState = {
  draft: model.defaultSymbolDescription(),
  clipboard: model.emptySymbol(),
};

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

const [copy$, copySymbol] = createSignal();
export { copySymbol };

const [replace$, replaceSymbol] = createSignal();
export { replaceSymbol };

const [paste$, pasteSymbol] = createSignal();
export { pasteSymbol };

export const [useSymbol, symbol$] = bind(service.symbol$);

const state$ = state(
  mergeWithKey({
    togglePixel$,
    clear$,
    invert$,
    fill$,
    symbol$: openSymbol$.pipe(
      startWith(model.defaultSymbolId),
      switchMap((id) => {
        const load$ = service.symbol$(id);
        const reload$ = reset$.pipe(switchMap(() => load$));
        return merge(load$, reload$);
      })
    ),
    copy$,
    replace$,
    paste$,
  }).pipe(
    scan((current, signal) => {
      const draft = current.draft;
      switch (signal.type) {
        case "togglePixel$": {
          draft.data.set(signal.payload, !draft.data.get(signal.payload));
          return { ...current, draft };
        }
        case "clear$": {
          return {
            ...current,
            draft: model.defaultSymbolDescription(draft.id),
          };
        }
        case "symbol$": {
          return { ...current, draft: signal.payload };
        }
        case "invert$": {
          return { ...current, draft: model.invertSymbol(draft) };
        }
        case "fill$": {
          return { ...current, draft: model.fillSymbol(draft) };
        }
        case "copy$": {
          return { ...current, clipboard: model.clone(draft.data) };
        }
        case "replace$": {
          return {
            ...current,
            draft: { ...draft, data: model.clone(current.clipboard) },
          };
        }
        case "paste$": {
          return {
            ...current,
            draft: {
              ...draft,
              data: model.merge(draft.data, current.clipboard),
            },
          };
        }
        default: {
          assertNever(signal);
        }
      }
    }, defaultState)
  )
);

export const [useSymbolDraft, symbolDraft$] = bind(
  state$.pipe(map((state) => state.draft))
);

export const [useIsSymbolSelected] = bind((id: string) =>
  symbolDraft$.pipe(map((draft) => draft.id === id))
);

export const [useSelectedSymbolId] = bind(symbolDraft$.pipe(map((x) => x.id)));

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
