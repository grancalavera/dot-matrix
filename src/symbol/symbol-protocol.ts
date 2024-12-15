import { nanoid } from "nanoid";
import { SymbolDescription } from "./model";

export type SymbolRequest = SaveSymbolRequest;
export type SymbolResponse = SaveSymbolResponse;

export type SaveSymbolRequest = {
  type: "saveSymbol";
  correlationId: string;
  symbol: SymbolDescription;
};

export type SaveSymbolResponse = {
  type: "saveSymbol";
  correlationId: string;
  error?: unknown;
};

export function createSaveSymbolRequest(
  symbol: SymbolDescription
): SaveSymbolRequest {
  return {
    correlationId: nanoid(),
    type: "saveSymbol",
    symbol,
  };
}

export function createSaveSymbolResponse(
  correlationId: string,
  error?: unknown
): SaveSymbolResponse {
  return {
    correlationId,
    type: "saveSymbol",
    error,
  };
}
