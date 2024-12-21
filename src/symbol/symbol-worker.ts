import { set } from "idb-keyval";
import { assertNever } from "../lib/assertNever";
import {
  createSaveSymbolCompleteResponse,
  createSaveSymbolErrorResponse,
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
        // let response: SymbolResponse;

        // try {
        //   const data = await get(message.id);
        //   response = createLoadSymbolResponseSuccess(
        //     message.correlationId,
        //     data
        //   );
        // } catch (error) {
        //   response = createLoadSymbolResponseFailure(
        //     message.correlationId,
        //     error
        //   );
        // }

        // port.postMessage(response);
        break;
      }

      default: {
        assertNever(message);
      }
    }
  };
};
