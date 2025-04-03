import { nanoid } from "nanoid";
import { errorFromUnknown } from "../lib/errors";
import { failure, Result, success } from "../lib/result";
import { SymbolDescription } from "./model";

export type SymbolRequest = SaveSymbolRequest | LoadSymbolRequest;
export type SymbolResponse = SaveSymbolResponse | LoadSymbolResponse;

export type SaveSymbolRequest = {
  type: "saveSymbol";
  correlationId: string;
  symbol: SymbolDescription;
};

export type SaveSymbolResponse = {
  type: "saveSymbol";
  correlationId: string;
  response: Result<void>;
};

export type LoadSymbolRequest = {
  type: "loadSymbol";
  correlationId: string;
  id: string;
};

export type LoadSymbolResponse = {
  type: "loadSymbol";
  correlationId: string;
  response: Result<SymbolDescription>;
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
    response: error ? failure(errorFromUnknown(error)) : success(),
  };
}

export function createLoadSymbolRequest(id: string): LoadSymbolRequest {
  return {
    correlationId: nanoid(),
    type: "loadSymbol",
    id,
  };
}

export function createLoadSymbolResponseSuccess(
  correlationId: string,
  symbol: SymbolDescription
): LoadSymbolResponse {
  return {
    correlationId,
    type: "loadSymbol",
    response: success(symbol),
  };
}

export function createLoadSymbolResponseFailure(
  correlationId: string,
  error: unknown
): LoadSymbolResponse {
  return {
    correlationId,
    type: "loadSymbol",
    response: failure(errorFromUnknown(error)),
  };
}
