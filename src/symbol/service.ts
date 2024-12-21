import { createSignal } from "@react-rxjs/utils";
import memoize from "lodash/memoize";
import { nanoid } from "nanoid";
import { concat, filter, from, Observable, switchMap } from "rxjs";
import { SymbolDescription, symbols } from "./model";
import * as symbolWorkerClient from "./symbol-worker-client";

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
  invalidate(data.symbolId);
};

const [invalidate$, invalidate] = createSignal<string>();

export const symbol$ = memoize((id: string): Observable<SymbolDescription> => {
  const load$ = from(symbolWorkerClient.loadSymbol(id));

  const reload$ = invalidate$.pipe(
    filter((candidate) => candidate === id),
    switchMap(() => symbolWorkerClient.loadSymbol(id))
  );

  return concat(load$, reload$);
});

export const saveSymbol = async ({
  id,
  data,
}: SymbolDescription): Promise<void> => {
  await symbolWorkerClient.saveSymbol({ id, data });
  invalidate(id);
  broadcastSymbolChange(id);
};

export const exportSymbols = async (): Promise<string> => {
  const serialized = Object.fromEntries(
    await Promise.all(
      symbols.map(async (id) => {
        const symbol = await symbolWorkerClient.loadSymbol(id);
        return [symbol.id, symbol.data] as const;
      })
    )
  );
  return JSON.stringify(serialized, null, 2);
};
