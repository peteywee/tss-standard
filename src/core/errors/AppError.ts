export type AppErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTEGRATION_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: AppErrorCode,
    statusCode: number,
    isOperational = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message: string, context?: Record<string, unknown>) {
    return new AppError(message, "BAD_REQUEST", 400, true, context);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, "UNAUTHORIZED", 401, true);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, "FORBIDDEN", 403, true);
  }

  static notFound(resource: string, context?: Record<string, unknown>) {
    return new AppError(`${resource} not found`, "NOT_FOUND", 404, true, {
      resource,
      ...context,
    });
  }

  static conflict(message: string, context?: Record<string, unknown>) {
    return new AppError(message, "CONFLICT", 409, true, context);
  }

  static rateLimited(message = "Too many requests") {
    return new AppError(message, "RATE_LIMITED", 429, true);
  }

  static integration(service: string, message: string, context?: Record<string, unknown>) {
    return new AppError(
      `${service} integration error: ${message}`,
      "INTEGRATION_ERROR",
      502,
      true,
      { service, ...context }
    );
  }

  static internal(message = "Internal server error", context?: Record<string, unknown>) {
    return new AppError(message, "INTERNAL_ERROR", 500, false, context);
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        ...(this.context ? { context: this.context } : {}),
      },
    };
  }
}
