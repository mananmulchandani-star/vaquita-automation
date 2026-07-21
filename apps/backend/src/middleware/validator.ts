import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, AnyZodObject } from 'zod';

export const validate = (schema: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema } | AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if ('parse' in schema && typeof schema.parse === 'function') {
        const parsed = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params
        });
        if (parsed.body !== undefined) req.body = parsed.body;
        if (parsed.query !== undefined) req.query = parsed.query;
        if (parsed.params !== undefined) req.params = parsed.params;
      } else {
        const s = schema as { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema };
        if (s.body) {
          req.body = s.body.parse(req.body);
        }
        if (s.query) {
          req.query = s.query.parse(req.query);
        }
        if (s.params) {
          req.params = s.params.parse(req.params);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new Error('Validation failed'));
      }
    }
  };
};
