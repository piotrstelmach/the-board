import { validateRequestInput } from '../validateRequestInput';
import { TypedRequestBody } from '../../types/global';
import { ZodSchema, ZodError } from 'zod';
import { Request } from 'express';

type RequestMockType = {
  name: string;
  email: string;
};

describe('validateRequestInput Middleware', () => {
  let res: any;
  let next: jest.Mock;
  let req: TypedRequestBody<RequestMockType>;
  let schema: ZodSchema;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    req = {
      body: {
        name: 'John Doe',
        email: 'myexample@gmail.com',
      },
      params: {},
    } as Request;
    schema = {
      parseAsync: jest.fn().mockResolvedValue(req.body),
    } as any;
  });

  it('should validate request input successfully', async () => {
    await validateRequestInput(schema)(req, res, next);

    expect(schema.parseAsync).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 if validation fails', async () => {
    schema.parseAsync = jest.fn().mockRejectedValue(new ZodError([]));

    await validateRequestInput(schema)(req, res, next);

    expect(schema.parseAsync).toHaveBeenCalledWith(req.body);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation error',
      details: '',
    });
  });

  it('should return 400 if request type error occurs', async () => {
    schema.parseAsync = jest.fn().mockRejectedValue(new Error());

    await validateRequestInput(schema)(req, res, next);

    expect(schema.parseAsync).toHaveBeenCalledWith(req.body);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Request type error' });
  });
});