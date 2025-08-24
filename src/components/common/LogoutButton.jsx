import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AppIcon } from './';

const LogoutButton = ({ onPress, style, iconSize = 18, showText = false }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.logoutButton, style]}
      activeOpacity={0.7}
    >
      <AppIcon name="logout" size={iconSize} color="#FFFFFF" />
      {showText && <Text style={styles.logoutText}>Logout</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default LogoutButton;