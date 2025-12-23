interface ErrorDetails {
  field: string;
  message: string;
  value?: string | number | boolean;
}
export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details?: ErrorDetails[];

  constructor(
    message: string,
    statusCode: number,
    errorCode: string = 'INTERNAL_ERROR',
    details?: ErrorDetails[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}
