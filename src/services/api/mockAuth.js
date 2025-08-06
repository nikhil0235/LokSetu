export const mockCredentials = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user1', password: 'user123', role: 'user' },
  { username: 'user2', password: 'user456', role: 'user' }
];

export const mockLogin = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockCredentials.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return {
    user: { id: 1, username: user.username, role: user.role },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
    permissions: ['read', 'write'],
    expiresAt: Date.now() + 3600000,
    sessionId: 'session-123'
  };
};