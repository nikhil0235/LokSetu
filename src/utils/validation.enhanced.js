// Enhanced validation utilities with real-time feedback

export const ValidationRules = {
  username: {
    validate: (value) => {
      if (!value) return false;
      if (value.length < 3) return false;
      // Allow alphanumeric, underscore, dot, and hyphen
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      return usernameRegex.test(value);
    },
    errorMessage: 'Username must be at least 3 characters and contain only letters, numbers, dots, underscores, or hyphens',
    successMessage: 'Valid username'
  },

  password: {
    validate: (value) => {
      if (!value) return false;
      if (value.length < 6) return false;
      // At least one letter and one number
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      return hasLetter && hasNumber;
    },
    errorMessage: 'Password must be at least 6 characters with letters and numbers',
    successMessage: 'Strong password'
  },

  phoneNumber: {
    validate: (value) => {
      if (!value) return false;
      // Indian mobile number validation (10 digits, starting with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(value);
    },
    errorMessage: 'Enter a valid 10-digit mobile number',
    successMessage: 'Valid mobile number'
  },

  otp: {
    validate: (value) => {
      if (!value) return false;
      // 6 digit OTP
      const otpRegex = /^\d{6}$/;
      return otpRegex.test(value);
    },
    errorMessage: 'OTP must be 6 digits',
    successMessage: 'Valid OTP'
  },

  email: {
    validate: (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    errorMessage: 'Enter a valid email address',
    successMessage: 'Valid email'
  }
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'No password', color: '#E0E0E0' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  Object.values(checks).forEach(check => {
    if (check) score++;
  });
  
  if (score <= 2) return { strength: 1, label: 'Weak', color: '#FF3B30' };
  if (score <= 3) return { strength: 2, label: 'Fair', color: '#FF9500' };
  if (score <= 4) return { strength: 3, label: 'Good', color: '#34C759' };
  return { strength: 4, label: 'Strong', color: '#007AFF' };
};

export const validateForm = (formData, rules) => {
  const errors = {};
  const isValid = {};
  
  Object.keys(rules).forEach(field => {
    if (formData[field] !== undefined) {
      const rule = ValidationRules[rules[field]];
      if (rule) {
        isValid[field] = rule.validate(formData[field]);
        if (!isValid[field]) {
          errors[field] = rule.errorMessage;
        }
      }
    }
  });
  
  return {
    isValid: Object.values(isValid).every(Boolean),
    errors,
    fieldValidation: isValid
  };
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};