import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from './';

const StatsRow = ({ stats, title }) => {
  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleContainer}>
          <AppIcon name="dashboard" size={20} color="#111827" />
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.topStatsRow}>
        {stats.map((stat, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.statCard, { backgroundColor: stat.color }]}
          onPress={stat.onPress}
          activeOpacity={0.8}
        >
          <AppIcon name={stat.icon} size={24} color="#FFFFFF" />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statTitle}>{stat.title}</Text>
        </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: -4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  topStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statTitle: {
    fontSize: 8,
    color: '#FFFFFF',
    marginTop: 1,
    opacity: 0.95,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StatsRow;