import { useState, useCallback, useMemo } from 'react';

export const useForm = (initialValues, validationSchema, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    if (!validationSchema[name]) return '';
    
    const rules = validationSchema[name];
    
    if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return rules.required;
    }
    
    if (rules.minLength && value && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }
    
    if (rules.pattern && value && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }
    
    if (rules.custom && value) {
      return rules.custom(value, values);
    }
    
    return '';
  }, [validationSchema, values]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationSchema]);

  const handleChange = useMemo(() => {
    const changeHandlers = {};
    
    return (name, value) => {
      if (!changeHandlers[name]) {
        changeHandlers[name] = (val) => {
          setValues(prev => ({ ...prev, [name]: val }));
        };
      }
      changeHandlers[name](value);
    };
  }, []);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  const handleSubmit = useCallback(async () => {
    setTouched(Object.keys(validationSchema).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, validationSchema]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldError: (field, error) => setErrors(prev => ({ ...prev, [field]: error }))
  };
};