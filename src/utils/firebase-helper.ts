// Firebase helper utilities for better error handling and device detection

export const clearFirebaseCache = (): void => {
  try {
    // Clear any Firebase-related cache in localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('firebase:') || key.includes('recaptcha')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage as well
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('firebase:') || key.includes('recaptcha')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('Firebase cache cleared');
  } catch {
    console.error('Error clearing Firebase cache');
  }
};

export const isMobileDevice = (): boolean => {
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  } catch {
    return false;
  }
};

export const isIOSDevice = (): boolean => {
  try {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  } catch {
    return false;
  }
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If already formatted correctly
  if (phone.startsWith('+91') && phone.length === 13) {
    return phone;
  }
  
  // Default case - assume Indian number
  return `+91${cleaned.slice(-10)}`;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid 10-digit Indian number
  if (cleaned.length === 10 && cleaned.startsWith('6789'.charAt(0))) {
    return /^[6-9]\d{9}$/.test(cleaned);
  }
  
  // Check if it's a valid Indian number with country code
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const number = cleaned.slice(2);
    return /^[6-9]\d{9}$/.test(number);
  }
  
  return false;
};

export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/invalid-phone-number': 'Please enter a valid phone number',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/quota-exceeded': 'SMS limit exceeded. Please try again later',
    'auth/invalid-verification-code': 'Invalid OTP. Please check and try again',
    'auth/code-expired': 'OTP has expired. Please request a new one',
    'auth/session-expired': 'Session expired. Please try again',
    'auth/missing-verification-code': 'Please enter the OTP',
    'auth/invalid-verification-id': 'Invalid session. Please restart the process',
    'auth/credential-already-in-use': 'This phone number is already registered',
    'auth/operation-not-allowed': 'Phone authentication is not enabled',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this phone number',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/internal-error': 'Something went wrong. Please try again',
    'auth/recaptcha-not-enabled': 'Security verification failed. Please try again',
    'auth/missing-verification-id': 'Verification session not found. Please restart',
    'auth/invalid-app-credential': 'App verification failed. Please contact support'
  };
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again';
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await delay(delayMs * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
};

export const generateDeviceId = (): string => {
  try {
    // Try to get existing device ID from localStorage
    let deviceId = localStorage.getItem('healui_device_id');
    
    if (!deviceId) {
      // Generate a new device ID
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('healui_device_id', deviceId);
    }
    
    return deviceId;
  } catch {
    // Fallback if localStorage is not available
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

export const isNetworkAvailable = (): boolean => {
  try {
    return navigator.onLine;
  } catch {
    return true; // Assume network is available if we can't detect
  }
};

export const debugFirebaseAuth = (message: string, data?: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Firebase Auth Debug] ${message}`, data);
  }
};

export default {
  clearFirebaseCache,
  isMobileDevice,
  isIOSDevice,
  formatPhoneNumber,
  validatePhoneNumber,
  getFirebaseErrorMessage,
  delay,
  retryOperation,
  generateDeviceId,
  isNetworkAvailable,
  debugFirebaseAuth
};