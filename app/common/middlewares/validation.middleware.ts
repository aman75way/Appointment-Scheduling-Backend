import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';


/**
 * Validates the request body against a given Joi schema.
 *
 * If the validation fails, a 400 response with a JSON object
 * containing the validation error details is sent. Otherwise,
 * the request is forwarded to the next middleware.
 *
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @return {(req: Request, res: Response, next: NextFunction) => void} - A middleware
 * function that validates the request body and sends a response
 * or forwards the request to the next middleware depending on the
 * validation result.
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation failed', details: error.details });
    }
    next();
  };
};
