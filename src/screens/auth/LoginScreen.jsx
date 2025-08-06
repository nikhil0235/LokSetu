import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/base';
import { loginUser } from '../../store/slices/authSlice';

const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { loading, errors } = useAppSelector(state => state.auth);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    try {
      const result = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(result)) {
        onLoginSuccess();
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LokSetu Login</Text>
      
      <View style={styles.credentialsInfo}>
        <Text style={styles.infoTitle}>Demo Credentials:</Text>
        <Text style={styles.infoText}>admin / admin123</Text>
        <Text style={styles.infoText}>user1 / user123</Text>
        <Text style={styles.infoText}>user2 / user456</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errors.login && (
        <Text style={styles.errorText}>{errors.login}</Text>
      )}

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
        disabled={loading.login}
      >
        {loading.login ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1976d2',
  },
  credentialsInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: '#1976d2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default LoginScreen;