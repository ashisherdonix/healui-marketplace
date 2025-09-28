import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBZPX8-FEkWADjckDZXEsAuCimwohjLQuQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "healui.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "healui",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "healui.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "85550761100",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:85550761100:web:cdfb0fef208268f7ee27a9",
  measurementId: "G-EYK90BMGVK"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Note: Emulator connection disabled to use real Firebase service
// Uncomment below if you want to use Firebase emulator in development:
// if (process.env.NODE_ENV === 'development' && !auth.emulatorConfig) {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099');
//   } catch (error) {
//     console.log('Firebase auth emulator connection skipped:', error);
//   }
// }

export { auth, app };
export default app;