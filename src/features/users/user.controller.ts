import type { Request, Response } from "express";
import { createUserService, getAllUserService } from "./user.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const user = await getAllUserService();
  return res.status(200).json(user);
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const newUser = await createUserService(req.body);
  res.status(200).json(newUser);
});
