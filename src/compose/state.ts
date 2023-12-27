import { bind, state } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import {
  combineLatest,
  distinctUntilChanged,
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
  tap,
} from "rxjs";
import { assertNever } from "../lib/assertNever";
import { symbol$, symbolChanged$ } from "../symbol/state";
import {
  advancePlayhead,
  formatCharCount,
  isValidMessageLength,
  sanitizeMessage,
} from "./model";

export {
  clearMessage,
  pauseMessage,
  playMessage,
  setMessage,
  useIsEmptyMessage,
  useIsPlayingMessage,
  useIsUnderPlayhead,
  useMessage,
  useMessageCharCount,
  usePlayhead,
  useScreenBufferSymbol,
};

const [setMessage$, setMessage] = createSignal<string>();
const [clear$, clearMessage] = createSignal();
const [play$, playMessage] = createSignal();
const [pause$, pauseMessage] = createSignal();

const [useMessage, message$] = bind(
  mergeWithKey({ setMessage$, clear$ }).pipe(
    scan((buffer, signal) => {
      switch (signal.type) {
        case "setMessage$": {
          return isValidMessageLength(signal.payload)
            ? sanitizeMessage(signal.payload)
            : buffer;
        }
        case "clear$": {
          return "";
        }
        default:
          assertNever(signal);
      }
    }, ""),
    startWith("")
  )
);

const [useMessageCharCount] = bind(
  message$.pipe(map((message) => formatCharCount(message.length)))
);

const [useIsEmptyMessage] = bind(
  message$.pipe(map((message) => message === ""))
);

const [useScreenBufferSymbol] = bind((index: number) =>
  message$.pipe(map((message) => message[index]))
);

const [useIsPlayingMessage] = bind(
  merge(play$.pipe(map(() => true)), pause$.pipe(map(() => false))).pipe(
    startWith(false)
  )
);

const [usePlayhead, playhead$] = bind(
  mergeWithKey({
    advance$: play$.pipe(
      switchMap(() => {
        const stop$ = merge(pause$, clear$);
        return interval(500).pipe(takeUntil(stop$));
      })
    ),
    rewind$: clear$,
  }).pipe(
    scan(
      (playhead, signal) => (signal.type === "advance$" ? playhead + 1 : 0),
      0
    ),
    startWith(0),
    map(advancePlayhead)
  )
);

const [useIsUnderPlayhead] = bind((index: number) =>
  playhead$.pipe(map((playhead) => playhead === index))
);

const buffer$ = state(
  combineLatest([message$, symbolChanged$.pipe(startWith(""))]).pipe(
    distinctUntilChanged(),
    switchMap(([message]) => {
      const symbols = message.split("");

      if (symbols.length === 0) {
        return of([]);
      }

      return forkJoin(
        symbols.map((symbol) => symbol$(symbol).pipe(first()))
      ).pipe(first());
    }),
    map((symbols) => symbols.flatMap((symbol) => [...symbol.data.values()]))
  )
);

export const [useScreenPixelValue] = bind((index: number) =>
  buffer$.pipe(
    map((buffer) => buffer[index] ?? false),
    startWith(false)
  )
);
