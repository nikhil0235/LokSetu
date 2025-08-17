import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { apiClient } from '../../services/api/client';
import { AppIcon, BackButton } from '../../components/common';

const BoothSelectionScreen = ({ onBack, onBoothsSelected }) => {
  const { token } = useSelector(state => state.auth);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [booths, setBooths] = useState([]);
  
  const [selectedState, setSelectedState] = useState('S04'); // Hardcoded
  const [selectedDistrict, setSelectedDistrict] = useState('S0429'); // Hardcoded
  const [selectedAssembly, setSelectedAssembly] = useState('195'); // Hardcoded
  
  const [loading, setLoading] = useState(false);

  // Load states on mount
  useEffect(() => {
    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (selectedState) {
      loadDistricts(selectedState);
    }
  }, [selectedState]);

  // Load assemblies when district changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      loadAssemblies(selectedState);
    }
  }, [selectedState, selectedDistrict]);

  // Load booths when assembly changes
  useEffect(() => {
    if (selectedAssembly) {
      loadBooths();
    }
  }, [selectedAssembly]);

  const loadStates = async () => {
    try {
      // const statesData = await apiClient.get('/general/states', token);
      // setStates(statesData || []);
    } catch (error) {
      console.log('States error:', error);
    }
  };

  const loadDistricts = async (stateId) => {
    try {
      // const districtsData = await apiClient.get('/general/districts', token, { state_id: stateId });
      // setDistricts(districtsData || []);
    } catch (error) {
      console.log('Districts error:', error);
    }
  };

  const loadAssemblies = async (stateId) => {
    try {
      // const assembliesData = await apiClient.get('/general/assembly', token, { state_id: stateId });
      // setAssemblies(assembliesData || []);
    } catch (error) {
      console.log('Assemblies error:', error);
    }
  };

  const loadBooths = async () => {
    setLoading(true);
    try {
      const bodyData = {
        state_id: selectedState,
        district_id: selectedDistrict,
        assembly_id: selectedAssembly
      };
      
      console.log('Booths response:', boothsData);
      const boothsData = await apiClient.get('/general/booths', token, {
    state_id: 'S04',
    district_id: 'S0429',
    assembly_id: '195'
  });

      
      if (Array.isArray(boothsData)) {
        setBooths(boothsData);
      } else {
        setBooths([]);
      }
    } catch (error) {
      console.log('Error:', error);
      setBooths([]);
    } finally {
      setLoading(false);
    }
  };

  const DropdownButton = ({ label, value, onPress, options = [] }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={styles.dropdownText}>
          {value || `Select ${label}`}
        </Text>
        <AppIcon name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>
      <Text style={styles.optionsCount}>{options.length} options</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.title}>Select Polling Booths</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Selection</Text>
          
          <DropdownButton
            label="State"
            value={selectedState}
            options={states}
          />
          
          <DropdownButton
            label="District"
            value={selectedDistrict}
            options={districts}
          />
          
          <DropdownButton
            label="Assembly Constituency"
            value={selectedAssembly}
            options={assemblies}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Available Booths ({booths.length})
          </Text>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading booths...</Text>
          ) : (
            Array.isArray(booths) && booths.length > 0 ? (
              booths.map((booth) => (
                <View key={booth.partId} style={styles.boothCard}>
                  <Text style={styles.boothNumber}>#{booth.partNumber}</Text>
                  <Text style={styles.boothName}>{booth.partName}</Text>
                  <Text style={styles.boothId}>ID: {booth.partId}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.loadingText}>
                {loading ? 'Loading booths...' : 'No booths found'}
              </Text>
            )
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, booths.length === 0 && styles.buttonDisabled]}
          onPress={() => onBoothsSelected && onBoothsSelected(booths)}
          disabled={booths.length === 0}
        >
          <Text style={styles.buttonText}>
            Use These Booths ({booths.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  optionsCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },

  boothCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  boothNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  boothName: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  boothId: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BoothSelectionScreen;