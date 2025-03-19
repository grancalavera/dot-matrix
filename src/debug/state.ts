import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { map, merge, startWith } from "rxjs";

export { disableDebug, enableDebug };

const [enable$, enableDebug] = createSignal();
const [disable$, disableDebug] = createSignal();

const [useIsDebugEnabled] = bind(
  merge(enable$.pipe(map(() => true)), disable$.pipe(map(() => false))).pipe(
    startWith(false)
  )
);

export { useIsDebugEnabled };
