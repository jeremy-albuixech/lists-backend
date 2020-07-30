import { Request, Response } from 'express';

/**
 * Home page.
 * @route GET /
 */
export const index = (req: Request, res: Response): Response => {
  return res.status(200).json({ error: 'false' });
};
