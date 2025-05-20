// Import the functions you need from the SDKs
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getDatabase } from "firebase/database"; // Realtime Database
import { getStorage } from "firebase/storage"; // Storage
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getMessaging } from 'firebase/messaging';


const firebaseConfig = {
  apiKey: "AIzaSyDc2-G9-Oi_xDJA7y0HTRjvN-fqFN03-FM",
  authDomain: "assistant-living-app.firebaseapp.com",
  databaseURL: "https://assistant-living-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "assistant-living-app",
  storageBucket: "assistant-living-app.firebasestorage.app",
  messagingSenderId: "494132450390",
  appId: "1:494132450390:web:fb4a0aa63736935d77d7f7",
  measurementId: "G-MRK458DFE0"
};


let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the default app
}

const db = getDatabase(app);
const firestore = getFirestore(app); // Firestore

const storage = getStorage(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})


export { app, db, storage, auth,firestore  };
