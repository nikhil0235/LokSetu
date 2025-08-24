import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { AppIcon, BackButton } from './index';

const ReusableList = ({
  title,
  data = [],
  columns = [],
  onBack,
  onLogout,
  onRefresh,
  refreshing = false,
  searchable = true,
  filterable = true,
  filters = [],
  actions = [],
  itemActions = [],
  onItemPress,
  renderCustomItem,
  EmptyComponent,
  headerActions = [],
  pagination = false,
  itemsPerPage = 10,
  loading = false,
  showSummary = true,
  summaryCards = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchQuery && searchable) {
      const searchColumns = columns.filter(col => col.searchable !== false);
      filtered = filtered.filter(item =>
        searchColumns.some(col => {
          const value = col.accessor ? col.accessor(item) : item[col.key];
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue && filterValue !== 'all') {
        const filter = filters.find(f => f.key === filterKey);
        if (filter) {
          filtered = filtered.filter(item => filter.filterFn(item, filterValue));
        }
      }
    });

    return filtered;
  }, [data, searchQuery, activeFilters, columns, filters]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage, pagination]);

  const totalPages = pagination ? Math.ceil(filteredData.length / itemsPerPage) : 1;

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <AppIcon name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {filters.map((filter, index) => (
              <View key={index} style={styles.filterSection}>
                <Text style={styles.filterLabel}>{filter.label}</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      (!activeFilters[filter.key] || activeFilters[filter.key] === 'all') && styles.selectedFilter
                    ]}
                    onPress={() => handleFilterChange(filter.key, 'all')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      (!activeFilters[filter.key] || activeFilters[filter.key] === 'all') && styles.selectedFilterText
                    ]}>All</Text>
                  </TouchableOpacity>
                  
                  {filter.options.map((option, optIndex) => (
                    <TouchableOpacity
                      key={optIndex}
                      style={[
                        styles.filterOption,
                        activeFilters[filter.key] === option.value && styles.selectedFilter
                      ]}
                      onPress={() => handleFilterChange(filter.key, option.value)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        activeFilters[filter.key] === option.value && styles.selectedFilterText
                      ]}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <BackButton onPress={onBack} />
      <Text style={styles.headerTitle}>{title}</Text>
      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <AppIcon name="power-settings-new" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSearchAndFilter = () => (
    <View style={styles.controlsContainer}>
      {searchable && (
        <View style={styles.searchContainer}>
          <AppIcon name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AppIcon name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.actionRow}>
        {filterable && filters.length > 0 && (
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setShowFilterModal(true)}
          >
            <AppIcon name="filter-list" size={20} color="#3B82F6" />
            <Text style={styles.filterButtonText}>Filter</Text>
            {Object.values(activeFilters).some(v => v && v !== 'all') && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {Object.values(activeFilters).filter(v => v && v !== 'all').length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionButton, { backgroundColor: action.color || '#3B82F6' }]}
            onPress={action.onPress}
          >
            <AppIcon name={action.icon} size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    if (renderCustomItem) {
      return renderCustomItem(item, index, itemActions);
    }

    return (
      <View style={styles.listItem}>
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => onItemPress && onItemPress(item)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.itemInfo}>
              {columns.slice(0, 2).map((column, colIndex) => {
                const value = column.accessor ? column.accessor(item) : item[column.key];
                const displayValue = column.render ? column.render(value, item) : value;
                
                return (
                  <View key={colIndex} style={styles.headerColumn}>
                    {colIndex === 0 ? (
                      <Text style={styles.primaryValue}>{displayValue}</Text>
                    ) : (
                      <Text style={styles.secondaryValue}>{displayValue}</Text>
                    )}
                  </View>
                );
              })}
            </View>
            {item.status && (
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#10B981' : '#EF4444' }]} />
                <Text style={[styles.statusText, { color: item.status === 'active' ? '#10B981' : '#EF4444' }]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            )}
          </View>

          {columns.length > 2 && (
            <View style={styles.cardBody}>
              {columns.slice(2).map((column, colIndex) => {
                const value = column.accessor ? column.accessor(item) : item[column.key];
                const displayValue = column.render ? column.render(value, item) : value;
                
                return (
                  <View key={colIndex + 2} style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{column.label}:</Text>
                    <Text style={styles.infoValue}>{displayValue}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </TouchableOpacity>

        {itemActions.length > 0 && (
          <View style={styles.itemActions}>
            {itemActions.map((action, actionIndex) => (
              <TouchableOpacity
                key={actionIndex}
                style={[styles.itemActionButton, { backgroundColor: (action.color || '#6B7280') + '15' }]}
                onPress={() => action.onPress(item)}
              >
                <AppIcon name={action.icon} size={16} color={action.color || '#6B7280'} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <AppIcon name="chevron-left" size={20} color={currentPage === 1 ? '#9CA3AF' : '#3B82F6'} />
        </TouchableOpacity>

        <Text style={styles.paginationText}>
          Page {currentPage} of {totalPages} ({filteredData.length} items)
        </Text>

        <TouchableOpacity
          style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <AppIcon name="chevron-right" size={20} color={currentPage === totalPages ? '#9CA3AF' : '#3B82F6'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSummaryCards = () => {
    if (!showSummary || summaryCards.length === 0) {
      // Default summary based on data
      const defaultSummary = [
        { label: 'Total', value: data.length, color: '#111827' },
        { label: 'Active', value: data.filter(item => item.status === 'active').length, color: '#10B981' },
        { label: 'Inactive', value: data.filter(item => item.status === 'inactive').length, color: '#EF4444' }
      ];
      
      if (data.length === 0) return null;
      
      return (
        <View style={styles.summaryContainer}>
          {defaultSummary.map((card, index) => (
            <View key={index} style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: card.color }]}>{card.value}</Text>
              <Text style={styles.summaryLabel}>{card.label}</Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.summaryContainer}>
        {summaryCards.map((card, index) => (
          <View key={index} style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: card.color || '#111827' }]}>{card.value}</Text>
            <Text style={styles.summaryLabel}>{card.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderEmpty = () => {
    if (EmptyComponent) {
      return <EmptyComponent />;
    }

    return (
      <View style={styles.emptyContainer}>
        <AppIcon name="inbox" size={64} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>No items found</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery || Object.values(activeFilters).some(v => v && v !== 'all')
            ? 'Try adjusting your search or filters'
            : 'There are no items to display'
          }
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderFilterModal()}
      {renderHeader()}
      {renderSearchAndFilter()}
      {renderSummaryCards()}
      
      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        style={styles.list}
        contentContainerStyle={paginatedData.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={renderEmpty}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
        showsVerticalScrollIndicator={false}
      />

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#111827',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  list: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  headerColumn: {
    marginBottom: 4,
  },
  primaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  secondaryValue: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  itemActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
    gap: 8,
  },
  itemActionButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  paginationButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    paddingHorizontal: 20,
    maxHeight: 300,
  },
  filterSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedFilter: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
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
});

export default ReusableList;