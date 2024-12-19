import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2NVNZyekL1W_8U8UwUxvfWjjh-qnDw1o",
  authDomain: "iotapp-4afb3.firebaseapp.com",
  projectId: "iotapp-4afb3",
  storageBucket: "iotapp-4afb3.appspot.com",
  messagingSenderId: "1034102578884",
  appId: "1:1034102578884:web:7c4b7d1976ccf981b37391",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };