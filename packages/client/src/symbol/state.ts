import { bind, state, StateObservable } from "@react-rxjs/core";
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
  isPredicting: boolean;
};

type ClipboardState = model.SymbolData | undefined;

const [togglePixel$, toggleSymbolPixel] = createSignal<number>();
const [clear$, clearSymbolDraft] = createSignal();
const [reset$, resetSymbolEdits] = createSignal();
const [invert$, invertSymbol] = createSignal();
const [fill$, fillSymbol] = createSignal();
const [copy$, copySymbol] = createSignal();
const [replace$, replaceSymbol] = createSignal();
const [paste$, pasteSymbol] = createSignal();
const [flipH$, flipSymbolH] = createSignal();
const [flipV$, flipSymbolV] = createSignal();
const [rotate$, rotateSymbol] = createSignal();
const [predict$, predictSymbol] = createSignal();
const [changeSymbol$, changeSymbol] = createSignal<string>();

export {
  changeSymbol,
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
  toggleSymbolPixel,
};

export const clipboard$: StateObservable<ClipboardState> = state(
  copy$.pipe(
    switchMap(() => symbolState$.pipe(first())),
    map((state) => model.clone(state.draft.data)),
    startWith(undefined)
  )
);

export const symbolState$: StateObservable<SymbolState> = state(
  changeSymbol$.pipe(
    switchMap((id) => symbolService.symbol$(id)),
    switchMap((symbol) => {
      const initialState: SymbolState = {
        draft: symbol,
        isPredicting: false,
      };

      const predictionResult$ = predict$.pipe(
        switchMap(() =>
          from(aiService.predict(symbol.id)).pipe(
            catchError((error) => {
              console.warn("prediction failed:", { symbol: symbol, error });
              return of(symbol);
            })
          )
        )
      );

      const signal$ = mergeWithKey({
        reset$: reset$.pipe(
          switchMap(() => symbolService.symbol$(symbol.id).pipe(first()))
        ),
        replace$: replace$.pipe(switchMap(() => clipboard$)),
        paste$: paste$.pipe(switchMap(() => clipboard$)),
        togglePixel$,
        clear$,
        invert$,
        fill$,
        flipH$,
        flipV$,
        rotate$,
        predict$,
        predictionResult$,
      });

      return signal$.pipe(
        scan((current, signal) => {
          const draft = current.draft;

          if (signal.type !== "predictionResult$" && current.isPredicting) {
            return current;
          }

          switch (signal.type) {
            case "togglePixel$": {
              return {
                ...current,
                draft: model.togglePixel(draft, signal.payload),
              };
            }
            case "clear$": {
              return {
                ...current,
                draft: model.defaultSymbolDescription(draft.id),
              };
            }
            case "invert$": {
              return { ...current, draft: model.invertSymbol(draft) };
            }
            case "fill$": {
              return { ...current, draft: model.fillSymbol(draft) };
            }
            case "replace$": {
              const clipboard = signal.payload;
              console.log("replace", clipboard);

              if (!clipboard) {
                return current;
              }

              return {
                ...current,
                draft: { ...draft, data: model.clone(clipboard) },
              };
            }
            case "paste$": {
              const clipboard = signal.payload;

              if (!clipboard) {
                return current;
              }

              return {
                ...current,
                draft: {
                  ...draft,
                  data: model.merge(draft.data, clipboard),
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
            case "reset$": {
              return { ...current, draft: signal.payload };
            }
            default: {
              assertNever(signal);
            }
          }
        }, initialState),
        startWith(initialState)
      );
    })
  )
);

export const [useSymbolDraft, symbolDraft$] = bind(
  symbolState$.pipe(
    map((state) => state.draft),
    startWith(undefined)
  )
);

export const [useIsPredicting, isPredicting$] = bind(
  symbolState$.pipe(
    map((state) => state.isPredicting),
    startWith(false)
  )
);

export const [useIsSymbolSelected] = bind((id: string) =>
  symbolState$.pipe(map((state) => state.draft.id === id))
);

export const [useSelectedSymbolId] = bind(
  symbolState$.pipe(map((state) => state.draft.id))
);

export const [useSymbolDraftPixelValue] = bind((index: number) =>
  defer(() => {
    const random = () => coinFlip(0.3);

    const randomValue$ = interval(randomInt(100, 500)).pipe(
      map(random),
      startWith(random())
    );

    const actualValue$ = symbolState$.pipe(
      map((state) => state.draft.data[index] ?? false)
    );

    return isPredicting$.pipe(
      startWith(false),
      switchMap((isPredicting) => (isPredicting ? randomValue$ : actualValue$))
    );
  })
);

export const [useSymbolPixelValue] = bind((id: string, index: number) => {
  return symbolService.symbol$(id).pipe(
    map((symbol) => symbol.data[index] ?? false),
    startWith(false)
  );
});

export const useSaveSymbolMutation = () =>
  useMutation(symbolService.saveSymbol);

export const [useIsSymbolDraftModified] = bind(
  symbolState$.pipe(
    switchMap((state) =>
      symbolService
        .symbol$(state.draft.id)
        .pipe(
          map((original) => model.isModified(original.data, state.draft.data))
        )
    ),
    startWith(false)
  )
);

export const [useIsSymbolDraftEmpty] = bind(
  symbolState$.pipe(
    map((state) => [...state.draft.data.values()].every((pixel) => !pixel)),
    startWith(true)
  )
);

export const symbolChanged$ = state(
  merge(...model.symbols.map((x) => symbolService.symbol$(x))).pipe(
    map((symbol) => symbol.id)
  )
);
