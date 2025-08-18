import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAdminData } from '../../hooks/useAdminData';

const AdminDashboard = () => {
  const { 
    data, 
    loading, 
    errors, 
    fetchAllData,
    fetchConstituencies,
    fetchBooths,
    fetchUsers,
    fetchVoters 
  } = useAdminData();

  useEffect(() => {
    // Fetch all data when component mounts
    fetchAllData();
  }, [fetchAllData]);

  const handleRefresh = () => {
    console.log('🔄 Refreshing all admin data...');
    fetchAllData();
  };

  const handleFetchVotersWithFilters = () => {
    // Example: Fetch voters for specific booth IDs
    fetchVoters({ booth_ids: '1,2,3' });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh All Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={fetchConstituencies}>
          <Text style={styles.buttonText}>Fetch Constituencies</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={fetchBooths}>
          <Text style={styles.buttonText}>Fetch Booths</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={fetchUsers}>
          <Text style={styles.buttonText}>Fetch Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => fetchVoters()}>
          <Text style={styles.buttonText}>Fetch All Voters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleFetchVotersWithFilters}>
          <Text style={styles.buttonText}>Fetch Filtered Voters</Text>
        </TouchableOpacity>
      </View>

      {/* Data Display */}
      <View style={styles.dataContainer}>
        {/* Constituencies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Constituencies {loading.constituencies && '(Loading...)'}
          </Text>
          {errors.constituencies && (
            <Text style={styles.error}>Error: {errors.constituencies}</Text>
          )}
          {data.constituencies && (
            <Text style={styles.dataText}>
              Count: {Array.isArray(data.constituencies) ? data.constituencies.length : 'N/A'}
            </Text>
          )}
        </View>

        {/* Booths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Booths {loading.booths && '(Loading...)'}
          </Text>
          {errors.booths && (
            <Text style={styles.error}>Error: {errors.booths}</Text>
          )}
          {data.booths && (
            <Text style={styles.dataText}>
              Count: {Array.isArray(data.booths) ? data.booths.length : 'N/A'}
            </Text>
          )}
        </View>

        {/* Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Users {loading.users && '(Loading...)'}
          </Text>
          {errors.users && (
            <Text style={styles.error}>Error: {errors.users}</Text>
          )}
          {data.users && (
            <Text style={styles.dataText}>
              Count: {Array.isArray(data.users) ? data.users.length : 'N/A'}
            </Text>
          )}
        </View>

        {/* Voters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Voters {loading.voters && '(Loading...)'}
          </Text>
          {errors.voters && (
            <Text style={styles.error}>Error: {errors.voters}</Text>
          )}
          {data.voters && (
            <Text style={styles.dataText}>
              Count: {Array.isArray(data.voters) ? data.voters.length : 'N/A'}
            </Text>
          )}
        </View>
      </View>

      {loading.all && (
        <Text style={styles.loadingText}>Loading all admin data...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dataContainer: {
    marginTop: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007bff',
    marginTop: 20,
  },
});

export default AdminDashboard;