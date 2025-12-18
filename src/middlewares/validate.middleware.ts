import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod/v3";
import { catchAsync } from "../utils/catchAsync.js";

export const validate = (schema: AnyZodObject) => {
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({ body: req.body });
    next();
  });
};
