/**
 * Voter data model with all required fields
 */
export class VoterModel {
  constructor(data = {}) {
    // Required columns from database schema
    this.epic_id = data.epic_id || null;
    this.booth_id = data.booth_id || null;
    this.constituency_id = data.constituency_id || null;
    this.constituency_name_phonetic = data.constituency_name_phonetic || null;
    this.serial_number = data.serial_number || null;
    this.name = data.name || null;
    this.name_phonetic = data.name_phonetic || null;
    this.guardian_name = data.guardian_name || null;
    this.guardian_name_phonetic = data.guardian_name_phonetic || null;
    this.gender = data.gender || null;
    this.dob = data.dob || null;
    this.age = data.age || null;
    this.photo_url = data.photo_url || null;
    this.mobile = data.mobile || null;
    
    // Part number and area
    this.part_no = data.part_no || null;
    this.area = data.area || null;
    
    // Political data
    this.last_voted_party = data.last_voted_party || null;
    this.voting_preference = data.voting_preference || null;
    this.certainty_of_vote = data.certainty_of_vote || null;
    this.vote_type = data.vote_type || null;
    this.availability = data.availability || null;
    
    // Demographic data
    this.religion = data.religion || null;
    this.category = data.category || null;
    this.obc_subtype = data.obc_subtype || null;
    this.caste = data.caste || null;
    this.language_pref = data.language_pref || null;
    
    // Employment data
    this.education_level = data.education_level || null;
    this.employment_status = data.employment_status || null;
    this.govt_job_type = data.govt_job_type || null;
    this.govt_job_group = data.govt_job_group || null;
    this.job_role = data.job_role || null;
    this.monthly_salary_range = data.monthly_salary_range || null;
    this.private_job_role = data.private_job_role || null;
    this.private_salary_range = data.private_salary_range || null;
    this.self_employed_service = data.self_employed_service || null;
    this.business_type = data.business_type || null;
    this.business_turnover_range = data.business_turnover_range || null;
    this.gig_worker_role = data.gig_worker_role || null;
    
    // Location data
    this.residing_in = data.residing_in || null;
    this.other_city = data.other_city || null;
    this.permanent_in_bihar = data.permanent_in_bihar || null;
    this.migrated = data.migrated || null;
    
    // Feedback data
    this.feedback = data.feedback || null;
    
    // Additional fields
    this.house_number = data.house_number || null;
    this.relation_type = data.relation_type || null;
    
    // Verification status
    this.verification_status = data.verification_status || 'Unverified';
    
    // Timestamps
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  getDisplayName() {
    return this.name || this.name_phonetic || 'Unknown';
  }

  getAgeGroup() {
    if (!this.age) return 'Unknown';
    if (this.age < 26) return '18-25';
    if (this.age < 36) return '26-35';
    if (this.age < 46) return '36-45';
    if (this.age < 56) return '46-55';
    if (this.age < 66) return '56-65';
    return '65+';
  }

  isVerified() {
    return this.verification_status === 'Verified';
  }

  getPoliticalSummary() {
    return {
      lastVoted: this.last_voted_party || 'Unknown',
      preference: this.voting_preference || 'Undecided',
      certainty: this.certainty_of_vote || 'Unknown'
    };
  }

  update(data) {
    Object.keys(data).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    });
    this.updated_at = new Date().toISOString();
  }

  toObject() {
    return { ...this };
  }

  validate() {
    const errors = [];
    
    if (!this.epic_id) errors.push('EPIC ID is required');
    if (!this.name && !this.name_phonetic) errors.push('Name is required');
    if (this.mobile && !/^\d{10}$/.test(this.mobile)) {
      errors.push('Mobile number must be 10 digits');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default VoterModel;