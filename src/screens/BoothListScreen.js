import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useApiService } from '../hooks/useApiService';
import BoothCard from '../components/BoothCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BoothListScreen = ({ onBack }) => {
  const { user } = useSelector(state => state.auth);
  const { getVoters, loading } = useApiService();
  const [booths, setBooths] = useState([]);
  const [filteredBooths, setFilteredBooths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadBooths = async () => {
    try {
      console.log('Using framework for GET with body');
      
      const bodyData = {
        state_id: 'S04',
        district_id: 'S0429',
        assembly_id: '195'
      };
      
      const boothsData = await apiClient.get('/general/booths', token, bodyData);
      console.log('Booths data:', boothsData);
      
      setBooths(boothsData || []);
      setFilteredBooths(boothsData || []);
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    loadBooths();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = booths.filter(booth => 
        booth.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.partId.toString().includes(searchQuery) ||
        booth.partNumber.toString().includes(searchQuery)
      );
      setFilteredBooths(filtered);
    } else {
      setFilteredBooths(booths);
    }
  }, [searchQuery, booths]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBooths();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderBoothItem = ({ item }) => (
    <BoothCard booth={item} />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading booths...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Polling Booths</Text>
        </View>
        <Text style={styles.subtitle}>Total: {filteredBooths.length} booths</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by booth name, part number, or ID..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
      </View>

      <FlatList
        data={filteredBooths}
        renderItem={renderBoothItem}
        keyExtractor={(item) => item.partId.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listContainer: {
    paddingVertical: 10,
  },
});

export default BoothListScreen;