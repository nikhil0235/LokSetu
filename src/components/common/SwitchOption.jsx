
// components/common/SwitchOption.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SwitchOption = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.switchOption} onPress={onPress}>
      <Text style={styles.switchText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchOption: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  switchText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SwitchOption;
