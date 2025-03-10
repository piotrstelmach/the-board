import { ParamsDictionary } from 'express-serve-static-core';
import express from 'express';
import { User } from '@prisma/client';

export interface TypedRequestBody<T> extends express.Request {
  body: T;
  params: ParamsDictionary;
}

export interface TypedRequestQueryParams<T> extends express.Request {
  query: T;
}

export type PaginatedResponse<T> = {
  items: T[];
  next: number | null;
};

export interface TypedRequestBodyAndQuery<T, P> extends express.Request {
  body: T;
  query: P;
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

export type ResultUser = Omit<User, 'password'>;
