import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FormPicker from '../fields/FormPicker';
import FormToggle from '../fields/FormToggle';

const VotingStep = ({ data, onDataChange, errors }) => {
  const updateField = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  const partyOptions = [
    { label: 'BJP', value: 'BJP' },
    { label: 'RJD', value: 'RJD' },
    { label: 'JD(U)', value: 'JDU' },
    { label: 'Congress', value: 'Congress' },
    { label: 'Janaswaraj', value: 'Janaswaraj' },
    { label: 'AIMIM', value: 'AIMIM' },
    { label: 'LJP', value: 'LJP' },
    { label: 'HAM', value: 'HAM' },
    { label: 'VIP', value: 'VIP' },
    { label: 'Independent', value: 'Independent' },
    { label: 'Will Not Vote', value: 'Will Not Vote' },
    { label: 'Undecided', value: 'Undecided' }
  ];

  const certaintyOptions = [
    { label: 'Definitely Yes', value: 'yes' },
    { label: 'Doubtful/Maybe', value: 'doubtful' },
    { label: 'Definitely No', value: 'no' }
  ];

  const voteTypeOptions = [
    { label: 'Normal Vote', value: 'normal' },
    { label: 'Postal Ballot', value: 'postal' },
    { label: 'First Time Vote', value: 'first_time' },
    { label: 'Others', value: 'others' }
  ];

  const availabilityOptions = [
    { label: '100% Available', value: '100' },
    { label: '50% Available', value: '50' },
    { label: 'Not Available', value: '0' },
    { label: "Can't Say", value: 'cant_say' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FormPicker
        label="Last Election Voted Party/Alliance"
        value={data.last_voted_party}
        onValueChange={(value) => updateField('last_voted_party', value)}
        options={partyOptions}
        placeholder="Select party voted in last election"
        icon="how-to-vote"
        error={errors.last_voted_party}
      />

      <FormPicker
        label="This Election Voting Preference"
        value={data.voting_preference}
        onValueChange={(value) => updateField('voting_preference', value)}
        options={partyOptions}
        placeholder="Select preferred party for this election"
        required={true}
        icon="ballot"
        error={errors.voting_preference}
      />

      <FormPicker
        label="Certainty of Vote Decision"
        value={data.vote_certainty}
        onValueChange={(value) => updateField('vote_certainty', value)}
        options={certaintyOptions}
        placeholder="How certain are you about your vote?"
        icon="psychology"
        error={errors.vote_certainty}
      />

      <FormPicker
        label="Vote Type"
        value={data.vote_type}
        onValueChange={(value) => updateField('vote_type', value)}
        options={voteTypeOptions}
        placeholder="Select vote type"
        icon="edit-note"
        error={errors.vote_type}
      />

      <FormPicker
        label="Availability to Vote on Election Day"
        value={data.vote_availability}
        onValueChange={(value) => updateField('vote_availability', value)}
        options={availabilityOptions}
        placeholder="Select your availability"
        icon="event-available"
        error={errors.vote_availability}
      />

      <FormToggle
        label="Family Votes Together"
        value={data.family_votes_together}
        onValueChange={(value) => updateField('family_votes_together', value)}
        icon="family-restroom"
        error={errors.family_votes_together}
      />

      <FormToggle
        label="Influenced by Community Leaders"
        value={data.influenced_by_leaders}
        onValueChange={(value) => updateField('influenced_by_leaders', value)}
        icon="group"
        error={errors.influenced_by_leaders}
      />

      <FormToggle
        label="Party Worker/Volunteer"
        value={data.is_party_worker}
        onValueChange={(value) => updateField('is_party_worker', value)}
        icon="volunteer-activism"
        error={errors.is_party_worker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default VotingStep;