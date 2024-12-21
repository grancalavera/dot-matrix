import { SymbolDescription } from "./model";
import {
  createLoadSymbolRequest,
  createSaveSymbolRequest,
  SymbolResponse,
} from "./symbol-protocol";

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

export async function loadSymbol(id: string): Promise<SymbolDescription> {
  let resolved = false;
  const { promise, reject, resolve } =
    Promise.withResolvers<SymbolDescription>();

  const message = createLoadSymbolRequest(id);

  function handler(event: MessageEvent<SymbolResponse>) {
    const { data } = event;

    if (
      data.correlationId !== message.correlationId ||
      data.kind !== "loadSymbol"
    ) {
      return;
    }

    worker.port.removeEventListener("message", handler);

    if (data.body.kind === "E") {
      reject(data.body.error);
    }

    if (data.body.kind === "N") {
      resolved = true;
      resolve(data.body.value);
    }

    if (data.body.kind === "C" && !resolved) {
      reject(new Error("EmptyError: no elements in sequence"));
    }
  }

  worker.port.addEventListener("message", handler);
  worker.port.postMessage(message);

  return promise;
}

export async function saveSymbol(symbol: SymbolDescription): Promise<void> {
  const { promise, reject, resolve } = Promise.withResolvers<void>();

  const message = createSaveSymbolRequest(symbol);

  function handler(event: MessageEvent<SymbolResponse>) {
    let response: void;

    const { data } = event;

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
