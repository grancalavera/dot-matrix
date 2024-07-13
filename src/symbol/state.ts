import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import {
  catchError,
  defer,
  first,
  from,
  interval,
  map,
  merge,
  of,
  scan,
  startWith,
  switchMap,
} from "rxjs";
import * as aiService from "../ai/service";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import { coinFlip, randomInt } from "../lib/random";
import * as model from "./model";
import * as symbolService from "./service";

type SymbolState = {
  draft: model.SymbolDescription;
  clipboard: model.SymbolData;
  isPredicting: boolean;
};

const defaultState: SymbolState = {
  draft: model.defaultSymbolDescription(),
  clipboard: model.emptySymbol(),
  isPredicting: false,
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

const [flipH$, flipSymbolH] = createSignal();
export { flipSymbolH };

const [flipV$, flipSymbolV] = createSignal();
export { flipSymbolV };

const [rotate$, rotateSymbol] = createSignal();
export { rotateSymbol };

const [predict$, predictSymbol] = createSignal<string>();
export { predictSymbol };

export const [useSymbol, symbol$] = bind(symbolService.symbol$);

const loadSymbol$ = openSymbol$.pipe(
  startWith(model.defaultSymbolId),
  switchMap((id) => {
    const load$ = symbolService.symbol$(id);
    const reload$ = reset$.pipe(switchMap(() => load$));
    return merge(load$, reload$);
  })
);

const predictionResult$ = predict$.pipe(
  switchMap((id) => symbol$(id).pipe(first())),
  switchMap((symbol) =>
    from(aiService.predict(symbol.id)).pipe(
      catchError((error) => {
        console.warn("prediction failed:", { symbol: symbol, error });
        return of(symbol);
      })
    )
  )
);

const state$ = state(
  mergeWithKey({
    togglePixel$,
    clear$,
    invert$,
    fill$,
    loadSymbol$,
    copy$,
    replace$,
    paste$,
    flipH$,
    flipV$,
    rotate$,
    predict$,
    predictionResult$,
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
        case "loadSymbol$": {
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
        case "flipH$": {
          return { ...current, draft: model.horizontalFlipSymbol(draft) };
        }
        case "flipV$": {
          return { ...current, draft: model.verticalFlipSymbol(draft) };
        }
        case "rotate$": {
          return { ...current, draft: model.rotate180Symbol(draft) };
        }
        case "predict$": {
          return { ...current, isPredicting: true };
        }
        case "predictionResult$": {
          return { ...current, draft: signal.payload, isPredicting: false };
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

export const [useIsPredicting, isPredicting$] = bind(
  state$.pipe(map((state) => state.isPredicting))
);

export const [useIsSymbolSelected] = bind((id: string) =>
  symbolDraft$.pipe(map((draft) => draft.id === id))
);

export const [useSelectedSymbolId] = bind(symbolDraft$.pipe(map((x) => x.id)));

export const [useSymbolDraftPixelValue] = bind((index: number) =>
  defer(() => {
    const random = () => coinFlip(0.3);

    const randomValue$ = interval(randomInt(100, 500)).pipe(
      map(random),
      startWith(random())
    );

    const actualValue$ = symbolDraft$.pipe(
      map((draft) => draft.data.get(index) ?? false)
    );

    return isPredicting$.pipe(
      startWith(false),
      switchMap((isPredicting) => (isPredicting ? randomValue$ : actualValue$))
    );
  })
);

export const [useSymbolPixelValue] = bind((id: string, index: number) => {
  return symbolService.symbol$(id).pipe(
    map((symbol) => symbol.data.get(index) ?? false),
    startWith(false)
  );
});

export const useSaveSymbolMutation = () =>
  useMutation(symbolService.saveSymbol);

export const [useIsSymbolDraftModified] = bind(
  symbolDraft$.pipe(
    switchMap((draft) =>
      symbolService
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
