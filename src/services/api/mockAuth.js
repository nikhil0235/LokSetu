import { USER_ROLES } from './config';

// WARNING: In production, use secure credential management
export const mockCredentials = [
  { 
    username: 'super_admin', 
    password: process.env.SUPER_ADMIN_PASSWORD || 'super123', 
    role: USER_ROLES.SUPER_ADMIN,
    name: 'Super Administrator',
    email: 'super@loksetu.com',
    permissions: ['all']
  },
  { 
    username: 'admin1', 
    password: process.env.ADMIN_PASSWORD || 'admin123', 
    role: USER_ROLES.ADMIN,
    name: 'Rajesh Kumar',
    email: 'rajesh@loksetu.com',
    constituency: 'Constituency-1',
    permissions: ['booth_management', 'data_collection', 'reports']
  },
  { 
    username: 'admin2', 
    password: process.env.ADMIN_PASSWORD || 'admin123', 
    role: USER_ROLES.ADMIN,
    name: 'Priya Singh',
    email: 'priya@loksetu.com',
    constituency: 'Constituency-2',
    permissions: ['booth_management', 'data_collection', 'reports']
  },
  { 
    username: 'admin3', 
    password: process.env.ADMIN_PASSWORD || 'admin123', 
    role: USER_ROLES.ADMIN,
    name: 'Amit Sharma',
    email: 'amit@loksetu.com',
    constituency: 'Constituency-3',
    permissions: ['booth_management', 'data_collection', 'reports']
  },
  { 
    username: 'booth1', 
    password: process.env.BOOTH_PASSWORD || 'booth123', 
    role: USER_ROLES.BOOTH_BOY,
    name: 'Suresh Patel',
    email: 'suresh@loksetu.com',
    assignedBooths: ['Booth-145', 'Booth-146'],
    permissions: ['voter_data_entry', 'booth_management', 'data_sync']
  }
];

export const mockLogin = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockCredentials.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return {
    user: { 
      id: Date.now(), 
      username: user.username, 
      role: user.role,
      name: user.name,
      email: user.email,
      constituency: user.constituency || null
    },
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    permissions: user.permissions,
    expiresAt: Date.now() + 3600000,
    sessionId: 'session-' + Date.now(),
    ipAddress: '192.168.1.1'
  };
};