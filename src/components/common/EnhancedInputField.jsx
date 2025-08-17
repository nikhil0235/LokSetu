import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';

const EnhancedInputField = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  validation,
  errorMessage,
  successMessage,
  icon,
  style = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  useEffect(() => {
    if (validation && value) {
      const valid = validation(value);
      setIsValid(valid);
      if (!valid) {
        shake();
      }
    }
  }, [value, validation]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', isFocused ? '#5856D6' : (isValid === false ? '#FF3B30' : (isValid === true ? '#34C759' : '#E0E0E0'))],
  });

  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -8],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  return (
    <Animated.View style={[styles.inputGroup, { transform: [{ translateX: shakeAnimation }] }]}>
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <Animated.Text
          style={[
            styles.inputLabel,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: isFocused ? '#5856D6' : (isValid === false ? '#FF3B30' : '#666'),
            },
          ]}
        >
          {label}
        </Animated.Text>
        
        <TextInput
          style={[styles.textInput, style]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize="none"
          accessibilityLabel={label}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
        

      </Animated.View>
      
      {errorMessage && isValid === false && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      
      {successMessage && isValid === true && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
    position: 'relative',
    minHeight: 56,
    justifyContent: 'center',
  },
  inputLabel: {
    position: 'absolute',
    left: 15,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 4,
    fontWeight: '600',
    zIndex: 1,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 24,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeText: {
    fontSize: 20,
  },

  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  successText: {
    color: '#34C759',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default EnhancedInputField;