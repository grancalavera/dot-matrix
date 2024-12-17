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
  tap,
} from "rxjs";
import * as aiService from "../ai/service";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import { coinFlip, randomInt } from "../lib/random";
import * as model from "./model";
import * as symbolService from "./service";

type SymbolState = {
  draft: model.SymbolDescription;
  clipboard?: model.SymbolData;
  isPredicting: boolean;
};

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
const [predict$, predictSymbol] = createSignal<string>();
const [changeSymbol$, changeSymbol] = createSignal<string>();

export {
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
  changeSymbol,
};

export const symbolState$ = state(
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
        togglePixel$,
        clear$,
        invert$,
        fill$,
        copy$,
        replace$,
        paste$,
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
              draft.data.set(signal.payload, !draft.data.get(signal.payload));
              return { ...current, draft };
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
            case "copy$": {
              return { ...current, clipboard: model.clone(draft.data) };
            }
            case "replace$": {
              if (!current.clipboard) {
                return current;
              }

              return {
                ...current,
                draft: { ...draft, data: model.clone(current.clipboard) },
              };
            }
            case "paste$": {
              if (!current.clipboard) {
                return current;
              }

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
  symbolState$.pipe(map((state) => state.draft))
);

export const [useIsPredicting, isPredicting$] = bind(
  symbolState$.pipe(map((state) => state.isPredicting))
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
  merge(...model.symbols.map((x) => symbolService.symbol$(x))).pipe(
    map((symbol) => symbol.id)
  )
);
