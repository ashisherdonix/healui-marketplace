import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  ApplicationVerifier,
  Auth
} from 'firebase/auth';
import { auth } from '../../credentials';

export interface OTPResponse {
  success: boolean;
  confirmationResult?: ConfirmationResult;
  error?: string;
  retry?: boolean;
}

export interface VerifyOTPResponse {
  success: boolean;
  user?: any;
  error?: string;
}

class FirebaseAuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private auth: Auth;

  constructor() {
    this.auth = auth;
  }

  // Initialize reCAPTCHA verifier
  initializeRecaptcha(containerId: string = 'recaptcha-container'): void {
    try {
      console.log('🔄 FirebaseAuth - Initializing reCAPTCHA for container:', containerId);
      
      // Ensure we're in browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.error('❌ FirebaseAuth - Not in browser environment');
        throw new Error('reCAPTCHA can only be initialized in browser environment');
      }
      
      // Check if container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('❌ FirebaseAuth - reCAPTCHA container not found:', containerId);
        throw new Error(`reCAPTCHA container '${containerId}' not found in DOM`);
      }
      
      console.log('✅ FirebaseAuth - reCAPTCHA container found');

      if (this.recaptchaVerifier) {
        console.log('🔄 FirebaseAuth - Clearing existing reCAPTCHA verifier');
        this.recaptchaVerifier.clear();
      }

      console.log('🔄 FirebaseAuth - Creating new RecaptchaVerifier');
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible',
        callback: (response: any) => {
          console.log('✅ FirebaseAuth - reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('⚠️ FirebaseAuth - reCAPTCHA expired, reinitializing');
          this.initializeRecaptcha(containerId);
        }
      });
      
      console.log('✅ FirebaseAuth - RecaptchaVerifier created successfully');
    } catch (error) {
      console.error('❌ FirebaseAuth - Error initializing reCAPTCHA:', error);
      throw error;
    }
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber: string, retryCount: number = 0): Promise<OTPResponse> {
    try {
      console.log('🔄 FirebaseAuth - Send OTP called with phone:', phoneNumber);
      
      // Ensure phone number has country code
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      console.log('📞 FirebaseAuth - Formatted phone:', formattedPhone);
      
      // Initialize reCAPTCHA if not already done
      if (!this.recaptchaVerifier) {
        console.log('🔄 FirebaseAuth - Initializing reCAPTCHA...');
        this.initializeRecaptcha();
      }

      if (!this.recaptchaVerifier) {
        console.error('❌ FirebaseAuth - Failed to initialize reCAPTCHA verifier');
        throw new Error('Failed to initialize reCAPTCHA verifier');
      }
      
      console.log('✅ FirebaseAuth - reCAPTCHA verifier ready');
      console.log('🔄 FirebaseAuth - Calling signInWithPhoneNumber...');

      const confirmationResult = await signInWithPhoneNumber(
        this.auth,
        formattedPhone,
        this.recaptchaVerifier as ApplicationVerifier
      );
      
      console.log('✅ FirebaseAuth - signInWithPhoneNumber successful');

      return {
        success: true,
        confirmationResult
      };

    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many requests. Please try again later.',
          retry: false
        };
      }
      
      if (error.code === 'auth/invalid-phone-number') {
        return {
          success: false,
          error: 'Invalid phone number format.',
          retry: false
        };
      }

      if (error.code === 'auth/quota-exceeded') {
        return {
          success: false,
          error: 'SMS quota exceeded. Please try again later.',
          retry: false
        };
      }

      // For reCAPTCHA errors, try to reinitialize and retry once
      if ((error.code === 'auth/recaptcha-not-enabled' || 
           error.code === 'auth/missing-verification-code') && 
          retryCount < 1) {
        
        console.log('Retrying OTP send with fresh reCAPTCHA...');
        this.clearRecaptcha();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return this.sendOTP(phoneNumber, retryCount + 1);
      }

      return {
        success: false,
        error: error.message || 'Failed to send OTP. Please try again.',
        retry: retryCount < 2
      };
    }
  }

  // Verify OTP
  async verifyOTP(confirmationResult: ConfirmationResult, otp: string): Promise<VerifyOTPResponse> {
    try {
      const result = await confirmationResult.confirm(otp);
      
      return {
        success: true,
        user: result.user
      };

    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      if (error.code === 'auth/invalid-verification-code') {
        return {
          success: false,
          error: 'Invalid OTP. Please check and try again.'
        };
      }
      
      if (error.code === 'auth/code-expired') {
        return {
          success: false,
          error: 'OTP has expired. Please request a new one.'
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to verify OTP. Please try again.'
      };
    }
  }

  // Clear reCAPTCHA verifier
  clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      this.clearRecaptcha();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: any) => void) {
    return this.auth.onAuthStateChanged(callback);
  }

  // Get Firebase user token
  async getUserToken(): Promise<string | null> {
    try {
      const user = this.getCurrentUser();
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;