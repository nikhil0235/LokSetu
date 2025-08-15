import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import {
  FileText,
  Database,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  Upload,
  X,
  Filter,
} from 'lucide-react-native';

const ParserScreen = ({ navigation, route }) => {
  const { jobId } = route.params || {};
  const [parsingJobs, setParsingJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [filterText, setFilterText] = useState('');

  const mockParsingJobs = [
    {
      id: 1,
      name: 'Constituency-1 Voters',
      rawDataFile: 'constituency_1_raw.json',
      recordCount: 15420,
      status: 'completed',
      parsedRecords: 15380,
      errorRecords: 40,
      lastParsed: '2024-01-15 16:45',
      dataType: 'voters',
    },
    {
      id: 2,
      name: 'Constituency-2 Voters',
      rawDataFile: 'constituency_2_raw.json',
      recordCount: 8750,
      status: 'pending',
      parsedRecords: 0,
      errorRecords: 0,
      lastParsed: 'Never',
      dataType: 'voters',
    },
    {
      id: 3,
      name: 'Booth Locations',
      rawDataFile: 'booth_locations_raw.json',
      recordCount: 342,
      status: 'processing',
      parsedRecords: 180,
      errorRecords: 5,
      lastParsed: '2024-01-16 12:30',
      dataType: 'booths',
    },
  ];

  const mockParsedData = [
    {
      id: 1,
      voterName: 'Rajesh Kumar Singh',
      fatherName: 'Ram Kumar Singh',
      age: 45,
      gender: 'Male',
      voterId: 'ABC1234567',
      boothNumber: '145',
      constituency: 'Constituency-1',
      address: 'House No. 123, Sector 15',
      status: 'valid',
    },
    {
      id: 2,
      voterName: 'Priya Sharma',
      fatherName: 'Suresh Sharma',
      age: 32,
      gender: 'Female',
      voterId: 'DEF2345678',
      boothNumber: '145',
      constituency: 'Constituency-1',
      address: 'House No. 456, Sector 16',
      status: 'valid',
    },
    {
      id: 3,
      voterName: 'Invalid Record',
      fatherName: '',
      age: null,
      gender: '',
      voterId: 'INVALID',
      boothNumber: '145',
      constituency: 'Constituency-1',
      address: '',
      status: 'error',
    },
  ];

  useEffect(() => {
    setParsingJobs(mockParsingJobs);
    if (jobId) {
      const job = mockParsingJobs.find(j => j.id === jobId);
      if (job) {
        setSelectedJob(job);
        setParsedData(mockParsedData);
      }
    }
  }, [jobId]);

  const startParsing = (job) => {
    setSelectedJob(job);
    setIsProcessing(true);
    setParsingProgress(0);

    const interval = setInterval(() => {
      setParsingProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setParsedData(mockParsedData);
          setParsingJobs(prevJobs => prevJobs.map(j => 
            j.id === job.id 
              ? { ...j, status: 'completed', parsedRecords: j.recordCount - 40, errorRecords: 40 }
              : j
          ));
          Alert.alert('Success', 'Data parsing completed successfully!');
        }
        return newProgress;
      });
    }, 500);
  };

  const saveToDatabase = () => {
    Alert.alert(
      'Save to Database',
      `Save ${parsedData.filter(d => d.status === 'valid').length} valid records to database?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            Alert.alert('Success', 'Data saved to database successfully!');
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'CSV', onPress: () => Alert.alert('Success', 'Data exported as CSV!') },
        { text: 'JSON', onPress: () => Alert.alert('Success', 'Data exported as JSON!') },
        { text: 'Excel', onPress: () => Alert.alert('Success', 'Data exported as Excel!') },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'processing': return '#3B82F6';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredData = parsedData.filter(item => 
    item.voterName.toLowerCase().includes(filterText.toLowerCase()) ||
    item.voterId.toLowerCase().includes(filterText.toLowerCase())
  );

  const JobCard = ({ job }) => (
    <TouchableOpacity 
      style={[styles.jobCard, selectedJob?.id === job.id && styles.selectedJobCard]}
      onPress={() => setSelectedJob(job)}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobName}>{job.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.jobFile}>File: {job.rawDataFile}</Text>
      <View style={styles.jobStats}>
        <Text style={styles.statText}>Total: {job.recordCount.toLocaleString()}</Text>
        <Text style={styles.statText}>Parsed: {job.parsedRecords.toLocaleString()}</Text>
        <Text style={styles.statText}>Errors: {job.errorRecords}</Text>
      </View>
      <Text style={styles.lastParsed}>Last Parsed: {job.lastParsed}</Text>
    </TouchableOpacity>
  );

  const DataRow = ({ item }) => (
    <View style={[styles.dataRow, item.status === 'error' && styles.errorRow]}>
      <Text style={styles.dataCell}>{item.voterName}</Text>
      <Text style={styles.dataCell}>{item.voterId}</Text>
      <Text style={styles.dataCell}>{item.age || 'N/A'}</Text>
      <Text style={styles.dataCell}>{item.gender}</Text>
      <Text style={styles.dataCell}>{item.boothNumber}</Text>
      <View style={[styles.statusCell, { backgroundColor: item.status === 'valid' ? '#10B98120' : '#EF444420' }]}>
        <Text style={[styles.statusCellText, { color: item.status === 'valid' ? '#10B981' : '#EF4444' }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Parser</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parsing Jobs</Text>
          {parsingJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </View>

        {selectedJob && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details: {selectedJob.name}</Text>
            
            {isProcessing && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Parsing Progress</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${parsingProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{parsingProgress.toFixed(1)}%</Text>
              </View>
            )}

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#3B82F620' }]}
                onPress={() => startParsing(selectedJob)}
                disabled={isProcessing}
              >
                <Play size={16} color="#3B82F6" />
                <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>
                  {isProcessing ? 'Processing...' : 'Start Parsing'}
                </Text>
              </TouchableOpacity>
              
              {parsedData.length > 0 && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#10B98120' }]}
                    onPress={saveToDatabase}
                  >
                    <Database size={16} color="#10B981" />
                    <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Save to DB</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#F59E0B20' }]}
                    onPress={exportData}
                  >
                    <Download size={16} color="#F59E0B" />
                    <Text style={[styles.actionButtonText, { color: '#F59E0B' }]}>Export</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

        {parsedData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parsed Data Preview</Text>
            
            <View style={styles.filterContainer}>
              <Filter size={20} color="#6B7280" />
              <TextInput
                style={styles.filterInput}
                placeholder="Filter by name or voter ID..."
                value={filterText}
                onChangeText={setFilterText}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Name</Text>
              <Text style={styles.headerCell}>Voter ID</Text>
              <Text style={styles.headerCell}>Age</Text>
              <Text style={styles.headerCell}>Gender</Text>
              <Text style={styles.headerCell}>Booth</Text>
              <Text style={styles.headerCell}>Status</Text>
            </View>

            <ScrollView style={styles.dataContainer} nestedScrollEnabled>
              {filteredData.slice(0, 50).map(item => (
                <DataRow key={item.id} item={item} />
              ))}
            </ScrollView>

            {filteredData.length > 50 && (
              <Text style={styles.moreDataText}>
                Showing 50 of {filteredData.length} records
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedJobCard: {
    borderColor: '#3B82F6',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobFile: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lastParsed: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  dataContainer: {
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  errorRow: {
    backgroundColor: '#FEF2F2',
  },
  dataCell: {
    flex: 1,
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
  },
  statusCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCellText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreDataText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ParserScreen;