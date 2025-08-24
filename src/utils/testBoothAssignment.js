// Test utility for booth assignment functionality
export const testBoothAssignment = {
  // Mock booth boys data for testing
  mockBoothBoys: [
    {
      UserID: 1,
      FullName: 'Test Booth Boy 1',
      Phone: '9876543210',
      AssignedBoothIDs: '195001,195002'
    },
    {
      UserID: 2,
      FullName: 'Test Booth Boy 2',
      Phone: '9876543211',
      AssignedBoothIDs: ''
    }
  ],

  // Mock booths data for testing
  mockBooths: [
    {
      partId: '195001',
      partNumber: '001',
      partName: 'Test Booth 1'
    },
    {
      partId: '195002',
      partNumber: '002',
      partName: 'Test Booth 2'
    },
    {
      partId: '195003',
      partNumber: '003',
      partName: 'Test Booth 3'
    }
  ],

  // Test booth assignment logic
  testAssignment: (boothBoyId, boothIds, currentAssignments = {}) => {
    console.log('Testing booth assignment:');
    console.log('Booth Boy ID:', boothBoyId);
    console.log('Booth IDs to assign:', boothIds);
    console.log('Current assignments:', currentAssignments);
    
    // Simulate assignment
    const newAssignments = { ...currentAssignments };
    newAssignments[boothBoyId] = [...(newAssignments[boothBoyId] || []), ...boothIds];
    
    console.log('New assignments:', newAssignments);
    return newAssignments;
  }
};