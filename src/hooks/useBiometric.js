import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Mock biometric service - replace with react-native-biometrics in production
const BiometricService = {
  async isAvailable() {
    // Simulate biometric availability check
    return Promise.resolve(true);
  },
  
  async authenticate(reason) {
    // Simulate biometric authentication
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Biometric Authentication',
        reason || 'Use your fingerprint or face to authenticate',
        [
          {
            text: 'Cancel',
            onPress: () => reject(new Error('User cancelled')),
            style: 'cancel',
          },
          {
            text: 'Simulate Success',
            onPress: () => resolve({ success: true }),
          },
          {
            text: 'Simulate Failure',
            onPress: () => reject(new Error('Authentication failed')),
          },
        ]
      );
    });
  }
};

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const available = await BiometricService.isAvailable();
      setIsAvailable(available);
    } catch (error) {
      setIsAvailable(false);
    }
  };

  const authenticate = async (reason) => {
    if (!isAvailable) {
      throw new Error('Biometric authentication not available');
    }

    setIsLoading(true);
    try {
      const result = await BiometricService.authenticate(reason);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAvailable,
    isLoading,
    authenticate,
    checkAvailability,
  };
};