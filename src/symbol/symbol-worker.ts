import { get, set } from "idb-keyval";
import { assertNever } from "../lib/assertNever";
import {
  createLoadSymbolCompleteResponse,
  createLoadSymbolErrorResponse,
  createLoadSymbolUpdateResponse,
  createSaveSymbolCompleteResponse,
  createSaveSymbolErrorResponse,
  SymbolRequest,
  SymbolResponse,
} from "./symbol-protocol-v2";
import { emptySymbol, SymbolData, SymbolDescription } from "./model";
import { defaultSymbols } from "./default-symbols";

const $ = self as unknown as SharedWorkerGlobalScope;

$.onconnect = (e) => {
  const port = e.ports[0];

  if (!port) {
    return;
  }

  port.start();

  port.onmessage = async (e: MessageEvent<SymbolRequest>) => {
    const message = e.data;

    switch (message.kind) {
      case "saveSymbol": {
        let response: SymbolResponse;

        try {
          await set(message.body.id, message.body.data);
          response = createSaveSymbolCompleteResponse(message.correlationId);
        } catch (error) {
          response = createSaveSymbolErrorResponse(
            message.correlationId,
            error
          );
        }

        port.postMessage(response);
        break;
      }

      case "loadSymbol": {
        try {
          const data = await loadSymbol(message.body);
          const update = createLoadSymbolUpdateResponse(
            message.correlationId,
            data
          );
          const complete = createLoadSymbolCompleteResponse(
            message.correlationId
          );
          port.postMessage(update);
          port.postMessage(complete);
        } catch (error) {
          port.postMessage(
            createLoadSymbolErrorResponse(message.correlationId, error)
          );
        }
        break;
      }

      default: {
        assertNever(message);
      }
    }
  };
};

const loadSymbol = async (id: string): Promise<SymbolDescription> => {
  const data = await get<SymbolData | undefined>(id);
  return { id, data: data ?? defaultSymbols[id] ?? emptySymbol() };
};
