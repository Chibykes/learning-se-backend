/**
 * Base App Error
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: Record<string, string>[] | undefined = undefined
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Bad Request
 * Use for: Validation errors, malformed JSON, or invalid input logic.
 */
export class BadRequestError extends AppError {
  constructor(message = "The request could not be understood or was invalid.") {
    super(400, message);
  }
}

/**
 * 401 - Unauthorized
 * Use for: Missing or invalid Authentication (JWT/API Keys).
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication is required to access this resource.") {
    super(401, message);
  }
}

/**
 * 403 - Forbidden
 * Use for: Authenticated users who don't have permission for a specific action.
 */
export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super(403, message);
  }
}

/**
 * 404 - Not Found
 * Use for: Missing database records or incorrect URL paths.
 */
export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.") {
    super(404, message);
  }
}

/**
 * 409 - Conflict
 * Use for: Duplicate entries (e.g., "Email already exists").
 */
export class ConflictError extends AppError {
  constructor(
    message = "A conflict occurred with the current state of the resource."
  ) {
    super(409, message);
  }
}

/**
 * 422 - Unprocessable Entity
 * Use for: Validation errors (e.g., "Invalid email format").
 */
export class UnprocessableEntityError extends AppError {
  constructor(
    message = "The request was well-formed but was unable to be followed due to semantic errors.",
    errors: Record<string, string>[] | undefined = undefined
  ) {
    super(422, message, errors);
  }
}

/**
 * 429 - Too Many Requests
 * Use for: Rate limiting.
 */
export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(429, message);
  }
}

/**
 * 500 - Internal Server Error
 * Use for: Unexpected code failures or database crashes.
 */
export class InternalServerError extends AppError {
  constructor(message = "An unexpected error occurred on our end.") {
    super(500, message);
  }
}
