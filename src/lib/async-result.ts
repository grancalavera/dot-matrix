export type AsyncResult<T> =
  | AsyncIdle
  | AsyncLoading
  | AsyncSuccess<T>
  | AsyncFailure;

type AsyncIdle = {
  kind: "AsyncIdle";
};

type AsyncLoading = {
  kind: "AsyncLoading";
};

type AsyncSuccess<T> = {
  kind: "AsyncSuccess";
  value: T;
};

type AsyncFailure = {
  kind: "AsyncFailure";
  error: Error;
};

export function success<T = void>(): AsyncResult<T>;
export function success<T>(value: T): AsyncResult<T>;
export function success<T = void>(value?: T): AsyncResult<T | void> {
  return { kind: "AsyncSuccess", value };
}

export function failure<T>(error: Error): AsyncResult<T> {
  return { kind: "AsyncFailure", error };
}

export const isFailure = <T>(
  candidate: AsyncResult<T>
): candidate is AsyncFailure => candidate.kind === "AsyncFailure";

export const isSuccess = <T>(
  candidate: AsyncResult<T>
): candidate is AsyncSuccess<T> => candidate.kind === "AsyncSuccess";

export const idle: AsyncIdle = { kind: "AsyncIdle" };

export const isIdle = <T>(candidate: AsyncResult<T>): candidate is AsyncIdle =>
  candidate.kind === "AsyncIdle";

export const isLoading = <T>(
  candidate: AsyncResult<T>
): candidate is AsyncLoading => candidate.kind === "AsyncLoading";

export const loading: AsyncLoading = { kind: "AsyncLoading" };
