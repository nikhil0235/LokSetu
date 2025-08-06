export const mockVoters = [
  {
    epic_id: 'ABC1234567',
    name: 'राम कुमार',
    age: 35,
    gender: 'male',
    mobile: '9876543210',
    booth_id: 'B001',
    constituency_id: 'C001',
    photo_url: null,
    address: 'गांव - रामपुर, पोस्ट - सीतापुर'
  },
  {
    epic_id: 'DEF2345678',
    name: 'सीता देवी',
    age: 28,
    gender: 'female',
    mobile: '9876543211',
    booth_id: 'B001',
    constituency_id: 'C001',
    photo_url: null,
    address: 'गांव - श्यामपुर, पोस्ट - गीतापुर'
  },
  {
    epic_id: 'GHI3456789',
    name: 'मोहन लाल',
    age: 42,
    gender: 'male',
    mobile: '9876543212',
    booth_id: 'B002',
    constituency_id: 'C001',
    photo_url: null,
    address: 'गांव - हरिपुर, पोस्ट - कृष्णापुर'
  }
];

export const mockConstituencies = [
  {
    constituency_id: 'C001',
    name: 'पटना साहिब',
    district: 'पटना',
    totalVoters: 245000,
    totalBooths: 320
  }
];

export const mockBooths = [
  {
    booth_id: 'B001',
    name: 'प्राथमिक विद्यालय रामपुर',
    constituency_id: 'C001',
    totalVoters: 850,
    address: 'रामपुर गांव, पटना'
  },
  {
    booth_id: 'B002',
    name: 'मध्य विद्यालय हरिपुर',
    constituency_id: 'C001',
    totalVoters: 920,
    address: 'हरिपुर गांव, पटना'
  }
];