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
        <Text style={styles.tagline}>Trusted by Election Commission of India</Text>
        <View style={styles.trustBadge}>
          <Text style={styles.trustText}>✓ Secure</Text>
          <Text style={styles.trustText}>✓ Verified</Text>
          <Text style={styles.trustText}>✓ Official</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 45,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '600',
    marginBottom: 10,
  },
  trustBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  trustText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
  },
});

export default AppHeader;