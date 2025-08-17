import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useApiService } from '../hooks/useApiService';
import { useSelector } from 'react-redux';

const ApiDemo = () => {
  const { user } = useSelector(state => state.auth);
  const [results, setResults] = useState({});
  const {
    loading,
    error,
    getUsers,
    getVoters,
    getStates,
    getDistricts,
    getAssemblyConstituencies,
    getPollingBooths
  } = useApiService();

  const testEndpoint = async (name, apiCall) => {
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [name]: result }));
      Alert.alert('Success', `${name} completed successfully`);
    } catch (err) {
      Alert.alert('Error', `${name} failed: ${err.message}`);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'Admin';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Integration Demo</Text>
      
      {/* Voter Endpoints - Available to all authenticated users */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voter Management (All Users)</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => testEndpoint('Get Voters', () => getVoters())}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Get Voters List</Text>
        </TouchableOpacity>
      </View>

      {/* Admin Only Endpoints */}
      {isAdmin && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Management (Admin Only)</Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => testEndpoint('Get Users', () => getUsers())}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Get All Users</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Information (Admin Only)</Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => testEndpoint('Get States', () => getStates())}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Get States</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => testEndpoint('Get Districts', () => getDistricts('01'))}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Get Districts (State ID: 01)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => testEndpoint('Get Assembly', () => getAssemblyConstituencies('01'))}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Get Assembly Constituencies</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => testEndpoint('Get Booths', () => getPollingBooths('001'))}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Get Polling Booths</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Status Display */}
      <View style={styles.status}>
        {loading && <Text style={styles.loading}>Loading...</Text>}
        {error && <Text style={styles.error}>Error: {error}</Text>}
      </View>

      {/* Results Display */}
      {Object.keys(results).length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>API Results:</Text>
          {Object.entries(results).map(([key, value]) => (
            <View key={key} style={styles.result}>
              <Text style={styles.resultKey}>{key}:</Text>
              <Text style={styles.resultValue}>{JSON.stringify(value, null, 2)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  status: {
    marginVertical: 10
  },
  loading: {
    textAlign: 'center',
    color: '#007bff',
    fontSize: 16
  },
  error: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: 16
  },
  results: {
    marginTop: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  result: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10
  },
  resultKey: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  resultValue: {
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 4
  }
});

export default ApiDemo;