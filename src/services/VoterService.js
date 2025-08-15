import VoterModel from '../models/VoterModel';

/**
 * Service class for voter data operations
 */
export class VoterService {
  constructor() {
    this.voters = [];
    this.loadMockData();
  }

  /**
   * Load mock voter data
   */
  loadMockData() {
    const mockVoters = [
      {
        epic_id: 'ABC1234567',
        name: 'राम कुमार सिंह',
        name_phonetic: 'Ram Kumar Singh',
        age: 45,
        gender: 'M',
        mobile: '9876543210',
        booth_id: 'B001',
        part_no: '001',
        area: 'Ward 1, Patna',
        caste: 'General',
        last_voted_party: 'BJP',
        voting_preference: 'BJP',
        certainty_of_vote: 'High',
        verification_status: 'Verified',
        house_number: '123A',
        guardian_name: 'श्याम सिंह',
      },
      {
        epic_id: 'DEF7890123',
        name: 'सीता देवी',
        name_phonetic: 'Sita Devi',
        age: 38,
        gender: 'F',
        mobile: '8765432109',
        booth_id: 'B002',
        part_no: '002',
        area: 'Ward 2, Patna',
        caste: 'OBC',
        last_voted_party: 'RJD',
        voting_preference: 'Undecided',
        certainty_of_vote: 'Medium',
        verification_status: 'Unverified',
        house_number: '456B',
        guardian_name: 'राम प्रसाद',
      },
      {
        epic_id: 'GHI4567890',
        name: 'अमित शर्मा',
        name_phonetic: 'Amit Sharma',
        age: 29,
        gender: 'M',
        mobile: '7654321098',
        booth_id: 'B001',
        part_no: '001',
        area: 'Ward 1, Patna',
        caste: 'General',
        last_voted_party: 'Congress',
        voting_preference: 'BJP',
        certainty_of_vote: 'Low',
        verification_status: 'Verified',
        house_number: '789C',
        guardian_name: 'विनोद शर्मा',
      },
      {
        epic_id: 'JKL1234890',
        name: 'प्रिया कुमारी',
        name_phonetic: 'Priya Kumari',
        age: 32,
        gender: 'F',
        mobile: '6543210987',
        booth_id: 'B003',
        part_no: '003',
        area: 'Ward 3, Patna',
        caste: 'SC',
        last_voted_party: 'RJD',
        voting_preference: 'RJD',
        certainty_of_vote: 'High',
        verification_status: 'Verified',
        house_number: '321D',
        guardian_name: 'सुरेश कुमार',
      },
      {
        epic_id: 'MNO5678901',
        name: 'राजेश यादव',
        name_phonetic: 'Rajesh Yadav',
        age: 55,
        gender: 'M',
        mobile: '5432109876',
        booth_id: 'B002',
        part_no: '002',
        area: 'Ward 2, Patna',
        caste: 'OBC',
        last_voted_party: 'JDU',
        voting_preference: 'JDU',
        certainty_of_vote: 'Medium',
        verification_status: 'Unverified',
        house_number: '654E',
        guardian_name: 'रामदेव यादव',
      }
    ];

    this.voters = mockVoters.map(data => new VoterModel(data));
  }

  /**
   * Get all voters
   */
  getAllVoters() {
    return this.voters;
  }

  /**
   * Filter voters based on criteria
   */
  filterVoters(filters = {}) {
    let filtered = [...this.voters];

    if (filters.type === 'booth' && filters.value) {
      filtered = filtered.filter(voter => voter.booth_id === filters.value);
    }

    if (filters.type === 'age' && filters.value) {
      const [min, max] = filters.value.includes('+') 
        ? [parseInt(filters.value), 999] 
        : filters.value.split('-').map(Number);
      filtered = filtered.filter(voter => voter.age >= min && voter.age <= max);
    }

    if (filters.type === 'caste' && filters.value) {
      filtered = filtered.filter(voter => voter.caste === filters.value);
    }

    if (filters.type === 'verification' && filters.value) {
      filtered = filtered.filter(voter => voter.verification_status === filters.value);
    }

    if (filters.type === 'gender' && filters.value) {
      filtered = filtered.filter(voter => voter.gender === filters.value);
    }

    if (filters.type === 'address' && filters.value) {
      filtered = filtered.filter(voter => 
        voter.area && voter.area.toLowerCase().includes(filters.value.toLowerCase())
      );
    }

    return filtered;
  }

  /**
   * Search voters by query
   */
  searchVoters(query) {
    if (!query) return this.voters;

    const searchTerm = query.toLowerCase();
    return this.voters.filter(voter =>
      voter.name?.toLowerCase().includes(searchTerm) ||
      voter.name_phonetic?.toLowerCase().includes(searchTerm) ||
      voter.epic_id?.toLowerCase().includes(searchTerm) ||
      voter.mobile?.includes(searchTerm) ||
      voter.area?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get voter by EPIC ID
   */
  getVoterById(epicId) {
    return this.voters.find(voter => voter.epic_id === epicId);
  }

  /**
   * Update voter
   */
  updateVoter(epicId, updateData) {
    const voterIndex = this.voters.findIndex(voter => voter.epic_id === epicId);
    if (voterIndex !== -1) {
      this.voters[voterIndex].update(updateData);
      return this.voters[voterIndex];
    }
    return null;
  }

  /**
   * Get voter statistics
   */
  getVoterStats(boothIds = []) {
    let votersToAnalyze = this.voters;
    
    if (boothIds.length > 0) {
      votersToAnalyze = this.voters.filter(voter => 
        boothIds.includes(voter.booth_id)
      );
    }

    const stats = {
      total: votersToAnalyze.length,
      verified: votersToAnalyze.filter(v => v.isVerified()).length,
      unverified: votersToAnalyze.filter(v => !v.isVerified()).length,
      male: votersToAnalyze.filter(v => v.gender === 'M').length,
      female: votersToAnalyze.filter(v => v.gender === 'F').length,
      thirdGender: votersToAnalyze.filter(v => v.gender === 'O').length,
      ageGroups: {},
      casteDistribution: {},
      partyPreference: {}
    };

    // Age group distribution
    votersToAnalyze.forEach(voter => {
      const ageGroup = voter.getAgeGroup();
      stats.ageGroups[ageGroup] = (stats.ageGroups[ageGroup] || 0) + 1;
    });

    // Caste distribution
    votersToAnalyze.forEach(voter => {
      if (voter.caste) {
        stats.casteDistribution[voter.caste] = (stats.casteDistribution[voter.caste] || 0) + 1;
      }
    });

    // Party preference
    votersToAnalyze.forEach(voter => {
      if (voter.voting_preference) {
        stats.partyPreference[voter.voting_preference] = (stats.partyPreference[voter.voting_preference] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Get booth-wise voter count
   */
  getBoothWiseStats() {
    const boothStats = {};
    
    this.voters.forEach(voter => {
      if (!boothStats[voter.booth_id]) {
        boothStats[voter.booth_id] = {
          total: 0,
          verified: 0,
          unverified: 0,
          male: 0,
          female: 0,
          thirdGender: 0
        };
      }
      
      boothStats[voter.booth_id].total++;
      
      if (voter.isVerified()) {
        boothStats[voter.booth_id].verified++;
      } else {
        boothStats[voter.booth_id].unverified++;
      }
      
      if (voter.gender === 'M') boothStats[voter.booth_id].male++;
      else if (voter.gender === 'F') boothStats[voter.booth_id].female++;
      else boothStats[voter.booth_id].thirdGender++;
    });
    
    return boothStats;
  }
}

export default new VoterService();