import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => issue.message);

        return res.status(400).json({
          status: 'error',
          code: 4000,
          message: errorMessages.length > 1 ? errorMessages : errorMessages[0],
          details: error.issues,
        });
      }
      next(error);
    }
  };
};
