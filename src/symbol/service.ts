import { createSignal } from "@react-rxjs/utils";
import memoize from "lodash/memoize";
import { concat, defer, filter, map, of } from "rxjs";
import { SymbolDescription, emptySymbol } from "./model";

const [invalidate$, invalidate] = createSignal<string>();

export const symbol$ = memoize((id: string) =>
  defer(() => {
    const reload$ = invalidate$.pipe(
      filter((candidate) => candidate === id),
      map(() => loadSymbol(id))
    );
    return concat(of(loadSymbol(id)), reload$);
  })
);

const loadSymbol = (id: string): SymbolDescription => {
  const binaryString = localStorage.getItem(id);

  if (binaryString === null) {
    return { id, data: emptySymbol() };
  }

  const data = new Map<number, boolean>();
  for (let i = 0; i < binaryString.length; i++) {
    data.set(i, binaryString[i] === "1");
  }

  return { id, data };
};

export const saveSymbol = async ({
  id,
  data,
}: SymbolDescription): Promise<void> => {
  let binaryString = "";
  for (let i = 0; i < data.size; i++) {
    binaryString += data.get(i) ? "1" : "0";
  }
  localStorage.setItem(id, binaryString);
  invalidate(id);
};
