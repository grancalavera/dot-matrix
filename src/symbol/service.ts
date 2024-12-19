import { createSignal } from "@react-rxjs/utils";
import memoize from "lodash/memoize";
import { nanoid } from "nanoid";
import { concat, defer, filter, from, Observable, switchMap } from "rxjs";
import { fromBinaryString, toBinaryString } from "./mapper";
import { emptySymbol, SymbolDescription } from "./model";

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

  if (binaryString === null) {
    return { id, data: emptySymbol() };
  }

  return fromBinaryString(id, binaryString);
};

export const saveSymbol = async ({
  id,
  data,
}: SymbolDescription): Promise<void> => {
  localStorage.setItem(id, toBinaryString(data));
  invalidate(id);
  broadcastSymbolChange(id);
};
