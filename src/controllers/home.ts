import { Request, Response } from 'express';

/**
 * Home page.
 * @route GET /
 */
export const index = (req: Request, res: Response): Response => {

  console.log("got a HOME GET req")
  return res.status(200).json({ error: 'false' });
};
