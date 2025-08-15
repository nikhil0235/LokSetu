import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
const icons = {
  BarChart3: '📊',
  FileText: '📄',
  Users: '👥',
  MapPin: '📍',
  TrendingUp: '📈',
  TrendingDown: '📉',
  Share: '🔗',
  X: '✖️',
};

const { width } = Dimensions.get('window');

const ReportsScreen = ({ onBack, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock report data
  const mockReportData = {
    overview: {
      totalBoothBoys: 23,
      activeBoothBoys: 19,
      totalBooths: 45,
      assignedBooths: 42,
      totalVoters: 67890,
      completedVoters: 54312,
      completionRate: 80.0,
      averageProgress: 75.6,
      lastUpdated: new Date().toLocaleString(),
    },
    performance: {
      topPerformers: [
        { name: 'Meera Joshi', completion: 94.5, booths: 2, voters: 2340 },
        { name: 'Anita Singh', completion: 92.1, booths: 2, voters: 3045 },
        { name: 'Suresh Patel', completion: 87.7, booths: 3, voters: 3245 },
        { name: 'Prakash Sharma', completion: 85.3, booths: 1, voters: 1234 },
      ],
      underPerformers: [
        { name: 'Ravi Kumar', completion: 66.9, booths: 4, voters: 5112 },
        { name: 'Deepak Singh', completion: 61.3, booths: 2, voters: 2890 },
      ],
      dailyProgress: [
        { date: '2024-01-22', completed: 1245 },
        { date: '2024-01-23', completed: 1567 },
        { date: '2024-01-24', completed: 1432 },
        { date: '2024-01-25', completed: 1789 },
        { date: '2024-01-26', completed: 1654 },
        { date: '2024-01-27', completed: 1876 },
        { date: '2024-01-28', completed: 1543 },
      ],
    },
    areas: {
      zoneProgress: [
        { zone: 'North Zone', booths: 12, completion: 82.5, boothBoys: 6 },
        { zone: 'South Zone', booths: 15, completion: 78.3, boothBoys: 8 },
        { zone: 'East Zone', booths: 8, completion: 71.2, boothBoys: 4 },
        { zone: 'West Zone', booths: 10, completion: 85.1, boothBoys: 5 },
        { zone: 'Central Zone', booths: 2, completion: 61.3, boothBoys: 1 },
      ],
    },
  };

  useEffect(() => {
    setReportData(mockReportData);
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Report Generated',
        'Your report has been generated successfully and is ready for download.',
        [
          { text: 'Download PDF', onPress: () => handleDownload('pdf') },
          { text: 'Download Excel', onPress: () => handleDownload('excel') },
          { text: 'Share', onPress: handleShare },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format) => {
    Alert.alert('Download Started', `Report download started in ${format.toUpperCase()} format.`);
  };

  const handleShare = () => {
    Alert.alert('Share Report', 'Share functionality will be implemented here.');
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Text style={[styles.iconText, { color }]}>{icon}</Text>
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={[styles.iconText, { color: trend > 0 ? '#10B981' : '#EF4444' }]}>
              {trend > 0 ? icons.TrendingUp : icons.TrendingDown}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const PerformanceItem = ({ performer, index, isTop = true }) => (
    <View style={styles.performanceItem}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankNumber,
          { color: isTop ? '#10B981' : '#EF4444' }
        ]}>
          {index + 1}
        </Text>
      </View>
      <View style={styles.performerInfo}>
        <Text style={styles.performerName}>{performer.name}</Text>
        <Text style={styles.performerStats}>
          {performer.booths} booths • {performer.voters} voters
        </Text>
      </View>
      <View style={styles.completionContainer}>
        <Text style={[
          styles.completionRate,
          { color: isTop ? '#10B981' : '#EF4444' }
        ]}>
          {performer.completion.toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  const ZoneCard = ({ zone }) => (
    <View style={styles.zoneCard}>
      <View style={styles.zoneHeader}>
        <Text style={styles.zoneName}>{zone.zone}</Text>
        <Text style={styles.zoneCompletion}>{zone.completion.toFixed(1)}%</Text>
      </View>
      <View style={styles.zoneStats}>
        <Text style={styles.zoneStat}>{zone.booths} booths</Text>
        <Text style={styles.zoneStat}>{zone.boothBoys} booth boys</Text>
      </View>
      <View style={styles.zoneProgressBar}>
        <View 
          style={[
            styles.zoneProgressFill, 
            { 
              width: `${zone.completion}%`,
              backgroundColor: zone.completion >= 80 ? '#10B981' : 
                             zone.completion >= 60 ? '#F59E0B' : '#EF4444'
            }
          ]} 
        />
      </View>
    </View>
  );

  const OverviewReport = () => (
    <View style={styles.reportSection}>
      <Text style={styles.sectionTitle}>Overview Report</Text>
      
      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <StatCard
          title="Total Booth Boys"
          value={reportData?.overview.totalBoothBoys}
          subtitle={`${reportData?.overview.activeBoothBoys} active`}
          icon={icons.Users}
          color="#3B82F6"
          trend={2}
        />
        <StatCard
          title="Total Booths"
          value={reportData?.overview.totalBooths}
          subtitle={`${reportData?.overview.assignedBooths} assigned`}
          icon={icons.MapPin}
          color="#10B981"
          trend={1}
        />
        <StatCard
          title="Completion Rate"
          value={`${reportData?.overview.completionRate}%`}
          subtitle="Overall progress"
          icon={icons.BarChart3}
          color="#F59E0B"
          trend={5}
        />
        <StatCard
          title="Total Voters"
          value={reportData?.overview.totalVoters?.toLocaleString()}
          subtitle={`${reportData?.overview.completedVoters?.toLocaleString()} completed`}
          icon={icons.FileText}
          color="#8B5CF6"
          trend={3}
        />
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>
          Your team has made significant progress with {reportData?.overview.completionRate}% 
          completion rate across {reportData?.overview.totalBooths} booths. 
          {reportData?.overview.activeBoothBoys} out of {reportData?.overview.totalBoothBoys} booth boys 
          are currently active and contributing to data collection.
        </Text>
        <Text style={styles.lastUpdated}>
          Last updated: {reportData?.overview.lastUpdated}
        </Text>
      </View>
    </View>
  );

  const PerformanceReport = () => (
    <View style={styles.reportSection}>
      <Text style={styles.sectionTitle}>Performance Report</Text>
      
      {/* Top Performers */}
      <View style={styles.performanceSection}>
        <Text style={styles.subsectionTitle}>Top Performers</Text>
        {reportData?.performance.topPerformers.map((performer, index) => (
          <PerformanceItem 
            key={performer.name} 
            performer={performer} 
            index={index} 
            isTop={true} 
          />
        ))}
      </View>

      {/* Under Performers */}
      <View style={styles.performanceSection}>
        <Text style={styles.subsectionTitle}>Needs Attention</Text>
        {reportData?.performance.underPerformers.map((performer, index) => (
          <PerformanceItem 
            key={performer.name} 
            performer={performer} 
            index={index} 
            isTop={false} 
          />
        ))}
      </View>

      {/* Daily Progress Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.subsectionTitle}>Daily Progress (Last 7 Days)</Text>
        <View style={styles.simpleChart}>
          {reportData?.performance.dailyProgress.map((day, index) => (
            <View key={day.date} style={styles.chartBar}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { height: (day.completed / 2000) * 100 }
                ]} 
              />
              <Text style={styles.chartLabel}>
                {new Date(day.date).getDate()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const AreaReport = () => (
    <View style={styles.reportSection}>
      <Text style={styles.sectionTitle}>Area-wise Report</Text>
      
      {reportData?.areas.zoneProgress.map((zone) => (
        <ZoneCard key={zone.zone} zone={zone} />
      ))}
    </View>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'performance':
        return <PerformanceReport />;
      case 'areas':
        return <AreaReport />;
      default:
        return <OverviewReport />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.iconText}>{icons.X}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Reports & Analytics</Text>
            <Text style={styles.headerSubtitle}>Data insights and performance metrics</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Report Type</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedReport}
                onValueChange={setSelectedReport}
              >
                <Picker.Item label="Overview" value="overview" />
                <Picker.Item label="Performance" value="performance" />
                <Picker.Item label="Area Analysis" value="areas" />
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Period</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={selectedPeriod}
                onValueChange={setSelectedPeriod}
              >
                <Picker.Item label="This Month" value="this_month" />
                <Picker.Item label="Last Month" value="last_month" />
                <Picker.Item label="Last 3 Months" value="last_3_months" />
                <Picker.Item label="Custom Range" value="custom" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateReport}
            disabled={isGenerating}
          >
            <Text style={[styles.iconText, { color: '#FFFFFF' }]}>{icons.FileText}</Text>
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={[styles.iconText, { color: '#3B82F6' }]}>{icons.Share}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderReport()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  logoutButton: {
    padding: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  controlRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  shareButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  content: {
    flex: 1,
  },
  reportSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    padding: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  performanceSection: {
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  performerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  performerStats: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  completionContainer: {
    alignItems: 'flex-end',
  },
  completionRate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simpleChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 12,
  },
  chartBar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  chartBarFill: {
    backgroundColor: '#3B82F6',
    width: 20,
    marginBottom: 8,
    borderRadius: 2,
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  zoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  zoneCompletion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  zoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  zoneStat: {
    fontSize: 12,
    color: '#6B7280',
  },
  zoneProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  zoneProgressFill: {
    height: 6,
    borderRadius: 3,
  },
});

export default ReportsScreen;