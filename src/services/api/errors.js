export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND'
};

export const getErrorType = (status) => {
  if (status >= 500) return ERROR_TYPES.SERVER_ERROR;
  if (status === 404) return ERROR_TYPES.NOT_FOUND;
  if (status === 403) return ERROR_TYPES.AUTHORIZATION_ERROR;
  if (status === 401) return ERROR_TYPES.AUTHENTICATION_ERROR;
  if (status >= 400) return ERROR_TYPES.VALIDATION_ERROR;
  return ERROR_TYPES.NETWORK_ERROR;
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return {
      message: error.message,
      type: getErrorType(error.status),
      status: error.status,
      details: error.details
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
    type: ERROR_TYPES.NETWORK_ERROR,
    status: null,
    details: null
  };
};