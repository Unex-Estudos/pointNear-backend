import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const parsedRequest = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!parsedRequest.success) {
      return next(parsedRequest.error);
    }

    request.body = parsedRequest.data.body ?? request.body;
    request.params = parsedRequest.data.params ?? request.params;
    request.query = parsedRequest.data.query ?? request.query;
    return next();
  };
}
