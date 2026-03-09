import type { Request, Response, NextFunction } from 'express';
import { type ZodObject, ZodError } from 'zod';
import { InternalServerError, UnprocessableEntityError } from '../utils/errors.js';
import type { $ZodIssue } from 'zod/v4/core';

function formatZodIssue(issue: $ZodIssue): { field: string; message: string } | { field: string; message: string }[] {
  // "unrecognized_keys" and similar put the key names in issue.keys

  if (issue.code === 'unrecognized_keys') {
    return issue.keys.map((key) => ({
      field: key,
      message: `Unrecognized field: ${key}`,
    }));
  }

  const field =
    'keys' in issue && Array.isArray(issue.keys) && issue.keys.length > 0
      ? issue.keys.join(', ')
      : issue.path.length > 0
      ? String(issue.path[issue.path.length - 1])
      : 'Unknown field';
  return {
    field: field ?? 'unknown field',
    message: issue.message,
  };
}

export const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = schema.parse(req.body);
    console.log('Validated data', validatedData);

    // Validate the data and assign only allowed fields to the request body
    req.body = validatedData;
    next(); // Data is valid, go to the next function
  } catch (error) {
    if (error instanceof ZodError) {
      console.log('Errors', error);

      const mappedErrors = error.issues.map(formatZodIssue).flat();
      throw new UnprocessableEntityError('Validation error', mappedErrors);
    }

    throw new InternalServerError('Internal Server Error');
  }
};
