import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppIcon } from './';

const ElectionResultsCard = ({ 
  title = "Past Election Results"
}) => {
  const [activeYear, setActiveYear] = useState('2020');
  
  const electionData = {
    '2020': {
      results: [
        { party: 'BJP', votes: 45230, percentage: 42.5, color: '#FF6B35', winner: true },
        { party: 'RJD', votes: 38450, percentage: 36.1, color: '#00A86B' },
        { party: 'JDU', votes: 15670, percentage: 14.7, color: '#4169E1' },
        { party: 'Others', votes: 7150, percentage: 6.7, color: '#9CA3AF' }
      ],
      winner: 'BJP'
    },
    '2015': {
      results: [
        { party: 'RJD', votes: 42180, percentage: 39.8, color: '#00A86B', winner: true },
        { party: 'BJP', votes: 38920, percentage: 36.7, color: '#FF6B35' },
        { party: 'JDU', votes: 18450, percentage: 17.4, color: '#4169E1' },
        { party: 'Others', votes: 6450, percentage: 6.1, color: '#9CA3AF' }
      ],
      winner: 'RJD'
    },
    '2010': {
      results: [
        { party: 'JDU', votes: 41230, percentage: 38.9, color: '#4169E1', winner: true },
        { party: 'RJD', votes: 35670, percentage: 33.6, color: '#00A86B' },
        { party: 'BJP', votes: 21450, percentage: 20.2, color: '#FF6B35' },
        { party: 'Others', votes: 7650, percentage: 7.3, color: '#9CA3AF' }
      ],
      winner: 'JDU'
    }
  };
  
  const yearOrder = ['2020', '2015', '2010'];
  
  const currentData = electionData[activeYear];
  const totalVotes = currentData.results.reduce((sum, result) => sum + result.votes, 0);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <AppIcon name="bar-chart" size={20} color="#111827" />
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.tabContainer}>
        {yearOrder.map((year) => (
          <TouchableOpacity
            key={year}
            style={[styles.yearTab, activeYear === year && styles.activeYearTab]}
            onPress={() => setActiveYear(year)}
          >
            <Text style={[styles.yearTabText, activeYear === year && styles.activeYearTabText]}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.resultsContainer}>
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>🏆 Winner: {currentData.winner}</Text>
        </View>
        
        <View style={styles.simpleRow}>
          {currentData.results.slice(0, 3).map((result, index) => (
            <View key={index} style={styles.partyItem}>
              <View style={[styles.dot, { backgroundColor: result.color }]} />
              <Text style={styles.partyText}>{result.party} {result.percentage}%</Text>

            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.totalVotes}>Total Votes: {totalVotes.toLocaleString()}</Text>
        <Text style={styles.electionYear}>{activeYear} Assembly Election</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  resultsContainer: {
    marginBottom: 12,
  },
  simpleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  partyText: {
    fontSize: 9,
    color: '#111827',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalVotes: {
    fontSize: 9,
    fontWeight: '500',
    color: '#374151',
  },
  electionYear: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 24, 39, 0.05)',
    borderRadius: 8,
    padding: 2,
    marginBottom: 8,
  },
  yearTab: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeYearTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  yearTabText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeYearTabText: {
    color: '#111827',
    fontWeight: '700',
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 6,
  },
  winnerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 4,
  },
});

export default ElectionResultsCard;