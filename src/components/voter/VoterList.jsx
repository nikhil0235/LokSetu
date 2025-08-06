import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/base';
import { fetchVoters } from '../../store/slices/voterSlice';
import { fetchConstituencies } from '../../store/slices/constituenciesSlice';
import { fetchBooths } from '../../store/slices/boothSlice';

const InfoCard = ({ title, data, loading }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoTitle}>{title}</Text>
    {loading ? (
      <ActivityIndicator size="small" color="#1976d2" />
    ) : (
      <Text style={styles.infoText}>{data}</Text>
    )}
  </View>
);

const VoterCard = ({ voter }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{voter.name}</Text>
    <Text style={styles.details}>EPIC: {voter.epic_id}</Text>
    <Text style={styles.details}>Age: {voter.age} | Gender: {voter.gender}</Text>
    <Text style={styles.details}>Mobile: {voter.mobile}</Text>
    <Text style={styles.address}>{voter.address}</Text>
  </View>
);

const VoterList = () => {
  const dispatch = useAppDispatch();
  const { list: voters, loading, errors } = useAppSelector(state => state.voters);
  const { list: constituencies, loading: constituencyLoading } = useAppSelector(state => state.constituencies);
  const { list: booths, loading: boothLoading } = useAppSelector(state => state.booths);

  useEffect(() => {
    dispatch(fetchConstituencies());
    dispatch(fetchBooths({ constituencyId: 'C001' }));
    dispatch(fetchVoters({ constituencyId: 'C001', boothId: 'B001' }));
  }, [dispatch]);

  const constituency = constituencies[0];
  const totalBooths = booths.length;

  if (loading.fetch) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text>Loading voters...</Text>
      </View>
    );
  }

  if (errors.fetch) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Error: {errors.fetch}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchVoters({ constituencyId: 'C001', boothId: 'B001' }))}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoSection}>
        <InfoCard 
          title="Constituency" 
          data={constituency ? `${constituency.name} (${constituency.district})` : 'Loading...'}
          loading={constituencyLoading.fetch}
        />
        <InfoCard 
          title="Total Booths" 
          data={totalBooths.toString()}
          loading={boothLoading.fetch}
        />
      </View>
      
      <Text style={styles.header}>Voters List ({voters.length})</Text>
      <FlatList
        data={voters}
        keyExtractor={(item) => item.epic_id}
        renderItem={({ item }) => <VoterCard voter={item} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  infoSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    elevation: 1,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginHorizontal: 16,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VoterList;