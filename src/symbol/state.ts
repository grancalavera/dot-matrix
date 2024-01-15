import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import {
  defer,
  firstValueFrom,
  interval,
  map,
  merge,
  scan,
  startWith,
  switchMap,
} from "rxjs";
import * as aiService from "../ai/service";
import { assertNever } from "../lib/assertNever";
import { useMutation } from "../lib/mutation";
import { coinFlip, randomInt } from "../lib/random";
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

const [replace$, replaceSymbolDraft] = createSignal<model.SymbolDescription>();
export { replaceSymbolDraft };

const [isPredicting$, setIsPredicting] = createSignal<boolean>();

export const [useSymbol, symbol$] = bind(service.symbol$);

export const [useSymbolDraft, symbolDraft$] = bind(
  mergeWithKey({
    togglePixel$,
    clear$,
    invert$,
    fill$,
    replace$,
    symbol$: openSymbol$.pipe(
      startWith(model.defaultSymbolId),
      switchMap((id) => {
        const read$ = service.symbol$(id);
        return merge(read$, reset$.pipe(switchMap(() => read$)));
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
        case "replace$": {
          return signal.payload;
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

export const usePredictSymbolMutation = () =>
  useMutation(async (symbol: string): Promise<model.SymbolDescription> => {
    setIsPredicting(true);
    let prediction = await firstValueFrom(symbol$(symbol));
    try {
      prediction = await aiService.predict(symbol);
    } catch (error) {
      console.warn("prediction failed:", { symbol, error });
    }
    setIsPredicting(false);
    return prediction;
  });
