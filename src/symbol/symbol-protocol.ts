import { SymbolDescription } from "./model";

type MessageType = "request" | "response";

export type MessageEvent<
  TName extends string,
  TType extends MessageType,
  TBody = void
> = {
  name: TName;
  type: TType;
  correlationId: string;
  body: TBody extends void ? never : TBody;
};

export type Req<TName extends string, TParams, TResponse = void> = {
  [name in TName]: (params: TParams) => Promise<TResponse>;
};

export const requests: Req<"loadSymbol", string, SymbolDescription> &
  Req<"saveSymbol", SymbolDescription, void> = {
  loadSymbol: async (id) => {
    return { id, data: [] };
  },
  saveSymbol: async (symbol) => {
    return;
  },
};
