// Deep linking utilities for LokSetu app

export const DEEP_LINK_SCHEMES = {
  RESET_PASSWORD: 'loksetu://reset-password',
  HTTP_FALLBACK: 'http://frontend-app/reset-password',
  HTTPS_FALLBACK: 'https://frontend-app/reset-password'
};

/**
 * Parse reset token from deep link URL
 * @param {string} url - The deep link URL
 * @returns {string|null} - The reset token or null if not found
 */
export const parseResetToken = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('token');
  } catch (error) {
    console.error('Error parsing reset token from URL:', error);
    return null;
  }
};

/**
 * Check if URL is a reset password deep link
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a reset password link
 */
export const isResetPasswordLink = (url) => {
  if (!url) return false;
  
  return url.includes('reset-password') && url.includes('token=');
};

/**
 * Generate reset password deep link (for backend use)
 * @param {string} token - The reset token
 * @returns {string} - The deep link URL
 */
export const generateResetPasswordLink = (token) => {
  return `${DEEP_LINK_SCHEMES.RESET_PASSWORD}?token=${encodeURIComponent(token)}`;
};