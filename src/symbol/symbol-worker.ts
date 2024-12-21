import { get, set } from "idb-keyval";
import { assertNever } from "../lib/assertNever";
import {
  createLoadSymbolResponseFailure,
  createLoadSymbolResponseSuccess,
  createSaveSymbolResponse,
  SymbolRequest,
  SymbolResponse,
} from "./symbol-protocol";

const $ = self as unknown as SharedWorkerGlobalScope;

$.onconnect = (e) => {
  const port = e.ports[0];

  if (!port) {
    return;
  }

  port.start();

  port.onmessage = async (e) => {
    const message: SymbolRequest = e.data;

    switch (message.type) {
      case "saveSymbol": {
        let response: SymbolResponse;

        try {
          await set(message.symbol.id, message.symbol.data);
          response = createSaveSymbolResponse(message.correlationId);
        } catch (error) {
          response = createSaveSymbolResponse(message.correlationId, error);
        }

        port.postMessage(response);
        break;
      }

      case "loadSymbol": {
        let response: SymbolResponse;

        try {
          const data = await get(message.id);
          response = createLoadSymbolResponseSuccess(
            message.correlationId,
            data
          );
        } catch (error) {
          response = createLoadSymbolResponseFailure(
            message.correlationId,
            error
          );
        }

        port.postMessage(response);
        break;
      }

      default: {
        assertNever(message);
      }
    }
  };
};
