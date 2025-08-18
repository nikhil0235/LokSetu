import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import ConstituencyCard from '../components/ConstituencyCard';
import { AppIcon, BackButton } from '../components/common';

const ConstituenciesListScreen = ({ onBack, onNavigate }) => {
  const { constituencies, loading } = useSelector(state => state.dashboard);
  const [filteredConstituencies, setFilteredConstituencies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setFilteredConstituencies(constituencies || []);
  }, [constituencies]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = constituencies.filter(constituency => 
        constituency.asmblyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        constituency.asmblyNameL1.includes(searchQuery) ||
        constituency.asmblyNo.toString().includes(searchQuery) ||
        constituency.districtCd.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConstituencies(filtered);
    } else {
      setFilteredConstituencies(constituencies || []);
    }
  }, [searchQuery, constituencies]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh logic would go here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleConstituencyPress = (constituency) => {
    console.log('Selected constituency:', constituency);
    onNavigate && onNavigate('constituencyVoters', {
      assemblyNo: constituency.asmblyNo,
      constituencyName: constituency.asmblyName
    });
  };

  const renderConstituencyItem = ({ item }) => (
    <ConstituencyCard constituency={item} onPress={handleConstituencyPress} />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading constituencies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <BackButton onPress={onBack} />
          <Text style={styles.title}>Constituencies</Text>
        </View>
        <Text style={styles.subtitle}>Total: {filteredConstituencies.length} constituencies</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, number, or district..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      <FlatList
        data={filteredConstituencies}
        renderItem={renderConstituencyItem}
        keyExtractor={(item) => item.acId.toString()}
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

export default ConstituenciesListScreen;