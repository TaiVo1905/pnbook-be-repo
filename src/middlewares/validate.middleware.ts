import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { BadRequestError } from '../core/apiError.js';

export const validate =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => {
          const field = issue.path.join('.');
          return `${field}: ${issue.message}`;
        });

        next(new BadRequestError(errorMessages.join(', ')));
      } else {
        next(error);
      }
    }
  };
