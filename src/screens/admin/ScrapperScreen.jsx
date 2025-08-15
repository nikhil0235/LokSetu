import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
const icons = {
  Play: '▶️',
  Pause: '⏸️',
  FileText: '📄',
  CheckCircle: '✅',
  AlertCircle: '⚠️',
  Clock: '🕰️',
  X: '✖️',
};

const ScrapperScreen = ({ onBack, onLogout }) => {
  const [scrapingJobs, setScrapingJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState(new Set());
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newJobConfig, setNewJobConfig] = useState({
    name: '',
    url: '',
    constituency: '',
    dataType: 'voters',
  });

  const mockJobs = [
    {
      id: 1,
      name: 'Constituency-1 Voters',
      url: 'https://ceokarnataka.kar.nic.in/SearchVoter',
      constituency: 'Constituency-1',
      dataType: 'voters',
      status: 'completed',
      progress: 100,
      recordsFound: 15420,
      lastRun: '2024-01-15 14:30',
      duration: '2h 15m',
    },
    {
      id: 2,
      name: 'Constituency-2 Voters',
      url: 'https://ceokarnataka.kar.nic.in/SearchVoter',
      constituency: 'Constituency-2',
      dataType: 'voters',
      status: 'running',
      progress: 65,
      recordsFound: 8750,
      lastRun: '2024-01-16 10:00',
      duration: '1h 30m',
    },
    {
      id: 3,
      name: 'Booth Locations',
      url: 'https://ceokarnataka.kar.nic.in/BoothList',
      constituency: 'All',
      dataType: 'booths',
      status: 'pending',
      progress: 0,
      recordsFound: 0,
      lastRun: 'Never',
      duration: '-',
    },
  ];

  useEffect(() => {
    setScrapingJobs(mockJobs);
    setActiveJobs(new Set([2]));
  }, []);

  const startScraping = (jobId) => {
    setActiveJobs(prev => new Set([...prev, jobId]));
    setScrapingJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'running', progress: 0 }
        : job
    ));

    const interval = setInterval(() => {
      setScrapingJobs(prev => prev.map(job => {
        if (job.id === jobId && job.status === 'running') {
          const newProgress = Math.min(job.progress + Math.random() * 10, 100);
          if (newProgress >= 100) {
            setActiveJobs(current => {
              const updated = new Set(current);
              updated.delete(jobId);
              return updated;
            });
            clearInterval(interval);
            return { ...job, status: 'completed', progress: 100 };
          }
          return { ...job, progress: newProgress };
        }
        return job;
      }));
    }, 1000);
  };

  const stopScraping = (jobId) => {
    setActiveJobs(prev => {
      const updated = new Set(prev);
      updated.delete(jobId);
      return updated;
    });
    setScrapingJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'stopped' }
        : job
    ));
  };

  const createNewJob = () => {
    if (!newJobConfig.name || !newJobConfig.url || !newJobConfig.constituency) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newJob = {
      id: Date.now(),
      ...newJobConfig,
      status: 'pending',
      progress: 0,
      recordsFound: 0,
      lastRun: 'Never',
      duration: '-',
    };

    setScrapingJobs(prev => [...prev, newJob]);
    setNewJobConfig({ name: '', url: '', constituency: '', dataType: 'voters' });
    setShowConfigModal(false);
    Alert.alert('Success', 'New scraping job created successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'running': return '#3B82F6';
      case 'stopped': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return icons.CheckCircle;
      case 'running': return icons.Clock;
      case 'error': return icons.AlertCircle;
      default: return icons.Clock;
    }
  };

  const JobCard = ({ job }) => {
    const statusIcon = getStatusIcon(job.status);

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobName}>{job.name}</Text>
            <Text style={styles.jobConstituency}>{job.constituency}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '20' }]}>
            <Text style={[styles.iconText, { color: getStatusColor(job.status) }]}>{statusIcon}</Text>
            <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <Text style={styles.jobUrl}>{job.url}</Text>
          <Text style={styles.jobType}>Data Type: {job.dataType}</Text>
        </View>

        {job.status === 'running' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${job.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{job.progress.toFixed(1)}%</Text>
          </View>
        )}

        <View style={styles.jobStats}>
          <Text style={styles.statText}>Records: {job.recordsFound.toLocaleString()}</Text>
          <Text style={styles.statText}>Last Run: {job.lastRun}</Text>
          <Text style={styles.statText}>Duration: {job.duration}</Text>
        </View>

        <View style={styles.jobActions}>
          {job.status === 'running' ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#F59E0B20' }]}
              onPress={() => stopScraping(job.id)}
            >
              <Text style={[styles.iconText, { color: '#F59E0B' }]}>{icons.Pause}</Text>
              <Text style={[styles.actionButtonText, { color: '#F59E0B' }]}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10B98120' }]}
              onPress={() => startScraping(job.id)}
            >
              <Text style={[styles.iconText, { color: '#10B981' }]}>{icons.Play}</Text>
              <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Start</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3B82F620' }]}
            onPress={() => Alert.alert('Parser', 'Parser functionality coming soon')}
          >
            <Text style={[styles.iconText, { color: '#3B82F6' }]}>{icons.FileText}</Text>
            <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Parse</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.iconText}>{icons.X}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Data Scraper</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowConfigModal(true)}
          >
            <Text style={styles.addButtonText}>+ New Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{scrapingJobs.length}</Text>
          <Text style={styles.summaryLabel}>Total Jobs</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>{activeJobs.size}</Text>
          <Text style={styles.summaryLabel}>Running</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            {scrapingJobs.filter(j => j.status === 'completed').length}
          </Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
            {scrapingJobs.reduce((sum, job) => sum + job.recordsFound, 0).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Records</Text>
        </View>
      </View>

      <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
        {scrapingJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </ScrollView>

      <Modal
        visible={showConfigModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfigModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Scraping Job</Text>
              <TouchableOpacity onPress={() => setShowConfigModal(false)}>
                <Text style={styles.iconText}>{icons.X}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Job Name"
              value={newJobConfig.name}
              onChangeText={(text) => setNewJobConfig(prev => ({ ...prev, name: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Target URL"
              value={newJobConfig.url}
              onChangeText={(text) => setNewJobConfig(prev => ({ ...prev, url: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Constituency"
              value={newJobConfig.constituency}
              onChangeText={(text) => setNewJobConfig(prev => ({ ...prev, constituency: text }))}
            />

            <View style={styles.dataTypeContainer}>
              <Text style={styles.dataTypeLabel}>Data Type:</Text>
              <View style={styles.dataTypeOptions}>
                {['voters', 'booths', 'candidates'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.dataTypeOption,
                      newJobConfig.dataType === type && styles.selectedDataType
                    ]}
                    onPress={() => setNewJobConfig(prev => ({ ...prev, dataType: type }))}
                  >
                    <Text style={[
                      styles.dataTypeText,
                      newJobConfig.dataType === type && styles.selectedDataTypeText
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowConfigModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={createNewJob}
              >
                <Text style={styles.createButtonText}>Create Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  logoutButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  iconText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  jobsList: {
    flex: 1,
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  jobConstituency: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobUrl: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 4,
  },
  jobType: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 40,
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statText: {
    fontSize: 11,
    color: '#6B7280',
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  dataTypeContainer: {
    marginBottom: 20,
  },
  dataTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  dataTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataTypeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedDataType: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dataTypeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedDataTypeText: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ScrapperScreen;