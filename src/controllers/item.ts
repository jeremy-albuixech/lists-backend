'use strict';

import { Response, Request } from 'express';
import { OwlItemM } from '../models/OwlItem';
import { List } from '../models/List';
import { check, validationResult } from 'express-validator';
import { OwlItem } from 'owl-types/types/OwlItem';
import { OwlItems } from 'owl-types/types/OwlItems';
import { apiErrorHandler } from '../util/apiErrorHandler';
import { ApiError } from '../util/apiErrorHandler';
/**
 * @route GET /item/:id
 * @param <list-id>: a List ID
 * @return The items of the List ID provided
 */
export const getItems = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const items = await OwlItemM.findOne({ list_id: req.params.id });
    res.status(200);
    return res.json(items);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  }
};

/**
 * @route DELETE /item/:id
 * @param <id>: an OwlItems ID
 * @return 200 success if item was deleted
 */
export const deleteItem = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  await check('id', 'id is required').isLength({ min: 1 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const apiErrorObj: ApiError = {
      name: 'validationError',
      message: 'Invalid or missing arguments',
    };
    return apiErrorHandler(apiErrorObj, req, res);
  }
  try {
    await OwlItemM.deleteOne({ _id: req.params.id });
  } catch (error) {
    return apiErrorHandler(error, req, res);
  }
  res.status(200);
  return res.json({ success: true });
};

/**
 * @route PUT /item/
 * @param owlItems: A list items array
 * @return The list items
 */
export const addOrUpdateItemToList = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  await check('list_id', 'list_id is required').isLength({ min: 1 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const apiErrorObj: ApiError = {
      name: 'validationError',
      message: 'Invalid or missing arguments',
    };
    return apiErrorHandler(apiErrorObj, req, res);
  }
  const newOwlItem = {
    items: req.body.items,
    list_id: req.body.list_id,
  };

  try {
    await List.findOne({ _id: req.body.list_id });
  } catch (error) {
    return apiErrorHandler(error, req, res);
  }
  if (newOwlItem.items && newOwlItem.items.length > 0) {
    newOwlItem.items.forEach((item: OwlItem) => {
      item.status = 'saved';
    });
  }
  const search = req.body.id
    ? { _id: req.body.id }
    : { list_id: req.body.list_id };
  // Mongoose updateOne with the upsert = true option will create the document if no document matching the ID is found.
  try {
    await OwlItemM.updateOne(search, newOwlItem, { upsert: true });
    const savedItems: OwlItems = await OwlItemM.findOne({
      list_id: newOwlItem.list_id,
    });
    res.status(200);
    return res.json(savedItems);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  }
};
