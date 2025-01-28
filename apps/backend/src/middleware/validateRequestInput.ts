import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { TypedRequestBody } from '../types/global';
import { NextFunction, Response, Request } from 'express';

type validateRequestBodyType = <T>(
  schema: ZodSchema
) => (
  req: TypedRequestBody<T>,
  res: Response,
  next: NextFunction
) => Promise<void>;

type validateRequestParamsType = (
  schema: ZodSchema
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const validateRequestInput: validateRequestBodyType =
  <T>(schema: ZodSchema) =>
  async (
    req: TypedRequestBody<T>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        ...req.body,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors.map((err: ZodIssue) => err.message).join(),
        });
        return;
      } else {
        res.status(400).json({ error: 'Request type error' });
        return;
      }
    }
  };

export const validateRequestParams: validateRequestParamsType =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        ...req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors.map((err: ZodIssue) => err.message).join(),
        });
        return;
      } else {
        res.status(400).json({ error: 'Request type error' });
        return;
      }
    }
  };
