import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({ 
  title, 
  onPress, 
  colors = ['#4A90E2', '#357ABD'], 
  disabled = false,
  loading = false,
  style = {} 
}) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, disabled ? styles.buttonDisabled : null, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <LinearGradient colors={colors} style={styles.buttonGradient}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default GradientButton;