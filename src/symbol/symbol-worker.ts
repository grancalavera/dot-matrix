import { assertNever } from "../lib/assertNever";
import { SymbolDescription } from "./model";
import { createSaveSymbolResponse, SymbolRequest } from "./symbol-protocol";

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
        try {
          await saveSymbol(message.symbol);
        } catch (error) {
          port.postMessage(
            createSaveSymbolResponse(message.correlationId, error)
          );
        }
        break;
      }
      default: {
        assertNever(message.type);
      }
    }
  };
};

async function saveSymbol({ id, data }: SymbolDescription): Promise<void> {}
