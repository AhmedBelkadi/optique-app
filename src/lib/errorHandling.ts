import { env } from '@/lib/env';

export enum ErrorCode {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  
  // Product errors
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_CREATE_FAILED = 'PRODUCT_CREATE_FAILED',
  PRODUCT_UPDATE_FAILED = 'PRODUCT_UPDATE_FAILED',
  PRODUCT_DELETE_FAILED = 'PRODUCT_DELETE_FAILED',
  
  // Category errors
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  CATEGORY_CREATE_FAILED = 'CATEGORY_CREATE_FAILED',
  CATEGORY_UPDATE_FAILED = 'CATEGORY_UPDATE_FAILED',
  CATEGORY_DELETE_FAILED = 'CATEGORY_DELETE_FAILED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // System errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export const ErrorMessages = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password. Please try again.',
  [ErrorCode.AUTH_SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
  [ErrorCode.AUTH_UNAUTHORIZED]: 'You are not authorized to perform this action.',
  
  [ErrorCode.PRODUCT_NOT_FOUND]: 'The requested product could not be found.',
  [ErrorCode.PRODUCT_CREATE_FAILED]: 'Failed to create the product. Please try again.',
  [ErrorCode.PRODUCT_UPDATE_FAILED]: 'Failed to update the product. Please try again.',
  [ErrorCode.PRODUCT_DELETE_FAILED]: 'Failed to delete the product. Please try again.',
  
  [ErrorCode.CATEGORY_NOT_FOUND]: 'The requested category could not be found.',
  [ErrorCode.CATEGORY_CREATE_FAILED]: 'Failed to create the category. Please try again.',
  [ErrorCode.CATEGORY_UPDATE_FAILED]: 'Failed to update the category. Please try again.',
  [ErrorCode.CATEGORY_DELETE_FAILED]: 'Failed to delete the category. Please try again.',
  
  [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorCode.INVALID_INPUT]: 'The provided data is invalid.',
  
  [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again later.',
  [ErrorCode.ENCRYPTION_ERROR]: 'A security error occurred. Please try again.',
  [ErrorCode.FILE_UPLOAD_ERROR]: 'Failed to upload the file. Please try again.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again later.',
} as const;

export function createError(code: ErrorCode, message?: string, statusCode?: number): AppError {
  const userMessage = message || ErrorMessages[code];
  const httpStatus = statusCode || getDefaultStatusCode(code);
  
  return new AppError(userMessage, code, httpStatus);
}

function getDefaultStatusCode(code: ErrorCode): number {
  switch (code) {
    case ErrorCode.AUTH_INVALID_CREDENTIALS:
    case ErrorCode.AUTH_UNAUTHORIZED:
      return 401;
    case ErrorCode.AUTH_SESSION_EXPIRED:
      return 403;
    case ErrorCode.PRODUCT_NOT_FOUND:
    case ErrorCode.CATEGORY_NOT_FOUND:
      return 404;
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.INVALID_INPUT:
      return 400;
    default:
      return 500;
  }
}

export function logError(error: Error | AppError, context?: Record<string, any>): void {
  const isAppError = error instanceof AppError;
  const logData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: isAppError ? error.code : undefined,
    statusCode: isAppError ? error.statusCode : undefined,
    isOperational: isAppError ? error.isOperational : false,
    context,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  };

  if (env.NODE_ENV === 'production') {
    // In production, log to external service (Sentry, etc.)
    console.error('Application Error:', JSON.stringify(logData, null, 2));
  } else {
    // In development, log with more detail
    console.error('Application Error:', logData);
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    logError(error);
    return createError(ErrorCode.UNKNOWN_ERROR, error.message);
  }
  
  const unknownError = new Error('Unknown error occurred');
  logError(unknownError);
  return createError(ErrorCode.UNKNOWN_ERROR);
} 