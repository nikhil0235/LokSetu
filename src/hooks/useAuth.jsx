// Dummy implementation of AuthService (api/authService.js)
class AuthService {
  static async loginWithPassword(username, password) {
    console.log(`Simulating login for user: ${username}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === 'testuser' && password === 'password123') {
      return {
        token: 'dummy-jwt-token',
        user: {
          id: 1,
          name: 'Test User',
          username: 'testuser',
        },
      };
    } else {
      throw new Error('Invalid username or password');
    }
  }

  static async sendOTP(phoneNumber) {
    console.log(`Simulating sending OTP to: +91${phoneNumber}`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Always succeeds
    return {
      success: true,
      message: 'OTP sent successfully (dummy)',
    };
  }

  static async verifyOTP(phoneNumber, otp) {
    console.log(`Simulating OTP verification for +91${phoneNumber} with OTP: ${otp}`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (otp === '123456') {
      return {
        token: 'dummy-jwt-token',
        user: {
          id: 2,
          name: 'OTP User',
          phoneNumber: `+91${phoneNumber}`,
        },
      };
    } else {
      throw new Error('Invalid OTP');
    }
  }
}

export default AuthService;
