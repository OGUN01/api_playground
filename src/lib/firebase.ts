// Import required functions
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp6OjsGtE_o9XB_RxsKWT3t5lvQDuv3KY",
  authDomain: "chatbot-4fb3c.firebaseapp.com",
  databaseURL: "https://chatbot-4fb3c-default-rtdb.firebaseio.com",
  projectId: "chatbot-4fb3c",
  storageBucket: "chatbot-4fb3c.firebasestorage.app",
  messagingSenderId: "80965528035",
  appId: "1:80965528035:web:3942d13c205481da2c18d6",
  measurementId: "G-999SKM95BH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services only in browser environment
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const auth = getAuth(app);

// Helper function to safely log events
const logAnalyticsEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export { analytics, db, realtimeDb, auth, logAnalyticsEvent };