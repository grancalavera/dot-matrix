import { createSignal } from "@react-rxjs/utils";
import memoize from "lodash/memoize";
import { nanoid } from "nanoid";
import { concat, defer, filter, from, Observable, switchMap } from "rxjs";
import { fromBinaryString, toBinaryString } from "./mapper";
import { emptySymbol, SymbolDescription, symbols } from "./model";
import { defaultSymbols } from "./default-symbols";

const clientId = nanoid(4);

type ServiceMessage = {
  clientId: string;
  symbolId: string;
};

const channel = new BroadcastChannel("symbol");

const broadcastSymbolChange = (symbolId: string) => {
  const message: ServiceMessage = { clientId, symbolId };
  channel.postMessage(message);
};

channel.onmessage = ({ data }: MessageEvent<ServiceMessage>) => {
  if (data.clientId !== clientId) invalidate(data.symbolId);
};

const [invalidate$, invalidate] = createSignal<string>();

export const symbol$ = memoize(
  (id: string): Observable<SymbolDescription> =>
    defer(() => {
      const load$ = from(loadSymbol(id));

      const reload$ = invalidate$.pipe(
        filter((candidate) => candidate === id),
        switchMap(() => loadSymbol(id))
      );

      return concat(load$, reload$);
    })
);

const loadSymbol = async (id: string): Promise<SymbolDescription> => {
  const binaryString = localStorage.getItem(id);

  if (typeof binaryString === "string") {
    return fromBinaryString(id, binaryString);
  }

  const defaultSymbolData = defaultSymbols[id];

  if (defaultSymbolData !== undefined) {
    return { id, data: defaultSymbolData };
  }

  return { id, data: emptySymbol() };
};

export const saveSymbol = async ({
  id,
  data,
}: SymbolDescription): Promise<void> => {
  localStorage.setItem(id, toBinaryString(data));
  invalidate(id);
  broadcastSymbolChange(id);
};

export const exportSymbols = async (): Promise<string> => {
  const serialized = Object.fromEntries(
    await Promise.all(
      symbols.map(async (id) => {
        const symbol = await loadSymbol(id);
        return [symbol.id, symbol.data] as const;
      })
    )
  );
  return JSON.stringify(serialized, null, 2);
};
