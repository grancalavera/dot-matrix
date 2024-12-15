import { SymbolDescription } from "./model";
import { createSaveSymbolRequest, SymbolResponse } from "./symbol-protocol";

const worker = new SharedWorker(
  new URL("./symbol-worker.ts", import.meta.url),
  {
    type: "module",
    name: "symbol-worker",
    credentials: "same-origin",
  }
);

// https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/start
worker.port.start();

export async function saveSymbol(symbol: SymbolDescription): Promise<void> {
  let resolve: () => void;
  let reject: (error: unknown) => void;

  const result = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const message = createSaveSymbolRequest(symbol);

  function handler(e: MessageEvent<SymbolResponse>) {
    const { data } = e;

    if (data.correlationId !== message.correlationId) {
      return;
    }

    worker.port.removeEventListener("message", handler);

    if (data.error) {
      reject(data.error);
    } else {
      resolve();
    }
  }

  worker.port.addEventListener("message", handler);
  worker.port.postMessage(message);
  return result;
}
