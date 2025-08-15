/**
 * Centralized error handling utilities
 */

export const handleApiError = (error) => {
  try {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        type: 'server_error'
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        type: 'network_error'
      };
    } else {
      // Other error
      return {
        message: 'An unexpected error occurred',
        type: 'unknown_error'
      };
    }
  } catch (e) {
    return {
      message: 'Error handling failed',
      type: 'handler_error'
    };
  }
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return encodeURIComponent(input);
};

export const validateInput = (input, type) => {
  switch (type) {
    case 'phone':
      return /^\d{10}$/.test(input);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'epic_id':
      return /^[A-Z]{3}\d{7}$/.test(input);
    default:
      return true;
  }
};