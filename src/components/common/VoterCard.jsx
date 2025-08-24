import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from './';

const VoterCard = ({ voter, onEdit, onCall }) => {
  const getStatusColor = (status) => {
    return status === 'Verified' ? '#10B981' : '#F59E0B';
  };

  const getPartyColor = (party) => {
    const colors = {
      'BJP': '#FF6B35',
      'RJD': '#00A86B', 
      'JDU': '#4169E1',
      'Congress': '#19CDFF',
      'Janaswaraj': '#8B5CF6'
    };
    return colors[party] || '#6B7280';
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'M': return 'man';
      case 'F': return 'woman';
      default: return 'person';
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'M': return '#3B82F6';
      case 'F': return '#EC4899';
      default: return '#6B7280';
    }
  };

  const getCasteColor = (caste) => {
    const colors = {
      'Brahmin': '#8B5CF6',
      'Yadav': '#10B981',
      'General': '#6B7280',
      'Chamar': '#F59E0B',
      'Rajput': '#EF4444'
    };
    return colors[caste] || '#6B7280';
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: getPartyColor(voter.voting_preference) }]}
      onPress={() => {
        console.log('Card clicked:', voter.name);
        onEdit(voter);
      }}
      activeOpacity={0.7}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: getGenderColor(voter.gender) + '15' }]}>
            <AppIcon 
              name={getGenderIcon(voter.gender)}
              size={30} 
              color={getGenderColor(voter.gender)}
            />
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.name} numberOfLines={1}>{voter.name}</Text>
            <Text style={styles.nameEng} numberOfLines={1}>{voter.name_phonetic}</Text>
            <View style={styles.epicRow}>
              <AppIcon name="badge" size={8} color="#9CA3AF" />
              <Text style={styles.epicId}>{voter.epic_id}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rightHeader}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(voter.verification_status) }]}>
            <AppIcon
              name={voter.verification_status === 'Verified' ? 'verified' : 'schedule'}
              size={20}
              color="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Combined Info & Actions */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{voter.age}y • {voter.house_number} • {voter.booth_id}</Text>
        <View style={[styles.casteBadge, { backgroundColor: getCasteColor(voter.caste) + '15' }]}>
          <Text style={[styles.casteText, { color: getCasteColor(voter.caste) }]}>{voter.caste}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.partySection}>
          <View style={[styles.partyBadge, { backgroundColor: getPartyColor(voter.voting_preference) }]}>
            <Text style={styles.partyText}>{voter.voting_preference}</Text>
          </View>
          {voter.last_voted_party !== voter.voting_preference && (
            <View style={[styles.partyBadge, styles.lastVotedBadge, { borderColor: getPartyColor(voter.last_voted_party) }]}>
              <Text style={[styles.partyText, { color: getPartyColor(voter.last_voted_party) }]}>
                {voter.last_voted_party}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {voter.mobile && voter.mobile !== '<mobile_number>' ? (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.callBtn]} 
              onPress={(e) => {
                e.stopPropagation();
                onCall(voter);
              }}
            >
              <AppIcon name="call" size={10} color="#10B981" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity 
            style={[styles.actionBtn, styles.editBtn]} 
            onPress={(e) => {
              e.stopPropagation();
              onEdit(voter);
            }}
          >
            <AppIcon name="edit" size={10} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
  },
  
  // Header Section
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  leftHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 1,
  },
  nameEng: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 1,
  },
  epicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  epicId: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginLeft: 4,
  },
  rightHeader: {
    alignItems: 'center',
  },
  statusBadge: {
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
  },
  casteBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  casteText: {
    fontSize: 8,
    fontWeight: '600',
  },

  // Bottom Row
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    alignItems: 'center',
  },
  lastVotedBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  partyText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Action Buttons
  actionBtn: {
    padding: 6,
    marginLeft: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  callBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
});

export default VoterCard;