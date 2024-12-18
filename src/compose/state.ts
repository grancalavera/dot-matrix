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
import { symbolChanged$ } from "../symbol/state";
import {
  advancePlayHead,
  bufferFromSymbolDescriptions,
  bufferSymbols,
  defaultMessage,
  formatCharCount,
  isValidMessageLength,
  sanitizeMessage,
  screenFrequency,
  screenPixelValue,
} from "./model";
import * as symbolService from "../symbol/service";

const [setMessage$, setMessage] = createSignal<string>();
const [clear$, clearMessage] = createSignal();
const [play$, playMessage] = createSignal();
const [pause$, pauseMessage] = createSignal();
const [rewind$, rewindMessage] = createSignal();
const [invert$, invertMessage] = createSignal();

export {
  setMessage,
  clearMessage,
  playMessage,
  pauseMessage,
  rewindMessage,
  invertMessage,
};

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

export const [usePlayHead, playHead$] = bind(
  mergeWithKey({
    advance$: play$.pipe(
      switchMap(() => interval(screenFrequency).pipe(takeUntil(stop$)))
    ),
    rewind$: merge(clear$, rewind$, messageCleared$),
  }).pipe(
    scan(
      (playHead, signal) => (signal.type === "advance$" ? playHead + 1 : 0),
      0
    ),
    startWith(0),
    map(advancePlayHead)
  )
);

export const buffer$ = state(
  combineLatest([message$, symbolChanged$.pipe(startWith(""))]).pipe(
    distinctUntilChanged(),
    switchMap(([message]) =>
      message.length === 0
        ? of([])
        : forkJoin(
            bufferSymbols(message).map((symbol) =>
              symbolService.symbol$(symbol).pipe(first())
            )
          ).pipe(first())
    ),
    map(bufferFromSymbolDescriptions)
  )
);

export const [useScreenPixelValue] = bind((index: number) =>
  combineLatest([
    buffer$,
    playHead$,
    invert$.pipe(
      scan((value) => !value, false),
      startWith(false)
    ),
  ]).pipe(
    map(([buffer, playHead, invert]) => {
      const value = screenPixelValue(index, buffer, playHead);
      return invert ? !value : value;
    }),
    startWith(false)
  )
);
