
// components/common/LoginCard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const LoginCard = ({ children }) => {
  return (
    <View style={styles.loginCard}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: -20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
});

export default LoginCard;
