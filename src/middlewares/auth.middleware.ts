import type { Request, Response } from 'express';

export const protect = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'You are not Login!' });
  }
};
