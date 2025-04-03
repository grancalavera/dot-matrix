import { SymbolDescription } from "./model";
import {
  createLoadSymbolRequest,
  createSaveSymbolRequest,
  SymbolResponse,
} from "./symbol-protocol-v2";

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

// this way we can append one type into another
type Pure<T, U = T> = (next: T) => U;
type App<T, U = T> = (current: U, next: T) => U;
const empty = Symbol("empty");
type Empty = typeof empty;

// obviously this function can throw either when calling pure or append
function makeAppend<T, U = T>(
  pure: Pure<T, U>,
  app: App<T, U>,
  initial?: () => U
) {
  let current: U | Empty = empty;

  function append(next: T): U {
    if (current === empty) {
      current = initial ? initial() : pure(next);
      return current;
    }

    current = app(current, next);
    return current;
  }

  return append;
}

const pureMono = <T>(value: T) => value;
const appMono = <T>(_: T, next: T) => next;
export const mono = makeAppend(pureMono, appMono);

const pureList = <T>(value: T) => [value];
const appList = <T>(current: T[], next: T) => [...current, next];
export const list = makeAppend(pureList, appList, () => []);

const pureSet = <T>(value: T) => new Set([value]);
const appSet = <T>(current: Set<T>, next: T) => current.add(next);
export const set = makeAppend(pureSet, appSet, () => new Set());

export async function loadSymbol(id: string): Promise<SymbolDescription> {
  const { promise, reject, resolve } =
    Promise.withResolvers<SymbolDescription>();

  const message = createLoadSymbolRequest(id);
  let response: Empty | SymbolDescription = empty;

  function handler(event: MessageEvent<SymbolResponse>) {
    const { data } = event;

    if (
      data.correlationId !== message.correlationId ||
      data.kind !== "loadSymbol"
    ) {
      return;
    }

    if (data.body.kind === "E") {
      reject(data.body.error);
      return;
    }

    if (data.body.kind === "N") {
      response = mono(data.body.value);
      return;
    }

    if (data.body.kind === "C") {
      if (response === empty) {
        reject(new Error("No value received"));
        return;
      }

      resolve(response);
      return;
    }
  }

  worker.port.addEventListener("message", handler);
  worker.port.postMessage(message);

  const result = await promise;
  worker.port.removeEventListener("message", handler);

  return result;
}

export async function saveSymbol(symbol: SymbolDescription): Promise<void> {
  const { promise, reject, resolve } = Promise.withResolvers<void>();

  const message = createSaveSymbolRequest(symbol);
  let response: Empty | void = empty;

  function handler(event: MessageEvent<SymbolResponse>) {
    const { data } = event;

    if (
      data.correlationId !== message.correlationId ||
      data.kind !== "saveSymbol"
    ) {
      return;
    }

    if (data.body.kind === "E") {
      reject(data.body.error);
      return;
    }

    if (data.body.kind === "N") {
      response = mono(data.body.value);
      return;
    }

    if (data.body.kind === "C") {
      response = data.isVoid ? undefined : response;

      if (response === empty) {
        reject(new Error("No value received"));
        return;
      }

      resolve(response);
      return;
    }
  }

  worker.port.addEventListener("message", handler);
  worker.port.postMessage(message);
  const result = await promise;

  worker.port.removeEventListener("message", handler);
  return result;
}
