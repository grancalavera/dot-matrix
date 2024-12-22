import { ObservableNotification } from "rxjs";
import { SymbolDescription } from "./model";
import { nanoid } from "nanoid";

// -----------------------------------------------------------------------------
//
// Protocol
//
// -----------------------------------------------------------------------------

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
  return createCompleteResponse("saveSymbol", correlationId, true);
}

export function createSaveSymbolErrorResponse(
  correlationId: string,
  error: unknown
): SaveSymbolResponse {
  return createErrorResponse("saveSymbol", correlationId, error, true);
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
  return createUpdateResponse("loadSymbol", correlationId, symbol, false);
}

export function createLoadSymbolCompleteResponse(
  correlationId: string
): LoadSymbolResponse {
  return createCompleteResponse("loadSymbol", correlationId, false);
}

export function createLoadSymbolErrorResponse(
  correlationId: string,
  error: unknown
): LoadSymbolResponse {
  return createErrorResponse("loadSymbol", correlationId, error, false);
}

// -----------------------------------------------------------------------------
//
// Abstract
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
  isVoid: IsVoid<TBody>;
};

type IsVoid<T> = T extends void ? true : false;

// -------------------------------------
//
// Helpers
//
// -------------------------------------

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
  body: TBody,
  isVoid: IsVoid<TBody>
): ResponseEvent<TKind, TBody> {
  return createResponse(
    kind,
    correlationId,
    {
      kind: "N",
      value: body,
    },
    isVoid
  );
}

function createCompleteResponse<TKind extends string, TBody = void>(
  kind: TKind,
  correlationId: string,
  isVoid: IsVoid<TBody>
): ResponseEvent<TKind, TBody> {
  return createResponse(kind, correlationId, { kind: "C" }, isVoid);
}

function createErrorResponse<TKind extends string, TBody = void>(
  kind: TKind,
  correlationId: string,
  error: unknown,
  isVoid: IsVoid<TBody>
): ResponseEvent<TKind, TBody> {
  return createResponse(kind, correlationId, { kind: "E", error }, isVoid);
}

function createResponse<TKind extends string, TBody>(
  kind: TKind,
  correlationId: string,
  body: ObservableNotification<TBody>,
  isVoid: IsVoid<TBody>
): ResponseEvent<TKind, TBody> {
  return { kind, correlationId, body, isVoid };
}
