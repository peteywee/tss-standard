import { AppError } from "@/core/errors/AppError";
import { createLogger } from "@/services/logger";

export abstract class BaseService {
  protected readonly logger = createLogger(this.constructor.name);

  protected async execute<T>(operation: () => Promise<T>, context?: string): Promise<T> {
    const start = performance.now();

    try {
      this.logger.debug("Operation started", { context });
      const result = await operation();
      const durationMs = Math.round(performance.now() - start);
      this.logger.debug("Operation completed", { context, durationMs });
      return result;
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      this.logger.error("Operation failed", {
        context,
        durationMs,
        error: err instanceof Error ? err.message : String(err),
      });

      throw this.handleError(err);
    }
  }

  protected handleError(error: unknown): AppError {
    if (error instanceof AppError) return error;

    if (error instanceof Error) {
      return AppError.internal(error.message);
    }

    return AppError.internal("Unknown error");
  }
}
