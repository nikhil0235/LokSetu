export const createUserValidation = {
  full_name: {
    required: 'Full name is required',
    minLength: {
      value: 2,
      message: 'Full name must be at least 2 characters'
    }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Please enter a valid 10-digit phone number'
    }
  },
  username: {
    required: 'Username is required',
    minLength: {
      value: 4,
      message: 'Username must be at least 4 characters'
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters'
    }
  },
  confirmPassword: {
    required: 'Please confirm your password',
    custom: (value, values) => {
      if (value !== values.password) {
        return 'Passwords do not match';
      }
      return '';
    }
  },
  assigned_consituencies: {
    required: 'At least one constituency must be assigned',
    custom: (value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return 'At least one constituency must be assigned';
      }
      return '';
    }
  }
};