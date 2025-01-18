import { ParamsDictionary } from 'express-serve-static-core';
import express from 'express';

export interface TypedRequestBody<T> extends express.Request {
  body: T;
  params: ParamsDictionary,
}

export type TypedResponse<T> = Omit<express.Response, 'json' | 'status'> & {
  json(data: T): TypedResponse<T>;
} & {
  status(code: number): TypedResponse<T>;
};

export interface ErrorResponse {
  error: string;
  details?: string | string[];
}

export type ControllerHandler = (
  req: express.Request,
  res: express.Response
) => void | Promise;

export type ControllerTypedHandler<T, R, U> = (
  req: TypedRequestBody<T>,
  res: express.Response<R>
) => Promise<U>;