'use strict';

import { Response, Request } from 'express';
import { List } from '../models/List';
import { OwlItemM } from '../models/OwlItem';
import { check, validationResult } from 'express-validator';
import { apiErrorHandler } from '../util/apiErrorHandler';
import { ApiError } from '../util/apiErrorHandler';

/**
 * @route GET /lists
 * @returns The lists stored in the database
 */
export const getLists = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    console.log("got a list GET req")
    const lists = await List.find();
    res.status(200);
    return res.json(lists);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  }
};

/**
 * @route POST /lists/
 * @param name: A list name
 * @return The new list OR existing list if name matches an existing list.
 */
export const createList = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  await check('name', 'Name is required')
    .isLength({ min: 1 })
    .escape()
    .run(req);
    console.log("got a list POST req")
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const apiErrorObj: ApiError = {
      name: 'validationError',
      message: 'Invalid or missing arguments',
    };
    return apiErrorHandler(apiErrorObj, req, res);
  }
  const list = new List({
    name: req.body.name,
  });
  try {
    const existingList = await List.findOne({ name: list.name });

    res.status(200);

    if (existingList) {
      return res.json(existingList);
    } else {
      await list.save();
      return res.json(list);
    }
  } catch (error) {
    return apiErrorHandler(error, req, res);
  }
};

/**
 * @route DELETE /lists/:id
 * @param <id>: a List ID
 * @return 200 success if list was deleted
 */
export const deleteList = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    await OwlItemM.deleteOne({ list_id: req.params.id });
    await List.deleteOne({ _id: req.params.id });
  } catch (error) {
    return apiErrorHandler(error, req, res);
  }
  res.status(200);
  return res.json({ success: true });
};
