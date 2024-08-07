import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  first,
  forkJoin,
  interval,
  map,
  merge,
  of,
  scan,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs";
import { assertNever } from "../lib/assertNever";
import { symbol$, symbolChanged$ } from "../symbol/state";
import {
  advancePlayhead,
  bufferFromSymbolDescriptions,
  bufferSymbols,
  defaultMessage,
  formatCharCount,
  isValidMessageLength,
  sanitizeMessage,
  screenFrequency,
  screenPixelValue,
} from "./model";

const [setMessage$, setMessage] = createSignal<string>();
export { setMessage };

const [clear$, clearMessage] = createSignal();
export { clearMessage };

const [play$, playMessage] = createSignal();
export { playMessage };

const [pause$, pauseMessage] = createSignal();
export { pauseMessage };

const [rewind$, rewindMessage] = createSignal();
export { rewindMessage };

const [invert$, invertMessage] = createSignal();
export { invertMessage };

export const [useMessage, message$] = bind(
  mergeWithKey({ setMessage$, clear$ }).pipe(
    scan((message, signal) => {
      switch (signal.type) {
        case "setMessage$": {
          return isValidMessageLength(signal.payload)
            ? sanitizeMessage(signal.payload)
            : message;
        }
        case "clear$": {
          return "";
        }
        default:
          assertNever(signal);
      }
    }, defaultMessage),
    startWith(defaultMessage)
  )
);

export const [useMessageCharCount] = bind(
  message$.pipe(map((message) => formatCharCount(message.length)))
);

export const [useIsEmptyMessage] = bind(
  message$.pipe(map((message) => message === ""))
);

export const [useScreenBufferSymbol] = bind((index: number) =>
  message$.pipe(map((message) => message[index]))
);

const messageCleared$: Observable<void> = message$.pipe(
  filter((message) => message === ""),
  map(() => undefined)
);

const stop$ = merge(pause$, clear$, rewind$, messageCleared$);

export const [useIsPlayingMessage] = bind(
  mergeWithKey({ play$, stop$ }).pipe(
    map((signal) => signal.type === "play$"),
    startWith(false)
  )
);

export const [usePlayhead, playhead$] = bind(
  mergeWithKey({
    advance$: play$.pipe(
      switchMap(() => interval(screenFrequency).pipe(takeUntil(stop$)))
    ),
    rewind$: merge(clear$, rewind$, messageCleared$),
  }).pipe(
    scan(
      (playhead, signal) => (signal.type === "advance$" ? playhead + 1 : 0),
      0
    ),
    startWith(0),
    map(advancePlayhead)
  )
);

const buffer$ = state(
  combineLatest([message$, symbolChanged$.pipe(startWith(""))]).pipe(
    distinctUntilChanged(),
    switchMap(([message]) =>
      message.length === 0
        ? of([])
        : forkJoin(
            bufferSymbols(message).map((symbol) =>
              symbol$(symbol).pipe(first())
            )
          ).pipe(first())
    ),
    map(bufferFromSymbolDescriptions)
  )
);

export const [useScreenPixelValue] = bind((index: number) =>
  combineLatest([
    buffer$,
    playhead$,
    invert$.pipe(
      scan((value) => !value, false),
      startWith(false)
    ),
  ]).pipe(
    map(([buffer, playhead, invert]) => {
      const value = screenPixelValue(index, buffer, playhead);
      return invert ? !value : value;
    }),
    startWith(false)
  )
);
