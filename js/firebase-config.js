/**
 * Firebase Configuration - Prabhat Maharjan Studio
 * =================================================
 * INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (name: "prabhat-maharjan")
 * 3. Click "Add app" → Web (</>)
 * 4. Copy your firebaseConfig object below
 * 5. Enable Storage: Build → Storage → Get started
 * 6. Set Storage Rules to allow reads (public) and writes (authenticated or open for now)
 */

// ⬇ REPLACE WITH YOUR FIREBASE CONFIG
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase is active only when config is filled
window.FIREBASE_READY = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
