// components/common/AppHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AppHeader = () => {
  return (
    <LinearGradient
      colors={['#FF6B35', '#F7931E', '#FFB85C']}
      style={styles.header}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>🇮🇳</Text>
        </View>
        <Text style={styles.appName}>LokSetu</Text>
        <Text style={styles.appNameHindi}>लोक सेतु</Text>
        <Text style={styles.tagline}>India's Digital Election Engine</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 30,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appNameHindi: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default AppHeader;