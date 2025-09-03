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
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Email ou mot de passe invalide. Veuillez réessayer.',
  [ErrorCode.AUTH_SESSION_EXPIRED]: 'Votre session a expiré. Veuillez vous reconnecter.',
  [ErrorCode.AUTH_UNAUTHORIZED]: 'Vous n\'êtes pas autorisé à effectuer cette action.',
  
  [ErrorCode.PRODUCT_NOT_FOUND]: 'Le produit demandé n\'a pas pu être trouvé.',
  [ErrorCode.PRODUCT_CREATE_FAILED]: 'Échec de la création du produit. Veuillez réessayer.',
  [ErrorCode.PRODUCT_UPDATE_FAILED]: 'Échec de la mise à jour du produit. Veuillez réessayer.',
  [ErrorCode.PRODUCT_DELETE_FAILED]: 'Échec de la suppression du produit. Veuillez réessayer.',
  
  [ErrorCode.CATEGORY_NOT_FOUND]: 'La catégorie demandée n\'a pas pu être trouvée.',
  [ErrorCode.CATEGORY_CREATE_FAILED]: 'Échec de la création de la catégorie. Veuillez réessayer.',
  [ErrorCode.CATEGORY_UPDATE_FAILED]: 'Échec de la mise à jour de la catégorie. Veuillez réessayer.',
  [ErrorCode.CATEGORY_DELETE_FAILED]: 'Échec de la suppression de la catégorie. Veuillez réessayer.',
  
  [ErrorCode.VALIDATION_ERROR]: 'Veuillez vérifier vos données et réessayer.',
  [ErrorCode.INVALID_INPUT]: 'Les données fournies sont invalides.',
  
  [ErrorCode.DATABASE_ERROR]: 'Une erreur de base de données s\'est produite. Veuillez réessayer plus tard.',
  [ErrorCode.ENCRYPTION_ERROR]: 'Une erreur de sécurité s\'est produite. Veuillez réessayer.',
  [ErrorCode.FILE_UPLOAD_ERROR]: 'Échec du téléchargement du fichier. Veuillez réessayer.',
  [ErrorCode.UNKNOWN_ERROR]: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
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