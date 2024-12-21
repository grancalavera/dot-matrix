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
  const { promise, reject, resolve } = Promise.withResolvers<void>();

  const message = createSaveSymbolRequest(symbol);

  function handler(e: MessageEvent<SymbolResponse>) {
    let response: void;

    const { data } = e;

    if (
      data.correlationId !== message.correlationId ||
      data.kind !== "saveSymbol"
    ) {
      return;
    }

    worker.port.removeEventListener("message", handler);

    if (data.body.kind === "E") {
      reject(data.body.error);
    }

    if (data.body.kind === "N") {
      response = data.body.value;
    }

    if (data.body.kind === "C") {
      // here, in the case where the response is not void, we would have to
      // check we do actually have a value, if not we reject the promise
      resolve(response);
    }
  }

  worker.port.addEventListener("message", handler);
  worker.port.postMessage(message);

  return promise;
}
