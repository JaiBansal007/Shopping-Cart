import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { createContext, useContext, ReactNode } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/firestore'; // For Firestore
// Define the shape of the context value
interface FirebaseContextType {
  signupwithemailandpassword: (email: string, password: string) => Promise<void>;
  putdata: (data: any, key: string) => Promise<void>;
}

const firebaseConfig = {
  apiKey: "AIzaSyCGl7iRYLvs4Ejzlii13YdwqiYDf2z-gfc",
  authDomain: "shopkaro-734e4.firebaseapp.com",
  projectId: "shopkaro-734e4",
  storageBucket: "shopkaro-734e4.appspot.com",
  messagingSenderId: "911474669913",
  appId: "1:911474669913:web:9ff2864ce9a09334e0f448",
  measurementId: "G-W8T02DBQNQ"
};

// Create context with the correct type
const FireBaseContext = createContext<FirebaseContextType | null>(null);

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FireBaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const database = getDatabase();
export const db = getFirestore(app);
// FirebaseProvider to wrap around components
interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  // Function to handle signup with email and password
  const signupwithemailandpassword = async (email: string, password: string): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  // Function to write data to Firebase Realtime Database
  const putdata = async (data: any, key: string): Promise<void> => {
    try {
      await set(ref(database, key), data);
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Providing the functions through context
  return (
    <FireBaseContext.Provider value={{ signupwithemailandpassword, putdata }}>
      {children}
    </FireBaseContext.Provider>
  );
};

export default app;
