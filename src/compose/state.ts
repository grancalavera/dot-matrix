import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { map, scan, startWith } from "rxjs";
import { assertNever } from "../lib/assertNever";
import {
  formatCharCount,
  isValidMessageLength,
  sanitizeMessage,
} from "./model";

export {
  clearMessage,
  setMessage,
  useIsEmptyMessage,
  useMessage,
  useMessageCharCount,
  useScreenBufferSymbol,
};

const [setMessage$, setMessage] = createSignal<string>();
const [clear$, clearMessage] = createSignal();

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
