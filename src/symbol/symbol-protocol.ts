import { ObservableNotification } from "rxjs";
import { SymbolDescription } from "./model";
import { nanoid } from "nanoid";

export type SymbolRequest = SaveSymbolRequest | LoadSymbolRequest;
export type SymbolResponse = SaveSymbolResponse | LoadSymbolResponse;

// -------------------------------------
//
// save
//
// -------------------------------------

export type SaveSymbolRequest = RequestEvent<"saveSymbol", SymbolDescription>;
export type SaveSymbolResponse = ResponseEvent<"saveSymbol">;

export function createSaveSymbolRequest(
  symbol: SymbolDescription
): SaveSymbolRequest {
  return createRequest("saveSymbol", symbol);
}

export function createSaveSymbolCompleteResponse(
  correlationId: string
): SaveSymbolResponse {
  return createCompleteResponse("saveSymbol", correlationId);
}

export function createSaveSymbolErrorResponse(
  correlationId: string,
  error: unknown
): SaveSymbolResponse {
  return createErrorResponse("saveSymbol", correlationId, error);
}

// -------------------------------------
//
// load
//
// -------------------------------------

export type LoadSymbolRequest = RequestEvent<"loadSymbol", string>;
export type LoadSymbolResponse = ResponseEvent<"loadSymbol", SymbolDescription>;

export function createLoadSymbolRequest(id: string): LoadSymbolRequest {
  return createRequest("loadSymbol", id);
}

export function createLoadSymbolUpdateResponse(
  correlationId: string,
  symbol: SymbolDescription
): LoadSymbolResponse {
  return createUpdateResponse("loadSymbol", correlationId, symbol);
}

// -----------------------------------------------------------------------------
//
// Protocol
//
// -----------------------------------------------------------------------------

type RequestEvent<TKind extends string, TBody = void> = {
  kind: TKind;
  correlationId: string;
  body: TBody;
};

type ResponseEvent<TKind extends string, TBody = void> = {
  kind: TKind;
  correlationId: string;
  body: ObservableNotification<TBody>;
};

function createRequest<TKind extends string, TBody>(
  kind: TKind,
  body: TBody
): RequestEvent<TKind, TBody> {
  const correlationId = nanoid();
  return { kind, correlationId, body };
}

function createUpdateResponse<TKind extends string, TBody>(
  kind: TKind,
  correlationId: string,
  body: TBody
): ResponseEvent<TKind, TBody> {
  return createResponse(kind, correlationId, { kind: "N", value: body });
}

function createCompleteResponse<TKind extends string>(
  kind: TKind,
  correlationId: string
): ResponseEvent<TKind> {
  return createResponse(kind, correlationId, { kind: "C" });
}

function createErrorResponse<TKind extends string>(
  kind: TKind,
  correlationId: string,
  error: unknown
): ResponseEvent<TKind> {
  return createResponse(kind, correlationId, { kind: "E", error });
}

function createResponse<TKind extends string, TBody>(
  kind: TKind,
  correlationId: string,
  body: ObservableNotification<TBody>
): ResponseEvent<TKind, TBody> {
  return { kind, correlationId, body };
}
