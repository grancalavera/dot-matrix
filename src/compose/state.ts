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
} from "rxjs";
import { assertNever } from "../lib/assertNever";
import { symbols } from "../symbol/model";
import { symbol$, symbolChanged$ } from "../symbol/state";
import {
  advancePlayhead,
  formatCharCount,
  isValidMessageLength,
  sanitizeMessage,
  screenCharWidth,
  screenFrequency,
  screenPixelValue,
} from "./model";

export {
  clearMessage,
  pauseMessage,
  playMessage,
  rewindMessage,
  setMessage,
  useIsEmptyMessage,
  useIsPixelUnderPlayhead,
  useIsPlayingMessage,
  useMessage,
  useMessageCharCount,
  usePlayhead,
  useScreenBufferSymbol,
};

const [setMessage$, setMessage] = createSignal<string>();
const [clear$, clearMessage] = createSignal();
const [play$, playMessage] = createSignal();
const [pause$, pauseMessage] = createSignal();
const [rewind$, rewindMessage] = createSignal();

const defaultMessage = symbols.join("");

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
    }, defaultMessage),
    startWith(defaultMessage)
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
  merge(
    play$.pipe(map(() => true)),
    merge(pause$, rewind$).pipe(map(() => false))
  ).pipe(startWith(false))
);

const [usePlayhead, playhead$] = bind(
  mergeWithKey({
    advance$: play$.pipe(
      switchMap(() => {
        const stop$ = merge(pause$, clear$, rewind$);
        return interval(screenFrequency).pipe(takeUntil(stop$));
      })
    ),
    rewind$: merge(clear$, rewind$),
  }).pipe(
    scan(
      (playhead, signal) => (signal.type === "advance$" ? playhead + 1 : 0),
      0
    ),
    startWith(0),
    map(advancePlayhead)
  )
);

const [useIsPixelUnderPlayhead] = bind((index: number) =>
  playhead$.pipe(map((playhead) => playhead === index))
);

const buffer$ = state(
  combineLatest([message$, symbolChanged$.pipe(startWith(""))]).pipe(
    distinctUntilChanged(),
    switchMap(([message]) => {
      if (message.length === 0) {
        return of([]);
      }

      const symbols = message
        .padEnd(message.length + screenCharWidth, " ")
        .split("");

      return forkJoin(
        symbols.map((symbol) => symbol$(symbol).pipe(first()))
      ).pipe(first());
    }),
    map((symbols) => symbols.flatMap((symbol) => [...symbol.data.values()]))
  )
);

export const [useScreenPixelValue] = bind((index: number) =>
  combineLatest([buffer$, playhead$]).pipe(
    map(([buffer, playhead]) => screenPixelValue(index, buffer, playhead)),
    startWith(false)
  )
);
