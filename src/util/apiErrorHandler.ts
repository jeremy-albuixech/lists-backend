import { Response, Request } from 'express';
import logger from './logger';

export type ApiError = {
  name: string;
  message: string;
};

export const apiErrorHandler = async (
  err: ApiError,
  req: Request,
  res: Response,
): Promise<Response> => {
  let statusCode: number;
  let returnMessage = '';
  switch (err.name) {
    case 'CastError':
      statusCode = 400;
      returnMessage = 'Something went wrong with the provided parameters.';
      break;
    case 'validationError':
      statusCode = 400;
      returnMessage = 'Missing or incorrect parameters.';
      break;
    default:
      statusCode = 500;
      break;
  }
  logger.error(err.message);
  res.status(statusCode);
  return res.json({ error: true, message: returnMessage });
};
