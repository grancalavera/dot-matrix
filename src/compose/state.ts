import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { map, scan, startWith } from "rxjs";
import { assertNever } from "../lib/assertNever";
import { isValidMessageLength, sanitizeMessage } from "./model";

export {
  clearMessage,
  setMessage,
  useMessageCharCount,
  useMessge,
  useIsEmptyMessage,
};

const [unsafeMessage$, setMessage] = createSignal<string>();
const [clear$, clearMessage] = createSignal();

const [useMessge, message$] = bind(
  mergeWithKey({ message$: unsafeMessage$, clear$ }).pipe(
    scan((currentMessage, signal) => {
      switch (signal.type) {
        case "message$":
          return isValidMessageLength(signal.payload)
            ? sanitizeMessage(signal.payload)
            : currentMessage;
        case "clear$":
          return "";
        default:
          assertNever(signal);
      }
    }, ""),
    startWith("")
  )
);

const [useMessageCharCount] = bind(
  message$.pipe(
    map((message) => message.length),
    map((count) => count.toString().padStart(2, "0"))
  )
);

const [useIsEmptyMessage] = bind(
  message$.pipe(map((message) => message === ""))
);
